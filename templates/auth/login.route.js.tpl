import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

// POST /api/auth/login
export async function POST(request) {
  await dbConnect();
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Explicitly select password (it's select: false in schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = signToken({ id: user._id, role: user.role });

    return NextResponse.json(
      {
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
