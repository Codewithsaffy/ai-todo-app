import { dbConnect } from "@/helper/db";
import { User } from "@/schema/user.model";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }>}
) {
  try {
    await dbConnect();

    const { token } = await params;

    // Find the user with the matching verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Mark user as verified and clear the token field
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
