import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { AuthUser } from "@/types/auth";
import  db  from "@/lib/db"; 
// export async function getCurrentUser() {
//   const cookieStore = await cookies();

//   const token = cookieStore.get("token")?.value;

//   if (!token) {
//     return null;
//   }

//   try {
//     return verifyToken(token);
//   } catch {
//     return null;
//   }
// }
export async function getCurrentUser(): Promise<AuthUser | null> {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token);

  if (!decoded) return null;

  const [rows]: any = await db.query(
    "SELECT id, name, email, created_at FROM users WHERE id = ?",
    [decoded.id],
  );

  if (rows.length === 0) return null;

  return rows[0];
}
