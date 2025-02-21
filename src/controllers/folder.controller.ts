import { Request, Response } from "express";
import { createFolderService, deleteFolderService, getFolderService } from "../services/folder.service";
import { FileModel, IFile } from "../models/file.model";

export const createNewFolder = async (req: Request, res: Response):Promise<any> => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        const user:any = req.user;
        const folder = await createFolderService(name, user._id.toString());
        res.status(201).json({
            message: "Folder created successfully",
            
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteFolder = async (req: Request, res: Response):Promise<any> => {
    try {
        const { folderId } = req.params;
        const user:any = req.user;
        const folder = await deleteFolderService(folderId);
        res.status(200).json({
            message: "Folder deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const getFolders = async (req: Request, res: Response):Promise<any> => {
    try {
        const user:any = req.user;
      const data = await getFolderService(user._id.toString());
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}


