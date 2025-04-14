import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Fart from '@/models/Fart';

// GET endpoint to fetch all farts
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const url = new URL(req.url);
    
    // Check if we just need the count
    if (url.searchParams.get('count') === 'true') {
      const count = await Fart.countDocuments({});
      return NextResponse.json({ count });
    }
    
    const limit = parseInt(url.searchParams.get('limit') || '24');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Get sort parameter
    const sort = url.searchParams.get('sort');
    let sortOption: Record<string, 1 | -1> = { uploadDate: -1 }; // Default sort by upload date (newest first)
    
    // Build query
    let query: any = {};
    
    console.log(`Sorting by: ${sort}`);
    
    if (sort === 'likes') {
      sortOption = { likes: -1 }; // Sort by most likes
      console.log('Sorting by likes');
    } else if (sort === 'dislikes') {
      sortOption = { dislikes: -1 }; // Sort by most dislikes
      console.log('Sorting by dislikes');
    } else if (sort === 'date') {
      sortOption = { uploadDate: -1 }; // Sort by most recent
      console.log('Sorting by date');
    }
    
    console.log(`Query: ${JSON.stringify(query)}`);
    console.log(`Sort option: ${JSON.stringify(sortOption)}`);
    console.log(`Skip: ${skip}, Limit: ${limit}`);
    
    // Fetch farts with pagination
    const farts = await Fart.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    
    console.log(`Found ${farts.length} farts`);
    if (farts.length > 0) {
      console.log(`First fart: ${farts[0].name}, likes: ${farts[0].likes}, dislikes: ${farts[0].dislikes}`);
      console.log(`Last fart: ${farts[farts.length - 1].name}, likes: ${farts[farts.length - 1].likes}, dislikes: ${farts[farts.length - 1].dislikes}`);
    }
    
    // Get total count for pagination based on the same query
    const total = await Fart.countDocuments(query);
    console.log(`Total farts: ${total}`);
    
    return NextResponse.json({
      farts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching farts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch farts' },
      { status: 500 }
    );
  }
}

// POST endpoint to upload a new fart
export async function POST(req: NextRequest) {
  try {
    // In a real application, we would handle file uploads here
    // For now, we'll just simulate it by accepting the file details in the request body
    
    const { name, fileName, fileUrl, uploader } = await req.json();
    
    if (!name || !fileName || !fileUrl || !uploader) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Create a new fart record
    const fart = await Fart.create({
      name,
      fileName,
      fileUrl,
      uploader,
      uploadDate: new Date(),
      likes: 0,
      dislikes: 0,
      voters: []
    });
    
    return NextResponse.json({
      success: true,
      fart
    });
  } catch (error) {
    console.error('Error uploading fart:', error);
    return NextResponse.json(
      { error: 'Failed to upload fart' },
      { status: 500 }
    );
  }
}
