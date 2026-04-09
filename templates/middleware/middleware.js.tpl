import { NextResponse } from 'next/server';

/**
 * {{name}} middleware
 * Applied to routes matched by the `config.matcher` below.
 */
export function middleware(request) {
  // TODO: implement your middleware logic here

  // Example: protect all /api/{{routeName}}/* routes
  // const token = request.headers.get('authorization');
  // if (!token) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/{{routeName}}/:path*'],
};
