import { Adapter, DatabaseSession, DatabaseUser, UserId } from "lucia";
import sql from "@/database/db";

export class NeonAdapter implements Adapter {
  async deleteSession(sessionId: string): Promise<void> {
    await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
  }

  async deleteUserSessions(userId: UserId): Promise<void> {
    await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
  }

  async getSessionAndUser(
    sessionId: string
  ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
    const result = await sql`
      SELECT 
        sessions.id as session_id,
        sessions.user_id,
        sessions.expires_at,
        users.id as user_id,
        users.google_id,
        users.name,
        users.email,
        users.role
      FROM sessions
      INNER JOIN users ON sessions.user_id = users.id
      WHERE sessions.id = ${sessionId}
      LIMIT 1
    `;

    if (result.length === 0) {
      return [null, null];
    }

    const row = result[0];
    const session: DatabaseSession = {
      id: row.session_id,
      userId: row.user_id,
      expiresAt: new Date(Number(row.expires_at)),
      attributes: {}
    };

    const user: DatabaseUser = {
      id: row.user_id,
      attributes: {
        id: row.user_id,
        google_id: row.google_id,
        name: row.name,
        email: row.email,
        role: row.role
      }
    };

    return [session, user];
  }

  async getUserSessions(userId: UserId): Promise<DatabaseSession[]> {
    const result = await sql`
      SELECT id, user_id, expires_at
      FROM sessions
      WHERE user_id = ${userId}
    `;

    return result.map((row) => ({
      id: row.id,
      userId: row.user_id,
      expiresAt: new Date(Number(row.expires_at)),
      attributes: {}
    }));
  }

  async setSession(session: DatabaseSession): Promise<void> {
    await sql`
      INSERT INTO sessions (id, user_id, expires_at)
      VALUES (${session.id}, ${session.userId}, ${session.expiresAt.getTime()})
    `;
  }

  async updateSessionExpiration(sessionId: string, expiresAt: Date): Promise<void> {
    await sql`
      UPDATE sessions
      SET expires_at = ${expiresAt.getTime()}
      WHERE id = ${sessionId}
    `;
  }

  async deleteExpiredSessions(): Promise<void> {
    const now = Date.now();
    await sql`DELETE FROM sessions WHERE expires_at < ${now}`;
  }
}
