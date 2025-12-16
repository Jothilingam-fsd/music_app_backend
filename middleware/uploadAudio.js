import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "songs/images",
    resource_type: "video", 
    format: "mp3",
    allowed_formats: ["mp3", "wav", "flac","jpg","png","jpeg","webp"],
  },
});

const uploadAudio = multer({ storage });

export default uploadAudio;
