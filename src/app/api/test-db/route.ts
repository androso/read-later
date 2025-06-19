import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Bookmark from '@/models/Bookmark';
import Tag from '@/models/Tag';
import Collection from '@/models/Collection';

export async function GET() {
  try {
    await dbConnect();
    
    // Test the connection by counting documents in each collection
    const [userCount, bookmarkCount, tagCount, collectionCount] = await Promise.all([
      User.countDocuments(),
      Bookmark.countDocuments(),
      Tag.countDocuments(),
      Collection.countDocuments(),
    ]);
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      counts: {
        users: userCount,
        bookmarks: bookmarkCount,
        tags: tagCount,
        collections: collectionCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 