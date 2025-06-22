import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/models/Bookmark";
import Tag from "@/models/Tag";
import Collection from "@/models/Collection";
import {
	createBookmarkSchema,
	bookmarkQuerySchema,
} from "@/lib/validations/bookmark";

// GET /api/bookmarks - Get user's bookmarks with filtering and pagination
export async function GET(request: NextRequest) {
	try {
		// User ID is guaranteed to be set by middleware
		const userId = request.headers.get("x-user-id")!;

		await dbConnect();

		// Parse query parameters
		const { searchParams } = new URL(request.url);
		const queryParams = Object.fromEntries(searchParams);
		const validatedQuery = bookmarkQuerySchema.parse(queryParams);

		// Build query
		const query: any = { user: userId };

		// Search filter
		if (validatedQuery.search) {
			query.$or = [
				{ title: { $regex: validatedQuery.search, $options: "i" } },
				{ description: { $regex: validatedQuery.search, $options: "i" } },
				{ url: { $regex: validatedQuery.search, $options: "i" } },
			];
		}

		// Tags filter
		if (validatedQuery.tags) {
			const tags = Array.isArray(validatedQuery.tags)
				? validatedQuery.tags
				: [validatedQuery.tags];
			query.tags = { $in: tags };
		}

		// Collections filter
		if (validatedQuery.collections) {
			const collections = Array.isArray(validatedQuery.collections)
				? validatedQuery.collections
				: [validatedQuery.collections];
			query.collections = { $in: collections };
		}

		// Unread filter
		if (validatedQuery.isUnread !== undefined) {
			query.isUnread = validatedQuery.isUnread;
		}

		// Date range filter
		if (validatedQuery.dateFrom || validatedQuery.dateTo) {
			query.createdAt = {};
			if (validatedQuery.dateFrom) {
				query.createdAt.$gte = new Date(validatedQuery.dateFrom);
			}
			if (validatedQuery.dateTo) {
				query.createdAt.$lte = new Date(validatedQuery.dateTo);
			}
		}

		// Sort configuration
		const sortField = validatedQuery.sort || "-createdAt";
		const sortOrder = sortField.startsWith("-") ? -1 : 1;
		const sortKey = sortField.replace("-", "");

		// Cursor-based pagination
		const limit = validatedQuery.limit || 20;

		// Add cursor filter for pagination
		if (validatedQuery.cursor) {
			try {
				if (sortKey === "createdAt") {
					// For date-based sorting, use createdAt comparison
					if (sortOrder === -1) {
						// Descending: get items older than cursor
						query.createdAt = {
							...query.createdAt,
							$lt: new Date(validatedQuery.cursor),
						};
					} else {
						// Ascending: get items newer than cursor
						query.createdAt = {
							...query.createdAt,
							$gt: new Date(validatedQuery.cursor),
						};
					}
				} else {
					// For _id-based sorting or other fields, use _id comparison
					if (sortOrder === -1) {
						query._id = { $lt: validatedQuery.cursor };
					} else {
						query._id = { $gt: validatedQuery.cursor };
					}
				}
			} catch (error) {
				console.warn("Invalid cursor provided:", validatedQuery.cursor);
			}
		}

		// Build and execute the bookmark query
		const bookmarks = await Bookmark.find(query)
			.populate("tags", "name color")
			.populate("collections", "name icon")
			.sort({ [sortKey]: sortOrder })
			.limit(limit + 1); // Fetch one extra to determine if there are more items

		// Determine if there are more items and get the next cursor
		const hasMore = bookmarks.length > limit;
		const items = hasMore ? bookmarks.slice(0, limit) : bookmarks;

		let nextCursor = null;
		if (hasMore && items.length > 0) {
			const lastItem = items[items.length - 1];
			// Use createdAt as cursor for time-based sorting, _id for others
			nextCursor =
				sortKey === "createdAt"
					? lastItem.createdAt.toISOString()
					: (lastItem as any)._id.toString();
		}

		const response = {
			success: true,
			data: items,
			pagination: {
				limit,
				hasMore,
				nextCursor,
			},
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error fetching bookmarks:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Failed to fetch bookmarks",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}

// POST /api/bookmarks - Create a new bookmark
export async function POST(request: NextRequest) {
	try {
		// User ID is guaranteed to be set by middleware
		const userId = request.headers.get("x-user-id")!;

		await dbConnect();

		const body = await request.json();
		const validatedData = createBookmarkSchema.parse(body);

		// Handle tags - create new ones if they don't exist
		const tagIds = [];
		if (validatedData.tags && validatedData.tags.length > 0) {
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

		// Validate collections exist and belong to user
		if (validatedData.collections && validatedData.collections.length > 0) {
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

		// Create bookmark
		const bookmark = await Bookmark.create({
			...validatedData,
			user: userId,
			tags: tagIds,
			collections: validatedData.collections || [],
		});

		// Populate references before returning
		await bookmark.populate("tags", "name color");
		await bookmark.populate("collections", "name icon");

		return NextResponse.json(
			{
				success: true,
				message: "Bookmark created successfully",
				data: bookmark,
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Error creating bookmark:", error);

		if (error instanceof Error && error.name === "ValidationError") {
			const mongooseError = error as any;
			const errors = Object.values(mongooseError.errors).map((err: any) => ({
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
				message: "Failed to create bookmark",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
