import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { uploadFileToFirebase } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    console.log('Starting file upload process...');
    
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Check if the file is an audio file
    if (!file.type.includes('audio')) {
      console.log(`Invalid file type: ${file.type}`);
      return NextResponse.json(
        { error: 'Only audio files are allowed' },
        { status: 400 }
      );
    }

    // Get file extension
    const fileExtension = file.name.split('.').pop() || 'mp3';
    
    // Generate a unique filename
    const fileName = `fart_${uuidv4()}.${fileExtension}`;
    
    console.log(`Generated filename: ${fileName}`);
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    console.log(`Uploading file to Firebase...`);
    
    // Upload file to Firebase Storage
    const fileUrl = await uploadFileToFirebase(buffer, fileName, file.type);
    
    console.log(`File uploaded to Firebase: ${fileName}`);
    console.log(`File URL: ${fileUrl}`);
    
    return NextResponse.json({
      success: true,
      fileName,
      fileUrl,
      originalName: file.name,
      size: file.size,
      type: file.type
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: `Failed to upload file: ${error.message}` },
      { status: 500 }
    );
  }
}
