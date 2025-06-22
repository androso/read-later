import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tag from '@/models/Tag';
import Bookmark from '@/models/Bookmark';
import { updateTagSchema } from '@/lib/validations/bookmark';

// PATCH /api/tags/[id] - Update a tag
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get('x-user-id')!;
    const { id } = await params;

    await dbConnect();

    const body = await request.json();
    const validatedData = updateTagSchema.parse(body);

    // Find the tag
    const tag = await Tag.findOne({
      _id: id,
      user: userId,
    });

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tag not found',
        },
        { status: 404 }
      );
    }

    // Check if new name already exists (if name is being changed)
    if (validatedData.name && validatedData.name !== tag.name) {
      const existingTag = await Tag.findOne({
        name: validatedData.name.toLowerCase(),
        user: userId,
        _id: { $ne: id },
      });

      if (existingTag) {
        return NextResponse.json(
          {
            success: false,
            message: 'Tag with this name already exists',
          },
          { status: 400 }
        );
      }
    }

    // Update tag
    Object.assign(tag, validatedData);
    if (validatedData.name) {
      tag.name = validatedData.name.toLowerCase();
    }
    await tag.save();

    // Get bookmark count
    const bookmarkCount = await Bookmark.countDocuments({
      user: userId,
      tags: tag._id,
    });

    return NextResponse.json({
      success: true,
      message: 'Tag updated successfully',
      data: { ...tag.toObject(), count: bookmarkCount },
    });

  } catch (error) {
    console.error('Error updating tag:', error);

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
        message: 'Failed to update tag',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Delete a tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get('x-user-id')!;
    const { id } = await params;

    await dbConnect();

    const tag = await Tag.findOne({
      _id: id,
      user: userId,
    });

    if (!tag) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tag not found',
        },
        { status: 404 }
      );
    }

    // Remove tag from all bookmarks
    await Bookmark.updateMany(
      { user: userId, tags: tag._id },
      { $pull: { tags: tag._id } }
    );

    // Delete the tag
    await tag.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Tag deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete tag',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 