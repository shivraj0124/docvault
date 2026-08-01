import {
  createDocument,
  updateDocumentTitle,
  getDocumentById,
  deleteDocument,
} from "@/repositories/document.repository";
import { getDocumentsByUserId } from "@/repositories/document.repository";
import { deleteFromCloudinary } from "./storage.service";
import { searchDocuments } from "@/repositories/document.repository";
import { deleteFromS3 } from "./s3.service";

interface UploadDocument {
  userId: number;
  title: string;
  category: string;
  originalName: string;
  storageKey: string;
  storageProvider: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  is_favourite: boolean;
}

export async function saveDocument(data: UploadDocument) {
  await createDocument(data);

  return {
    message: "Document uploaded successfully",
  };
}

export async function removeDocument(documentId: number, userId: number) {
  const document = await getDocumentById(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  if (document.user_id !== userId) {
    throw new Error("Unauthorized");
  }

  if (document.storage_provider === "S3") {
    await deleteFromS3(document.storage_key);
  } else {
    await deleteFromCloudinary(document.storage_key);
  }

  await deleteDocument(documentId);

  return {
    message: "Document deleted successfully",
  };
}

export async function getAllDocuments(userId: number) {
  return await getDocumentsByUserId(userId);
}

export async function renameDocument(
  documentId: number,
  userId: number,
  title: string,
) {
  const document = await getDocumentById(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  if (document.user_id !== userId) {
    throw new Error("Forbidden");
  }

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    throw new Error("Title cannot be empty");
  }

  await updateDocumentTitle(documentId, trimmedTitle);

  return await getDocumentById(documentId);
}

export async function searchUserDocuments(
  userId: number,
  search: string,
  category: string,
  page: number,
  limit: number,
) {
  const result = await searchDocuments(userId, search, category, page, limit);

  return {
    documents: result.documents,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit),
    },
  };
}
