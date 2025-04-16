import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const dynamicStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isPDF = file.mimetype === "application/pdf";

    return {
      folder: isPDF ? "resume" : "profile_images",
      resource_type: isPDF ? "raw" : "image",
      format: isPDF ? "pdf" : undefined,

      public_id: `${file.originalname
        .split(".")[0]
        .replace(/\s+/g, "-")
        .toLowerCase()}-${Date.now()}`,
    };
  },
});

export const uploadFile = multer({ storage: dynamicStorage });
