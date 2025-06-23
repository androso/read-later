import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";

// DELETE /api/bookmarks/[id] - Delete a specific bookmark
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get("x-user-id")!;
    await dbConnect();

    const bookmarkId = params.id;

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
  { params }: { params: { id: string } }
) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get("x-user-id")!;
    await dbConnect();

    const bookmarkId = params.id;

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