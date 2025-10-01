import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { identifier } = req.body;

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database
    await prisma.otpVerification.create({
      data: {
        identifier,
        otp,
        expiresAt: otpExpiry,
      },
    });

    // If identifier is an email
    if (identifier.includes('@')) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: identifier,
        subject: 'Your Shredded Store OTP',
        text: `Your OTP is ${otp}. This OTP will expire in 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Shredded Store OTP</h2>
            <p>Your One-Time Password is:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #000;">${otp}</h1>
            <p>This OTP will expire in 10 minutes.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
          </div>
        `,
      });
    } else {
      // If identifier is a phone number
      // Integrate with SMS service here
      // For now, we'll just simulate it
      console.log(`SMS OTP ${otp} sent to ${identifier}`);
    }

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Error sending OTP' });
  }
}