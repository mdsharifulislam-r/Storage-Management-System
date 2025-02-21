import passport from "passport"
import { Strategy } from "passport-google-oauth20"
import userModel from "../models/user.model"
import { IUser } from "../models/user.model"
import dotenv from 'dotenv';
import { createInitialFolders } from "../controllers/auth.controller";
dotenv.config();
passport.use(
    new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.BASE_URL}/api/auth/google/callback`,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userModel.findOne({ email: profile.emails![0].value });
            if (user) {
                return done(null, user);
            }
            const newUser = new userModel({
                username: profile.displayName,
                email: profile.emails![0].value,
                password: "",
            });
            await createInitialFolders(newUser._id);
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            console.error(error);
            return done(error, false);
        }
    })
)
passport.serializeUser((user:any, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await userModel.findById(id)
        return done(null, user);
    } catch (error) {
        console.error(error);
        return done(error, false);
    }
})
export default passport