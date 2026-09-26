import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.NEXTAUTH_SECRET || "default_super_secret_jwt_key_32chars_long!";
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("eduflow_session")?.value;

  let user: { id: string; role: "STUDENT" | "INSTRUCTOR" } | null = null;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, key);
      user = {
        id: payload.id as string,
        role: payload.role as "STUDENT" | "INSTRUCTOR",
      };
    } catch {
      user = null;
    }
  }

  // Auth pages: redirect to dashboard/courses if already signed in
  if (pathname === "/signin" || pathname === "/signup") {
    if (user) {
      const target = user.role === "INSTRUCTOR" ? "/instructor" : "/courses";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  // Protected Instructor Studio routes
  if (pathname.startsWith("/instructor")) {
    if (!user) {
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (user.role !== "INSTRUCTOR") {
      return NextResponse.redirect(new URL("/courses", request.url));
    }
  }

  // Protected Student Learning routes
  if (pathname.startsWith("/learn")) {
    if (!user) {
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/instructor/:path*", "/learn/:path*", "/signin", "/signup"],
};
