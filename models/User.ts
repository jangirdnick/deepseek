import mongoose, { Model } from "mongoose";

interface UserType {
    _id: string;
    name: string;
    email: string;
    image: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<UserType>({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true,},
    image: {type: String, required: true}
},
{timestamps: true})

const User: Model<UserType> = mongoose.models.User || mongoose.model<UserType>("User", userSchema)

export default User;
export type {UserType}