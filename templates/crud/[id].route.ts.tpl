import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import {{modelName}} from '@/models/{{modelName}}';

interface Params {
  params: { id: string };
}

// GET /api/{{routeName}}/[id]
export async function GET(request: NextRequest, { params }: Params): Promise<NextResponse> {
  await dbConnect();
  try {
    const item = await {{modelName}}.findById(params.id).lean();
    if (!item) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/{{routeName}}/[id]
export async function PUT(request: NextRequest, { params }: Params): Promise<NextResponse> {
  await dbConnect();
  try {
    const body = await request.json();
    const item = await {{modelName}}.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE /api/{{routeName}}/[id]
export async function DELETE(request: NextRequest, { params }: Params): Promise<NextResponse> {
  await dbConnect();
  try {
    const item = await {{modelName}}.findByIdAndDelete(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
