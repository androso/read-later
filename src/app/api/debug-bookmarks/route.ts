import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";

export async function GET(request: NextRequest) {
  try {
    // User ID is guaranteed to be set by middleware
    const userId = request.headers.get("x-user-id")!;

    await dbConnect();

    // Get all bookmarks for debugging
    const bookmarks = await Bookmark.find({ user: userId })
      .populate("tags", "name color")
      .populate("collections", "name icon")
      .sort({ createdAt: -1 })
      .limit(10);

    // Debug output - show exactly what's in each bookmark
    const debugData = bookmarks.map(bookmark => ({
      _id: bookmark._id,
      title: bookmark.title,
      url: bookmark.url,
      image: bookmark.image,
      hasImage: !!bookmark.image,
      imageLength: bookmark.image ? bookmark.image.length : 0,
      description: bookmark.description,
      createdAt: bookmark.createdAt,
    }));

    return NextResponse.json({
      success: true,
      message: "Debug data for bookmarks",
      data: debugData,
      totalCount: bookmarks.length,
    });

  } catch (error) {
    console.error("Error fetching debug bookmarks:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch debug bookmarks",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
} 