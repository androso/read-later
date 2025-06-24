import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import Tag from "@/models/Tag";
import Collection from "@/models/Collection";
import { updateBookmarkSchema } from "@/lib/validations/bookmark";

// DELETE /api/bookmarks/[id] - Delete a specific bookmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get("x-user-id")!;
    await dbConnect();

    const { id: bookmarkId } = await params;

    // Find and delete the bookmark, ensuring it belongs to the user
    const deletedBookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      user: userId,
    });

    if (!deletedBookmark) {
      return NextResponse.json(
        {
          success: false,
          message: "Bookmark not found or you don't have permission to delete it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bookmark deleted successfully",
      data: { id: bookmarkId },
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete bookmark",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET /api/bookmarks/[id] - Get a specific bookmark
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get("x-user-id")!;
    await dbConnect();

    const { id: bookmarkId } = await params;

    // Find the bookmark, ensuring it belongs to the user
    const bookmark = await Bookmark.findOne({
      _id: bookmarkId,
      user: userId,
    })
      .populate("tags", "name color")
      .populate("collections", "name icon");

    if (!bookmark) {
      return NextResponse.json(
        {
          success: false,
          message: "Bookmark not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bookmark,
    });
  } catch (error) {
    console.error("Error fetching bookmark:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookmark",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// PATCH /api/bookmarks/[id] - Update a specific bookmark
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get("x-user-id")!;
    await dbConnect();

    const { id: bookmarkId } = await params;
    const body = await request.json();
    
    const validatedData = updateBookmarkSchema.parse(body);

    // Handle tags if provided - create new ones if they don't exist
    let tagIds = undefined;
    if (validatedData.tags !== undefined) {
      tagIds = [];
      for (const tagInput of validatedData.tags) {
        let tag;

        // Check if it's an ID or a name
        if (tagInput.match(/^[0-9a-fA-F]{24}$/)) {
          // It's an ObjectId
          tag = await Tag.findOne({ _id: tagInput, user: userId });
        } else {
          // It's a name - find or create
          tag = await Tag.findOne({
            name: tagInput.toLowerCase(),
            user: userId,
          });
          if (!tag) {
            tag = await Tag.create({
              name: tagInput.toLowerCase(),
              user: userId,
            });
          }
        }

        if (tag) {
          tagIds.push(tag._id);
        }
      }
    }

    // Validate collections exist and belong to user if provided
    if (validatedData.collections !== undefined && validatedData.collections.length > 0) {
      const collections = await Collection.find({
        _id: { $in: validatedData.collections },
        user: userId,
      });
      if (collections.length !== validatedData.collections.length) {
        return NextResponse.json(
          {
            success: false,
            message: "One or more collections not found",
          },
          { status: 400 }
        );
      }
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.image !== undefined) updateData.image = validatedData.image;
    if (validatedData.readingTime !== undefined) updateData.readingTime = validatedData.readingTime;
    if (validatedData.isUnread !== undefined) updateData.isUnread = validatedData.isUnread;
    if (tagIds !== undefined) updateData.tags = tagIds;
    if (validatedData.collections !== undefined) updateData.collections = validatedData.collections;

    // Find and update the bookmark, ensuring it belongs to the user
    const updatedBookmark = await Bookmark.findOneAndUpdate(
      { _id: bookmarkId, user: userId },
      updateData,
      { new: true }
    )
      .populate("tags", "name color")
      .populate("collections", "name icon");

    if (!updatedBookmark) {
      return NextResponse.json(
        {
          success: false,
          message: "Bookmark not found or you don't have permission to update it",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Bookmark updated successfully",
      data: updatedBookmark,
    });
  } catch (error) {
    console.error("Error updating bookmark:", error);

    if (error instanceof Error && error.name === "ValidationError" && 'errors' in error) {
      const mongooseError = error as Error & { errors: Record<string, { path: string; message: string }> };
      const errors = Object.values(mongooseError.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update bookmark",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 