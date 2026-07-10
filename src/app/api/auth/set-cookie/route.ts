import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { accessToken } = await request.json();
    
    if (!accessToken) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 400 });
    }

    // Await cookies() object in Next.js App Router to correctly interact with cookies in Route Handlers
    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Failed to set cookie" }, { status: 500 });
  }
}
