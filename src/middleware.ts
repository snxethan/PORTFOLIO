import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const hostname = req.headers.get("host");

  // Redirect ethantownsend.dev and www.ethantownsend.dev to /social
  if (hostname === "ethantownsend.dev" || hostname === "www.ethantownsend.dev") {
    const url = req.nextUrl.clone();

    // Only redirect from root URL
    if (url.pathname === "/") {
      url.pathname = "/social";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};