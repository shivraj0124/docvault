import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from "@/constants/file.constant";

export function validateFile(file: File | null, title: string) {
  if (!file) {
    return { valid: false, message: "File is required" };
  }

  if (!title || title.trim().length === 0) {
    return { valid: false, message: "Title is required" };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      message:
        "Invalid file type. Only PDF, JPG, JPEG, PNG, DOC and DOCX are allowed.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      message: "File size cannot exceed 10 MB.",
    };
  }

  return { valid: true };
}