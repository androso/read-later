import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	console.log(`[Middleware] Processing request to: ${pathname}`);
	
	// Check if this is a protected API route
	const protectedRoutes = ['/api/bookmarks', '/api/tags', '/api/collections', '/api/users'];
	const isProtected = protectedRoutes.some(route => 
		pathname === route || pathname.startsWith(route + '/')
	);
	
	if (!isProtected) {
		console.log(`[Middleware] Route ${pathname} is not protected, skipping`);
		return NextResponse.next();
	}
	
	// Get token from Authorization header
	const authHeader = request.headers.get("authorization");
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.substring(7)
		: null;
	console.log({token})
	console.log(`[Middleware] Auth header present: ${!!authHeader}, Token extracted: ${!!token}`);

	if (!token) {
		console.log(`[Middleware] No token provided for ${pathname}`);
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
		const secret = new TextEncoder().encode(jwtSecret);
		const { payload } = await jwtVerify(token, secret);
		const decoded = payload as { userId: string };
		console.log(`[Middleware] JWT decoded successfully. User ID: ${decoded.userId}`);

		// Add user ID to headers so route handlers can access it
		const requestHeaders = new Headers(request.headers);
		requestHeaders.set("x-user-id", decoded.userId);
		console.log(`[Middleware] Added x-user-id header: ${decoded.userId}`);

		return NextResponse.next({
			request: {
				headers: requestHeaders,
			},
		});
	} catch (jwtError) {
		console.log(`[Middleware] JWT verification failed:`, jwtError);
		return NextResponse.json(
			{ success: false, message: "Invalid or expired token" },
			{ status: 401 }
		);
	}
}

export const config = {
	matcher: "/api/:path*",
};