import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const baseName = file.originalname
        .toLowerCase()
        .replace(/\.[^/.]+$/, "")     // remove extension
        .replace(/\s+/g, "-")         // replace spaces
        // eslint-disable-next-line no-useless-escape
        .replace(/[^a-z0-9\-]/g, ""); // sanitize

      const uniqueName =
        `${Math.random().toString(36).substring(2)}-${Date.now()}-${baseName}`;

      return uniqueName;  // ❗ NO EXTENSION HERE
    }
  }
});

export const multerUpload = multer({ storage });
