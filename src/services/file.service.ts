import fs from 'fs'
import { FileModel } from "../models/file.model";
import { FileType } from "../types/types";
import { join } from "path";
import { deleteLocalFolderService } from './folder.service';
import { FolderModel } from '../models/folder.model';

export async function createNewFile(name:string, folderId:any, userId:any, folder_name:string,orginal_name:string) {
    try {
        const size =  fs.statSync(join(process.cwd(),"public","uploads",userId.toString(),folder_name,name)).size;
        const newFile = new FileModel({
            name,
            folder_id:folderId,
            user_id:userId,
            path:`./uploads/${userId}/${folder_name}/${name}`,
            size:{
                bytes:size,
                kilobytes:size/1024,
                megabytes:size/(1024*1024)
            },
            originalname:orginal_name
        });
        return await newFile.save();
    } catch (error:any) {
        throw new Error(error?.message);
    }

}



export async function deleteFileService(fileName:string,user_id:any,folder_name:string) {
    try {
        const file = await FileModel.findOneAndDelete({name:fileName,user_id});
        if(!file){
            throw new Error("File does not exist");
        }
        const path = join(process.cwd(),"public","uploads",user_id.toString(),folder_name,fileName);
        fs.unlinkSync(path);
        return {message:"File deleted successfully"};
    } catch (error:any) {
        throw new Error(error?.message)
    }

}

export async function getFilesByFolderService(foldername:string,user_id:string) {
    try {
        const folder = await FolderModel.findOne({name:foldername,user_id});
        const data = await FileModel.find({folder_id:folder?._id,user_id,isSecured:false});
    
        return data
        
    } catch (error:any) {
        throw new Error(error?.message)
    }
}

export async function makeSecureFileService(fileId:string) {
    try {
        const file = await FileModel.findOneAndUpdate({_id:fileId},{isSecured:true});
        if(!file) throw new Error("File does not exist");
        return {message:"File secured successfully"};
    } catch (error:any) {
        throw new Error(error?.message)
    }
}

export async function makeFavoriteFileService(fileId:string) {
    try {
        const file = await FileModel.findOneAndUpdate({_id:fileId},{isFavorite:true});
        if(!file) throw new Error("File does not exist");
        return {message:"File marked as favorite"};
    } catch (error:any) {
        throw new Error(error?.message)
    }
}

export async function getSecureFilesService(userId:string) {
    try {
        return await FileModel.find({user_id:userId,isSecured:true});
    } catch (error:any) {
        throw new Error(error?.message)
    }
}

export async function getFavoriteFilesService(userId:string) {
    try {
        return await FileModel.find({user_id:userId,isFavorite:true,isSecured:false});
    } catch (error:any) {
        throw new Error(error?.message)
    }
}

export async function duplicateFileService(file_name:string,folder_name:string,user_id:string){
    try {
        const sourceUrl = join(process.cwd(),"public","uploads",user_id,folder_name,file_name);
        const destinationUrl = join(process.cwd(),"public","uploads",user_id,folder_name,`copy_of_${file_name}`);
        fs.copyFileSync(sourceUrl,destinationUrl);
        const file = await FileModel.findOne({name:file_name,user_id});
        if(!file) throw new Error("File does not exist");
        const newFile = new FileModel({
            name:`copy_of_${file_name}`,
            folder_id:file.folder_id,
            user_id:file.user_id,
            size:file.size,
            originalname:`copy_of_${file.originalname}`,
            path:destinationUrl

        })
        return await newFile.save();
    } catch (error:any) {
        throw new Error(error?.message)
    }

}
