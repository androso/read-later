import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Bookmark from '@/models/Bookmark';
import { bookmarkQuerySchema } from '@/lib/validations/bookmark';

// GET /api/bookmarks/count - Get user's bookmark count with optional filtering
export async function GET(request: NextRequest) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get('x-user-id')!;

    await dbConnect();

    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams);
    
    // Only validate the isUnread parameter from the full schema
    let isUnread: boolean | undefined;
    if (queryParams.isUnread !== undefined) {
      isUnread = queryParams.isUnread === 'true';
    }

    // Build query - same logic as main bookmarks endpoint for consistency
    const query: any = { user: userId };
    
    // Add isUnread filter if provided
    if (isUnread !== undefined) {
      query.isUnread = isUnread;
    }

    // Get count with filters
    const count = await Bookmark.countDocuments(query);

    return NextResponse.json({
      success: true,
      count,
    }, {
      headers: {
        'Cache-Control': 'private, max-age=60', // Cache for 1 minute (shorter than before since counts can change more frequently)
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