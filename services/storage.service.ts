import cloudinary from "@/lib/cloudinary";

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  resource_type: string;
  bytes: number;
  format: string;
}

export async function uploadToCloudinary(
  buffer: Buffer,
  fileName: string
): Promise<CloudinaryResponse> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "docvault",
        public_id: `${Date.now()}-${fileName}`,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) return reject(error);

        resolve(result as CloudinaryResponse);
      }
    );

    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string) {
  return await cloudinary.uploader.destroy(publicId);
}