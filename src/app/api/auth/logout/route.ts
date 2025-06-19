import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // For JWT-based auth, we don't need to do anything server-side
    // The client will just remove the token from storage
    // In a session-based auth system, you would clear the session here
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
    
  } catch (error) {
    console.error('Error during logout:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Logout failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 