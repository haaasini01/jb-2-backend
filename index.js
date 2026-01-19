import express from "express";
import { userRouter, adminRouter } from "./route.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL,
}));
app.use("/user", userRouter);
app.use("/admin", adminRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

main();
