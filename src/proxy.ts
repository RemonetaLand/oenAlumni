import { NextResponse, type NextRequest } from "next/server";

// Optimistic check only: the real authorisation happens in every admin page and route via getAdmin().
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin-panel") && pathname !== "/admin-panel/login" && !req.cookies.has("oen_admin")) {
    return NextResponse.redirect(new URL("/admin-panel/login", req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin-panel/:path*"] };
