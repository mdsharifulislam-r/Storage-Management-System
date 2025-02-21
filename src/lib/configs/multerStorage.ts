import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const user:any = req.user;
        const foldername = req.params.foldername; // Get folder name from the request params
        cb(null, `public/uploads/${user._id}/${foldername}/`); // Folder where files will be stored

    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });

  const upload = multer({ storage }); // Multer middleware for file upload

  export default upload;