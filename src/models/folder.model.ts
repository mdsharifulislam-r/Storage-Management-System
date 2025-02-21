import mongoose, { Schema } from "mongoose";

export interface IFolder extends Document {
    name: string;
    user_id: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
  }


const folderSchema = new Schema<IFolder>(
    {
      name: { type: String, required: true },
      user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
  );
  
  
  folderSchema.virtual("files",{
    ref: "File", 
    localField: "_id", 
    foreignField: "folder_id", 
  });
  
  
  folderSchema.set("toObject", { virtuals: true });
  folderSchema.set("toJSON", { virtuals: true });
  
  
  export const FolderModel = mongoose.model<IFolder>("Folder", folderSchema);