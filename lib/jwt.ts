import jwt from "jsonwebtoken";
import { AuthUser } from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(payload: {
  id: number;
  email: string;
}) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
}