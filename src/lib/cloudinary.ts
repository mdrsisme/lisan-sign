import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async (fileObj: File, folder: string = 'lisan_uploads') => {
  const arrayBuffer = await fileObj.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder: folder,
        resource_type: "auto"
      }, 
      (error, result) => {
        if (error) return reject(error);
        if (result) resolve({ url: result.secure_url, public_id: result.public_id });
      }
    ).end(buffer);
  });
};

export default cloudinary;