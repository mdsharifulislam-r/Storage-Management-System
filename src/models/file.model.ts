import mongoose, { Document, Schema } from "mongoose";

// 📌 File Interface
export interface IFile extends Document {
  name: string;
  folder_id: mongoose.Schema.Types.ObjectId;
  user_id: mongoose.Schema.Types.ObjectId;
  path: string;
  size: {
    bytes: number;
    kilobytes: number;
    megabytes: number;
  };
  originalname: string;
  createdAt: Date;
  isSecured?: boolean;
  isFavorite?: boolean;

}

// 📌 Folder Interface


const fileSchema = new Schema<IFile>(
  {
    name: { type: String, required: true },
    folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    path: { type: String, required: true },
    size: { type: Object, required: true },
    originalname: { type: String, required: true },
    isSecured: { type: Boolean, default: false },
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const FileModel = mongoose.model<IFile>("File", fileSchema);
