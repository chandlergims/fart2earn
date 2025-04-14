import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Fart from '@/models/Fart';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Count total users
    const totalUsers = await User.countDocuments({});
    
    // Count total farts
    const totalFarts = await Fart.countDocuments({});
    
    // Calculate total rewards (hardcoded for now)
    const totalRewards = '420.69 SOL';
    
    return NextResponse.json({
      totalUsers,
      totalFarts,
      totalRewards
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
