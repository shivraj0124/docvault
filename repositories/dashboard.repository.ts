import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function getDashboardStats(userId: number) {
  const [stats] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      COUNT(*) AS totalDocuments,
      COALESCE(SUM(file_size),0) AS totalStorageUsed,
      SUM(CASE WHEN mime_type LIKE 'application/pdf%' THEN 1 ELSE 0 END) AS pdfCount,
      SUM(CASE WHEN mime_type LIKE 'image/%' THEN 1 ELSE 0 END) AS imageCount,
      SUM(
        CASE
          WHEN mime_type NOT LIKE 'application/pdf%'
          AND mime_type NOT LIKE 'image/%'
          THEN 1
          ELSE 0
        END
      ) AS otherCount
    FROM documents
    WHERE user_id = ?
    `,
    [userId]
  );

  const [recentUploads] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      id,
      title,
      original_name,
      file_url,
      mime_type,
      file_size,
      created_at
    FROM documents
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 5
    `,
    [userId]
  );

  return {
    stats: stats[0],
    recentUploads,
  };
}