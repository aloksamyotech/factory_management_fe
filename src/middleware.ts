import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
  const token = request.cookies.get("token")?.value;

  if(request.nextUrl.pathname.startsWith("/sign-in") || 
  request.nextUrl.pathname.startsWith("/_next") ||
  request.nextUrl.pathname.startsWith("/api") ||
  request.nextUrl.pathname.startsWith("/favicon.ico")
  ){
    return NextResponse.next();
  }

  if(!token){
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|sign-in|favicon.ico).*)"],
};