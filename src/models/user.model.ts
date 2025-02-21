import mongoose, { Document,Schema } from "mongoose";


export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    secureKey:number;
}

const userSchema:Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    secureKey:Number
},{
    timestamps: true
})

export default mongoose.model<IUser>("User", userSchema);