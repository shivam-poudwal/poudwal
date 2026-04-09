import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import {{modelName}} from '@/models/{{modelName}}';

// GET /api/{{routeName}}
export async function GET(request: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const items = await {{modelName}}.find({}).lean();
    return NextResponse.json({ success: true, data: items }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/{{routeName}}
export async function POST(request: NextRequest): Promise<NextResponse> {
  await dbConnect();
  try {
    const body = await request.json();
    const item = await {{modelName}}.create(body);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
