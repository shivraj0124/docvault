import pool from "@/lib/db";

export async function findUserByEmail(email: string) {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return (rows as any[])[0];
}

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  const [result] = await pool.execute(
    `INSERT INTO users(name,email,password)
     VALUES(?,?,?)`,
    [name, email, password]
  );

  return result;
}