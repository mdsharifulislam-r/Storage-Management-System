import { join } from "path";
import fs from "fs";
import { FileModel, IFile } from "../models/file.model";
import { FolderModel } from "../models/folder.model";

export async function createLocalFolderService(...paths: string[]) {
  const folderPath = join(process.cwd(), "public", "uploads", ...paths.map((path) => path.toLowerCase()));
  if (fs.existsSync(folderPath)) {
    throw new Error("Folder already exists");
  }
  fs.mkdirSync(folderPath, { recursive: true });
  return { message: "Folder created successfully" };
}

export async function deleteLocalFolderService(...paths: string[]) {
  const folderPath = join(process.cwd(), "public", "uploads", ...paths);
  if (!fs.existsSync(folderPath)) {
    throw new Error("Folder does not exist");
  }
  fs.rmdirSync(folderPath, { recursive: true });
  return { message: "Folder deleted successfully" };
}

export async function createFolderService(name: string, userId: string) {
  try {
    const existFolder = await FolderModel.findOne({ name, user_id: userId });
    if (existFolder) {
      throw new Error("Folder already exists");
    }
    const folder = new FolderModel({ name, user_id: userId });
    await folder.save();

    await createLocalFolderService(userId, name);
    return folder;
  } catch (error) {
    console.log(error);

    throw new Error("Folder could not be created");
  }
}

export async function deleteFolderService(folderId: string) {
  try {
    const folder = await FolderModel.findByIdAndDelete(folderId);
    if (!folder) {
      throw new Error("Folder does not exist");
    }
    await deleteLocalFolderService(folder.user_id.toString(), folder.name);
    await FileModel.deleteMany({ folder_id: folderId });
    return { message: "Folder deleted successfully" };
  } catch (error) {
    console.log(error);
    throw new Error("Folder could not be deleted");
  }
}

export async function getFolderService(userId: string) {
  try {
    const folders = await FolderModel.find({ user_id: userId });
    const filesData = await FileModel.find({ user_id: userId,isSecured:false });
    const data = folders.map((folder) => {
      const files = filesData.filter(
        (file) => file.folder_id.toString() == folder._id?.toString()
      );
    
      const { sizes, amount } = getFolderData(files);

      return {
        name: folder.name,
        id: folder._id,
        size: sizes,
        amount: amount,
        files: files,
       
      };
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Could not get folders");
  }
}
function getFolderData(files: IFile[] = []) {
  let sizes = 0;
  let amount = 0;

  files.forEach((file) => {
    sizes += file.size.bytes;
    amount++;
  });

  return { sizes, amount }
}