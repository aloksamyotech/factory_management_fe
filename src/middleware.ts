import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("9x4kz5t7e2m1lqf")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/|images/|sign-in|favicon.ico).*)',
  ],
};
