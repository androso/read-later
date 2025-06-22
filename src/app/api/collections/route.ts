import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Collection from '@/models/Collection';
import Bookmark from '@/models/Bookmark';
import { createCollectionSchema } from '@/lib/validations/bookmark';
import mongoose from 'mongoose';

// GET /api/collections - Get user's collections with bookmark counts
export async function GET(request: NextRequest) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get('x-user-id')!;

    await dbConnect();

    // Get collections with bookmark count using aggregation
    const collectionsWithCount = await Collection.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'bookmarks',
          let: { collectionId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$collectionId', '$collections'] },
                    { $eq: ['$user', new mongoose.Types.ObjectId(userId)] }
                  ]
                }
              }
            }
          ],
          as: 'bookmarks'
        }
      },
      {
        $addFields: {
          bookmarkCount: { $size: '$bookmarks' }
        }
      },
      {
        $project: {
          bookmarks: 0
        }
      },
      { $sort: { createdAt: 1 } }
    ]);

    // Add default smart collections if they don't exist
    const defaultSmartCollections = [
      {
        _id: 'all',
        name: 'All Bookmarks',
        icon: '⭐',
        isSmartCollection: true,
        smartCollectionType: 'all',
        bookmarkCount: await Bookmark.countDocuments({ user: userId }),
      },
      {
        _id: 'unread',
        name: 'Unread',
        icon: '📖',
        isSmartCollection: true,
        smartCollectionType: 'unread',
        bookmarkCount: await Bookmark.countDocuments({ user: userId, isUnread: true }),
      },
      {
        _id: 'recent',
        name: 'Recently Added',
        icon: '🔥',
        isSmartCollection: true,
        smartCollectionType: 'recent',
        bookmarkCount: await Bookmark.countDocuments({
          user: userId,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }),
      },
    ];

    return NextResponse.json({
      success: true,
      data: [...defaultSmartCollections, ...collectionsWithCount],
      count: defaultSmartCollections.length + collectionsWithCount.length,
    });

  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch collections',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/collections - Create a new collection
export async function POST(request: NextRequest) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get('x-user-id')!;

    await dbConnect();

    const body = await request.json();
    const validatedData = createCollectionSchema.parse(body);

    // Check if collection name already exists
    const existingCollection = await Collection.findOne({
      name: validatedData.name,
      user: userId,
    });

    if (existingCollection) {
      return NextResponse.json(
        {
          success: false,
          message: 'Collection with this name already exists',
        },
        { status: 400 }
      );
    }

    // Create collection
    const collection = await Collection.create({
      ...validatedData,
      user: userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Collection created successfully',
      data: { ...collection.toObject(), bookmarkCount: 0 },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating collection:', error);

    if (error instanceof Error && error.name === 'ValidationError') {
      const mongooseError = error as any;
      const errors = Object.values(mongooseError.errors).map((err: any) => ({
        field: err.path,
        message: err.message,
      }));
      
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create collection',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 