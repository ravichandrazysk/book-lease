export { default } from "next-auth/middleware";

import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Mapping of page paths to redirect paths
const redirectMap: RedirectMap = {
  "/login": "/",
  "/forgot-password": "/",
  "/register": "/",
};

import { NextRequest } from "next/server";

interface RedirectMap {
  [key: string]: string;
}

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  // If authenticated and accessing a path in redirectMap, redirect to the mapped path
  const redirectPath = redirectMap[url.pathname];
  if (redirectPath && token?.accessToken) {
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  // Allow access to public pages if unauthenticated
  if (!token && url.pathname in redirectMap) return NextResponse.next();

  // If authenticated, allow access to any page
  if (token) return NextResponse.next();

  // If unauthenticated, redirect to login for protected pages

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/forgot-password", "/register", "/user/:path*"],
  // eslint-disable-next-line object-curly-newline
};

// Check authentication status when the user navigates back
if (typeof window !== "undefined")
  window.addEventListener("popstate", () => {
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((session) => {
        const token = session?.accessToken;
        if (!token) window.location.href = "/login";
      });
  });
