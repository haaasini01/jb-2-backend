import { Router } from "express";
import { UserModel, AdminModel } from "./db.js";
import { z } from "zod";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const userRouter = Router();
const adminRouter = Router();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const resend = new Resend(process.env.RESEND_API_KEY);

adminRouter.post("/add", async (req, res) => {
    const { name, email, phoneNo } = req.body;

    const admin = new AdminModel({
        name,
        email,
        phoneNo
    });

    await admin.save();
    res.send({
        msg: "Admin added successfully"
    });
});

userRouter.post("/message", async (req, res) => {
  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    phoneNo: z
      .string()
      .regex(
        /^[\+\d\s\-\(\)\.]{6,30}$/,
        "Phone number must be 6-30 characters"
      ),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required"),
  });

  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).send({ message: result.error.errors[0].message });
  }

  const { name, phoneNo, email, message } = req.body;

  try {
    // 1) Save message in DB first
    const user = new UserModel({ name, phoneNo, email, message });
    await user.save();

    // 2) Send email using Resend
    await resend.emails.send({
      from: "Jayess Bauences wholebutter0@gmail.com",   // for testing
      to: [process.env.MAIL_ADMIN],
      subject: "New Contact Message Received",
      text: `New message from website:
        Name: ${name}
        Phone: ${phoneNo}
        Email: ${email}
        Message: ${message}
        `,
    });

    return res.status(200).send({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error while sending message:", error);
    return res.status(500).send({ message: "Error while sending message" });
  }
});

export { userRouter, adminRouter };