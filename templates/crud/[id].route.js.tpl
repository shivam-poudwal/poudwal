import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import {{modelName}} from '@/models/{{modelName}}';

// GET /api/{{routeName}}/[id]
export async function GET(request, { params }) {
  await dbConnect();
  try {
    const item = await {{modelName}}.findById(params.id).lean();
    if (!item) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/{{routeName}}/[id]
export async function PUT(request, { params }) {
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
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE /api/{{routeName}}/[id]
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const item = await {{modelName}}.findByIdAndDelete(params.id);
    if (!item) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
