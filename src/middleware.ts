import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Middleware can be extended for future use
  // Currently not performing any redirects
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};