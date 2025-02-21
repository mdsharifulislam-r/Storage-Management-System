import { Request, Response } from "express";
import { createNewFile, deleteFileService, duplicateFileService, getFavoriteFilesService, getFilesByFolderService, makeFavoriteFileService, makeSecureFileService } from "../services/file.service";

import { join } from "path";
import { FolderModel } from "../models/folder.model";
import { validationResult } from "express-validator";
import { FileModel } from "../models/file.model";

export const uploadFile = async (req: Request, res: Response):Promise<any> => {
    try {
        const { foldername } = req.params;
        const { file } = req;
        if (!file) {
        return res.status(400).json({ message: "No files uploaded" });
        }
        if (!foldername) {
        return res.status(400).json({ message: "Folder name is required" });
        }
        const user: any = req.user;
        const folder = await FolderModel.findOne({ name: foldername, user_id: user._id });
      
        const data = await createNewFile(file.filename, folder?._id, user._id, foldername,req.file?.originalname!);
        res.status(201).json({
        message: "File uploaded successfully",
        })
      
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
    }

export const getFile = async (req: Request, res: Response):Promise<any> => {
    try {
        const { foldername,filename} = req.params;
        const user: any = req.user;
        const path = join(process.cwd(),"public","uploads",user._id.toString(),foldername,filename);
        return res.sendFile(path)
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteFile = async (req: Request, res: Response):Promise<any> => {
    try {
        const { foldername,filename } = req.params;
        const user: any = req.user;
        const data = await deleteFileService(filename,user._id.toString(),foldername);
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const getFilesByFolder = async (req: Request, res: Response):Promise<any> => {
    try {
        const { foldername } = req.params;
        const user: any = req.user;
    
        const data = await getFilesByFolderService(foldername.toLowerCase(),user._id.toString());
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const makeSecureFile = async (req: Request, res: Response):Promise<any> => {
    try {
        const { fileId } = req.params;
        const user: any = req.user;
        if(!user?.secureKey){
            return res.status(400).json({ message: "Set a Secure key first" });
        }
        const data = await makeSecureFileService(fileId);
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const makeFavoriteFile = async (req: Request, res: Response):Promise<any> => {
    try {
        const { fileId } = req.params;
        const data = await makeFavoriteFileService(fileId);
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}



export const getFavoriteFiles = async (req: Request, res: Response):Promise<any> => {
    try {
        const user: any = req.user;
        const data = await getFavoriteFilesService(user._id.toString());
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const getSecureFiles = async (req: Request, res: Response):Promise<any> => {
    try {
        const user: any = req.user;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
        const key = req.body.key;
        if(user.secureKey != key){
            return res.status(400).json({ message: "Invalid Key" });
        }
        const data = await FileModel.find({ user_id: user._id,isSecured:true });
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const duplicateFile = async (req: Request, res: Response):Promise<any> => {
    try {
        const { foldername,filename } = req.params;
        const user: any = req.user;
        const data  = await duplicateFileService(filename,foldername,user._id.toString());
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }

}

export const renameFile = async (req: Request, res: Response):Promise<any> => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array().map((error) => error.msg) });
        }
        const {newName,oldName } = req.body;
        const user: any = req.user;
        const data  = await FileModel.findOneAndUpdate({name:oldName,user_id:user._id},{originalname:req.body.newName});
        res.status(200).json({message:"File renamed successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const getDateWiseFiles = async (req: Request, res: Response):Promise<any> => {
    try {
        const {date } = req.params;
        const user: any = req.user;
        const data = (await FileModel.find({ user_id: user._id,isSecured:false })).filter(item=>{
            const splitDate = item.createdAt.toLocaleDateString()
            const dateFormat = date.split("-").join("/")
            if(dateFormat==splitDate) {
                return item
            }
        });
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}