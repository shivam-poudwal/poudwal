import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

// POST /api/auth/register
export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide name, email and password' },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    const user = await User.create({ name, email, password });
    const token = signToken({ id: user._id.toString(), role: user.role });

    return NextResponse.json(
      {
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
