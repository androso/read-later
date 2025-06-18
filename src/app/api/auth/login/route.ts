import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, password } = body;

    // Basic required field checks
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email and password are required',
        },
        { status: 400 }
      );
    }
    
    // Find user by email and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }
    
    // Check password
    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid email or password',
        },
        { status: 401 }
      );
    }
    
    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not defined in environment variables');
      return NextResponse.json(
        {
          success: false,
          message: 'Server configuration error',
        },
        { status: 500 }
      );
    }
    
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email 
      },
      jwtSecret,
      { expiresIn: '7d' }
    );
    
    // Remove password from user response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        token,
      },
    });
    
  } catch (error) {
    console.error('Error during login:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'Login failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
} 