import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tag from '@/models/Tag';
import { createTagSchema } from '@/lib/validations/bookmark';

// GET /api/tags - Get user's tags with bookmark counts
export async function GET(request: NextRequest) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get('x-user-id')!;

    await dbConnect();

    // Get tags with bookmark count using aggregation
    const tagsWithCount = await Tag.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: 'bookmarks',
          let: { tagId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ['$$tagId', '$tags'] },
                    { $eq: ['$user', userId] }
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
          count: { $size: '$bookmarks' }
        }
      },
      {
        $project: {
          bookmarks: 0
        }
      },
      { $sort: { count: -1, name: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: tagsWithCount,
      count: tagsWithCount.length,
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch tags',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get('x-user-id')!;

    await dbConnect();

    const body = await request.json();
    const validatedData = createTagSchema.parse(body);

    // Check if tag already exists
    const existingTag = await Tag.findOne({
      name: validatedData.name.toLowerCase(),
      user: userId,
    });

    if (existingTag) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tag already exists',
        },
        { status: 400 }
      );
    }

    // Create tag
    const tag = await Tag.create({
      ...validatedData,
      name: validatedData.name.toLowerCase(),
      user: userId,
    });

    return NextResponse.json({
      success: true,
      message: 'Tag created successfully',
      data: { ...tag.toObject(), count: 0 },
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tag:', error);

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
        message: 'Failed to create tag',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 