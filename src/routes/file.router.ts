import express from "express"
import multer from "multer"
import upload from "../lib/configs/multerStorage"
import { deleteFile, duplicateFile, getDateWiseFiles, getFavoriteFiles, getFile, getSecureFiles, makeFavoriteFile, makeSecureFile, renameFile, uploadFile } from "../controllers/file.controller"
import passport from "passport"
import "../strategys/jwt.strategy"
import { fileRenameValidation, secureKeyValidation } from "../validations/validation"
const fileRouter = express.Router()

fileRouter.post("/upload/:foldername",passport.authenticate("jwt"),upload.single("file"),uploadFile)
fileRouter.get("/get/:foldername/:filename",passport.authenticate("jwt"),getFile)
fileRouter.put("/make-secure/:fileId",passport.authenticate("jwt"),makeSecureFile)
fileRouter.get("/secure",passport.authenticate("jwt"),secureKeyValidation,getSecureFiles)
fileRouter.put("/make-favorite/:fileId",passport.authenticate("jwt"),makeFavoriteFile)
fileRouter.get("/favorite",passport.authenticate("jwt"),getFavoriteFiles)
fileRouter.post("/duplicate/:foldername/:filename",passport.authenticate("jwt"),duplicateFile)
fileRouter.delete("/delete/:foldername/:filename",passport.authenticate("jwt"),deleteFile)
fileRouter.put("/rename",passport.authenticate("jwt"),fileRenameValidation,renameFile)
fileRouter.get("/get-files-by-date/:date",passport.authenticate('jwt'),getDateWiseFiles)
export default fileRouter