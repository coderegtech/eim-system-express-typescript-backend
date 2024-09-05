import { Request } from "express";
import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ): any => {
    callback(null, "./uploads/products");
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void
  ): any => {
    callback(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter function
// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   callback: (error: Error | null, acceptFile: boolean) => void
// ) => {
//   const allowedFileTypes = [".jpg", ".jpeg", ".png"];
//   const ext = file.originalname
//     .toLowerCase()
//     .substring(file.originalname.lastIndexOf("."));
//   if (allowedFileTypes.includes(ext)) {
//     callback(null, true);
//   } else {
//     callback(new Error("Invalid file type"), false);
//   }
// };

// Multer upload configuration with file filter and limits
const upload = multer({
  storage: storage,
//   fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5 MB
    files: 1, // Limit the number of files to 1 per request
  },
});

export default upload;