import passport from "passport";

import { Strategy, ExtractJwt } from "passport-jwt";

import userModel from "../models/user.model";
import dotenv from 'dotenv';
dotenv.config();
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new Strategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET!,
    }, async (jwtPayload, done) => {
        try {
            const user = await userModel.findById(jwtPayload.id);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            console.error(error);
            return done(error, false);
        }
    })
)

export default passport