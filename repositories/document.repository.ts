import pool from "@/lib/db";
import { ResultSetHeader } from "mysql2";
import { RowDataPacket } from "mysql2";

interface CreateDocument {
  userId: number;
  title: string;
  category: string;
  originalName: string;
  storageKey: string;
  storageProvider: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
}

export async function createDocument(data: CreateDocument) {
  console.log("createDocument", data);
  await pool.execute(
    `INSERT INTO documents
    (user_id,title,category,original_name,storage_key,storage_provider,file_url,mime_type,file_size)
    VALUES(?,?,?,?,?,?,?,?,?)`,
    [
      data.userId,
      data.title,
      data.category,
      data.originalName,
      data.storageKey,
      data.storageProvider,
      data.fileUrl,
      data.mimeType,
      data.fileSize,
    ],
  );
}

export async function getDocumentsByUserId(userId: number) {
  const [rows] = await pool.execute(
    `SELECT
        id,
        title,
        category,
        original_name,
        file_url,
        mime_type,
        file_size,
        created_at
     FROM documents
     WHERE user_id = ?
     ORDER BY created_at DESC`,
    [userId],
  );

  return rows;
}

export async function getDocumentById(id: number) {
  const [rows]: any = await pool.execute(
    `SELECT * FROM documents WHERE id = ?`,
    [id],
  );

  return rows[0];
}

export async function deleteDocument(id: number) {
  await pool.execute(`DELETE FROM documents WHERE id = ?`, [id]);
}

export async function updateDocumentTitle(id: number, title: string) {
  const [result] = await pool.execute<ResultSetHeader>(
    `
    UPDATE documents
    SET title = ?
    WHERE id = ?
    `,
    [title, id],
  );

  return result;
}

// export async function searchDocuments(
//   userId: number,
//   search: string,
//   page: number,
//   limit: number,
// ) {
//   const offset = (page - 1) * limit;
//   console.log({
//     userId,
//     search,
//     page,
//     limit,
//     offset,
//   });
//   console.log({
//     userIdType: typeof userId,
//     searchType: typeof search,
//     pageType: typeof page,
//     limitType: typeof limit,
//     offsetType: typeof offset,
//   });

//   const [rows] = await pool.execute<RowDataPacket[]>(
//     `
//   SELECT
//     id,
//     title,
//     category,
//     original_name,
//     file_url,
//     mime_type,
//     file_size,
//     created_at,
//     updated_at
//   FROM documents
//   WHERE user_id = ?
//     AND title LIKE ?
//   ORDER BY created_at DESC
//   LIMIT ${limit}
//   OFFSET ${offset}
//   `,
//     [userId, `%${search}%`],
//   );

//   const [countRows] = await pool.execute<RowDataPacket[]>(
//     `
//     SELECT COUNT(*) AS total
//     FROM documents
//     WHERE user_id = ?
//       AND title LIKE ?
//     `,
//     [userId, `%${search}%`],
//   );
//   console.log(countRows[0].total);

//   return {
//     documents: rows,
//     total: countRows[0].total,
//   };
// }


export async function searchDocuments(
  userId: number,
  search: string,
  category: string,
  page: number,
  limit: number,
) {
  const offset = (page - 1) * limit;

  let whereClause = "WHERE user_id = ?";
  const values: any[] = [userId];

  if (search) {
    whereClause += " AND title LIKE ?";
    values.push(`%${search}%`);
  }

  if (category) {
    whereClause += " AND category = ?";
    values.push(category);
  }

  const query = `
    SELECT
      id,
      title,
      category,
      is_favourite,
      original_name,
      file_url,
      mime_type,
      file_size,
      created_at,
      updated_at
    FROM documents
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const [rows] = await pool.execute<RowDataPacket[]>(
    query,
    values
  );

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM documents
    ${whereClause}
  `;

  const [countRows] = await pool.execute<RowDataPacket[]>(
    countQuery,
    values
  );

  return {
    documents: rows,
    total: countRows[0].total,
  };
}