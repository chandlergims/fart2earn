import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { setCookie, getCookie } from 'cookies-next';

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find or create user
    let user = await User.findOne({ walletAddress });
    
    if (!user) {
      // Create new user if not found
      user = await User.create({
        walletAddress,
        createdAt: new Date(),
        lastLogin: new Date(),
      });
    } else {
      // Update last login time
      user.lastLogin = new Date();
      await user.save();
    }

    // Set a cookie for the session in the response
    const response = NextResponse.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
      }
    });
    
    // Set cookie on the response
    response.cookies.set('walletAddress', walletAddress, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return response;

  } catch (error) {
    console.error('Error authenticating wallet:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate wallet' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.cookies.get('walletAddress')?.value;

    if (!walletAddress) {
      return NextResponse.json({ authenticated: false });
    }

    // Connect to the database
    await connectToDatabase();

    // Find user
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        walletAddress: user.walletAddress,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return NextResponse.json(
      { error: 'Failed to check authentication' },
      { status: 500 }
    );
  }
}
