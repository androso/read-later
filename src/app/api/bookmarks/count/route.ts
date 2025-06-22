import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';

// GET /api/bookmarks/count - Get user's total bookmark count
export async function GET(request: NextRequest) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get('x-user-id')!;

    await dbConnect();

    // Get total count for user
    const count = await Bookmark.countDocuments({ user: userId });

    return NextResponse.json({
      success: true,
      count,
    }, {
      headers: {
        'Cache-Control': 'private, max-age=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('Error getting bookmark count:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get bookmark count',
        count: 0,
      },
      { status: 500 }
    );
  }
} 