import { dbConnect } from "@/helper/db";
import { User } from "@/schema/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password using 12 salt rounds for better security
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a unique verification token (32 bytes -> hex string)
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create a new user (unverified by default)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
    });
    await newUser.save();

    // Send a verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { message: "Registration successful. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
