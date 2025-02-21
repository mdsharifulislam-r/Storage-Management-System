import { Request, Response } from "express";
import {
  changePasswordService,
  deleteUserService,
  registerUserService,
} from "../services/auth.service";
import { validationResult } from "express-validator";
import userModel, { IUser } from "../models/user.model";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createFolderService,
  createLocalFolderService,
} from "../services/folder.service";

// Register User 
export const registerUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((error) => error.msg) });
    }

    const user = req.body;
    const emailExist = await userModel.findOne({ email: user.email });

    if (emailExist) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = await registerUserService(user);
    await createInitialFolders(newUser._id);
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Something went wrong" });
  }
};

//login User
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = req.body;
    const emailExist = await userModel.findOne({ email: user.email });
    if (!emailExist) {
      return res.status(400).json({ message: "Email does not exist" });
    }
    const match = await compare(user.password, emailExist.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: emailExist._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        username: emailExist.username,
        email: emailExist.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//google sign in
export const googleSignIn = async (req: Request,res: Response): Promise<any> => {
  try {
    const data: any = req.user;
    const user: IUser = data;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    return res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//Change Password
export const changePassword = async (req: Request,res: Response): Promise<any> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((error) => error.msg) });
    }
    const data: any = req.user;
    const user: IUser = data;
    const password = req.body.newPass;

    const match = await compare(req.body.oldPass, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    await changePasswordService(password, user._id!);
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Something went wrong" });
  }
};


// Createing Initial Folders
export const createInitialFolders = async (id: any) => {
  const str_id = id?.toString();
  
  await createLocalFolderService(str_id!);
  await createFolderService("notes", str_id!);
  await createFolderService("images", str_id!);
  await createFolderService("pdfs", str_id!);
};

export const setSecureKey = async (req: Request,res: Response): Promise<any> => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array().map((error) => error.msg) });
        }
        const data: any = req.user;
        const user: IUser = data;
        const key = req.body.key;
     
        await userModel.findByIdAndUpdate(user._id,{secureKey:parseInt(key)});
        return res.status(200).json({ message: "Secure key set successfully" });
    } catch (error) { 
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export const deleteAccount = async (req: Request,res: Response): Promise<any> => {
  try {
    const data: any = req.user;
    const user = data;

    await deleteUserService(user._id.toString())
    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
