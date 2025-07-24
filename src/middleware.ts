import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest){
  const token = request.cookies.get("token")?.value;
  // console.log("token middleware ",token);
  if(request.nextUrl.pathname.includes("/sign-in") || 
  request.nextUrl.pathname.includes("/_next") ||
  request.nextUrl.pathname.includes("/api") ||
  request.nextUrl.pathname.includes("/favicon.ico")
  ){
    return NextResponse.next();
  }

    if(!token){
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|sign-in|favicon.ico|.well-known|robots.txt|sitemap.xml).*)"],
};