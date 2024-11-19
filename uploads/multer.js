import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    try {
      console.log(req.body.folderName);
      return {
        folder: `uploads/`,
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'ico', 'svg', 'mp4', 'avi', 'mov', 'mkv', 'webm'], 
        public_id: `${Date.now()}-${file.originalname}`, 
      };
    } catch (error) {
      console.error("Error in Cloudinary params:", error);
      throw error;
    }
  },
});



const upload = multer({ storage });
export { upload }