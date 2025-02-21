import express from 'express';
import { changePasswordValidation, loginValidation, registerValidation, secureKeyValidation } from '../validations/validation';
import { changePassword, deleteAccount, googleSignIn, login, registerUser, setSecureKey } from '../controllers/auth.controller';
import passport from 'passport';

import '../strategys/google.strategy'
import '../strategys/jwt.strategy'
const userRouter = express.Router();

userRouter.post('/register',registerValidation,registerUser)
userRouter.post('/login',loginValidation,login)
userRouter.get('/logout',(req,res)=>{
    res.clearCookie('token')
    res.status(200).json({message:'Logout successfully'})
}
)

userRouter.get('/google',passport.authenticate("google",{
    scope:['profile','email']
}),googleSignIn)

userRouter.get('/google/callback',passport.authenticate("google", { failureRedirect: '/login' }),googleSignIn)

userRouter.put('/change-password',passport.authenticate('jwt', { session: false }),changePasswordValidation,changePassword)

userRouter.put("/set-key",passport.authenticate('jwt', { session: false }),secureKeyValidation,setSecureKey)

userRouter.delete("/delete",passport.authenticate("jwt"),deleteAccount)
export default userRouter


