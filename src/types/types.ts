import mongoose from "mongoose";

export interface UserType{
    username: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface FolderType{
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId: string;
    files?: FileType[];
}

export interface FileType{
    name: string;
    size?: number;
    createdAt?: Date;
    updatedAt?: Date;
    folderId:mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    path:string;
}