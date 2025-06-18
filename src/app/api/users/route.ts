import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/users - Get all users
export async function GET() {
  try {
    await dbConnect();
    
    const users = await User.find({}).select('-password'); // Exclude password field
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch users',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
// Note: Using only Mongoose validation here, Zod schemas are for client-side
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, password, role } = body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: 'User with this email already exists',
        },
        { status: 400 }
      );
    }
    
    // Create new user - Mongoose handles validation
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: userResponse,
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => ({
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
    
    // Handle duplicate key error (unique constraint)
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email already exists',
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 