import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });
  // Clear the token cookie by setting it to an expired date
  response.cookies.set("token", "", { expires: new Date(0), path: "/" });
  return response;
}
