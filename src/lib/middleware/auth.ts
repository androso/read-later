import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
}

export async function authenticateUser(request: NextRequest): Promise<{ 
  authenticated: boolean; 
  userId?: string; 
  error?: string;
}> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : null;

    if (!token) {
      return { authenticated: false, error: 'No token provided' };
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return { authenticated: false, error: 'Server configuration error' };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { userId: string };
    } catch (jwtError) {
      return { authenticated: false, error: 'Invalid or expired token' };
    }

    // Verify user exists
    await dbConnect();
    const user = await User.findById(decoded.userId);
    if (!user) {
      return { authenticated: false, error: 'User not found' };
    }

    return { authenticated: true, userId: decoded.userId };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error: 'Authentication failed' };
  }
} 