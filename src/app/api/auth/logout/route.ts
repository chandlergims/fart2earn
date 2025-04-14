import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create a response that clears the wallet cookie
    const response = NextResponse.json({ success: true });
    
    // Clear the wallet cookie
    response.cookies.set('walletAddress', '', {
      expires: new Date(0),
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
