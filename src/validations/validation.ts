
import { body } from "express-validator";

export const registerValidation = [
    body("username").isString().withMessage("Username is required"),
    body("email").isEmail().withMessage("Email is required"),
    body("password").isString().isLength({ min: 6, max: 20 }).withMessage("Password is required"),
]

export const loginValidation = [
    body("email").isEmail().withMessage("Email is required"),
    body("password").isString().isLength({ min: 6, max: 20 }).withMessage("Password is required"),
]

export const changePasswordValidation = [
    body("oldPass").isString().isLength({ min: 6, max: 20 }).withMessage("Password is required"),
    body("newPass").isString().isLength({ min: 6, max: 20 }).withMessage("Password is required"),
]

export const secureKeyValidation = [
    body("key").isNumeric().withMessage("Secure key is required").isLength({ min: 4, max: 4 }).withMessage("Secure key must be 4 digits"),
]

export const fileRenameValidation = [
    body("oldName").isString().withMessage("OldName is required"),
    body("newName").isString().withMessage("New Name filename is required"),
]