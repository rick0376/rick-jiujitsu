import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadBuffer(buffer: Buffer, folder: string) {
  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${process.env.CLOUDINARY_FOLDER || "mandiok-jiujitsu"}/${folder}`,
        resource_type: "image",
        transformation: [{ width: 1400, height: 1400, crop: "limit", quality: "auto", fetch_format: "auto" }]
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Falha no upload."));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}
