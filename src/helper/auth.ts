import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export const getTokenPayload = (req: NextRequest): TokenPayload | null => {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    console.log(err)
    return null;
  }
};
