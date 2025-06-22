import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request: NextRequest) {
	// Get token from Authorization header
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.substring(7)
		: null;

	if (!token) {
		return NextResponse.json(
			{ success: false, message: "No token provided" },
			{ status: 401 }
		);
	}

	// Verify JWT token
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		console.error("JWT_SECRET is not defined in environment variables");
		return NextResponse.json(
			{ success: false, message: "Server configuration error" },
			{ status: 500 }
		);
	}

	try {
		const decoded = jwt.verify(token, jwtSecret) as { userId: string };

		// Add user ID to headers so route handlers can access it
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-user-id", decoded.userId);

		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	} catch (jwtError) {
		return NextResponse.json(
			{ success: false, message: "Invalid or expired token" },
			{ status: 401 }
		);
	}
}

export const config = {
	matcher: [
		"/api/bookmarks/:path*",
		"/api/tags/:path*",
		"/api/collections/:path*",
		"/api/users/:path*",
	],
};
