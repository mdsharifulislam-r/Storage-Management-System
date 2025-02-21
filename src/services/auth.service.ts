import { hash } from "bcrypt";
import { UserType } from "../types/types";
import userModel from "../models/user.model";
import { deleteLocalFolderService } from "./folder.service";
import { FolderModel } from "../models/folder.model";
import { FileModel } from "../models/file.model";

export async function registerUserService(user: UserType) {
    try {
        const haspass = await hash(user.password, 10);
        
        const newUser = new userModel({
            username: user.username,
            email: user.email,
            password: haspass,
        });
        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error("Something went wrong");
    }
}

export async function changePasswordService(password:string,id:any){
    try {
        const haspass = await hash(password, 10);
        await userModel.findByIdAndUpdate(id,{password:haspass});
        return {message:"Password changed successfully"};
    } catch (error) {
        throw new Error("Something went wrong");
    }

}

export async function deleteUserService(userId:string) {
    try {
        await deleteLocalFolderService(userId)
        await userModel.findByIdAndDelete(userId);
        await FolderModel.deleteMany({user_id:userId})
        await FileModel.deleteMany({user_id:userId})
        return {
            message: "User deleted successfully",
            userId: userId,
        }

    } catch (error) {
        console.log(error);
    
    }
}