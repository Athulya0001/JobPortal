import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const pdfStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    allowed_formats: ["pdf"],
    // resource_type: "raw",
  },
});
export const uploadPDF = multer({ storage: pdfStorage });

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images",
    allowed_formats: ["jpg", "jpeg", "png", "webp","svg"],
    // transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
export const uploadImage = multer({ storage: imageStorage });
