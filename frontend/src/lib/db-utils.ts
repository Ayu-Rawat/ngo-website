import sql from "@/database/db";

export async function getUserFromGoogleId(googleId: string) {
  const rows = await sql`SELECT * FROM users WHERE google_id = ${googleId} LIMIT 1`;
  return rows[0] ?? null;
}

export async function createUserWithGoogle(googleId: string, name: string, email: string, role: "user") {
  const uniqueId = crypto.randomUUID();
  const rows = await sql`
    INSERT INTO users (id, google_id, name, email, role) 
    VALUES (${uniqueId}, ${googleId}, ${name}, ${email}, ${role})
    RETURNING *`;
  return rows[0];
}
