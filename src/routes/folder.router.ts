import express from "express";
import { createNewFolder, deleteFolder, getFolders } from "../controllers/folder.controller";
import passport from "passport";
import "../strategys/jwt.strategy";
import { getFilesByFolder } from "../controllers/file.controller";
const folderRouter = express.Router();

folderRouter.post("/create",passport.authenticate("jwt"), createNewFolder);
folderRouter.delete("/:folderId",passport.authenticate("jwt"),deleteFolder);
folderRouter.get("/:foldername",passport.authenticate("jwt"),getFilesByFolder);
folderRouter.get("/",passport.authenticate("jwt"),getFolders);


export default folderRouter