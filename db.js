import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URL);

const { Schema, Types } = mongoose;
const ObjectId = Types.ObjectId;

const User = new Schema({
    name: String,
    phoneNo: String,
    email: String,
    message: String
});

const Admin = new Schema({
    name: String,
    email: String,
    phoneNo: String
});

const UserModel = mongoose.model("users", User);
const AdminModel = mongoose.model("admin", Admin);

export {
    UserModel,
    AdminModel
};
