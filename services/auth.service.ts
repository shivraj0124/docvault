import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";
import {
  createUser,
  findUserByEmail,
} from "@/repositories/user.repository";

interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export async function registerUser(data: RegisterDto) {
  const { name, email, password } = data;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

 
  await createUser(name, email, hashedPassword);

  return {
    message: "User registered successfully",
  };
}


export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}