import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.js";
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    try {
      console.log("Upload Middleware: ", file);
      const originalNameWithoutExt = path.parse(file.originalname).name;
      return {
        folder: `uploads/${req.query.folder || ""}`,
        allowed_formats: [
          "jpg", "png", "jpeg", "gif", "ico", "svg",
          "mp4", "avi", "mov", "mkv", "webm", "webp", "pdf", "avif"
        ],
        resource_type: "auto", 
        public_id: `${Date.now()}-${originalNameWithoutExt}`,
      };
    } catch (error) {
      console.error("Error during Multer storage setup:", error);
      throw error;
    }
  },
});

const upload = multer({ 
  storage, 
  limits: {
    fileSize: 50 * 1024 * 1024, 
  }
});

export { upload };