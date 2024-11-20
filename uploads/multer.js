import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.js";
import path from "path"
// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    try {
      const originalNameWithoutExt = path.parse(file.originalname).name;
      return {
        folder: `uploads/${req.query.folder || ""}`,
        allowed_formats: [
          "jpg", "png", "jpeg", "gif", "ico", "svg",
          "mp4", "avi", "mov", "mkv", "webm"
        ],
        public_id: `${Date.now()}-${originalNameWithoutExt}`,
      };
    } catch (error) {
      console.log(error)
      throw error;
    }
  },
});

const upload = multer({ storage });

export { upload };