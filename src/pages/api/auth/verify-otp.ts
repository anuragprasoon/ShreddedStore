import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { identifier, otp } = req.body;

    // Find and validate OTP
    const otpVerification = await prisma.otpVerification.findFirst({
      where: {
        identifier,
        otp,
        expiresAt: {
          gt: new Date(),
        },
        used: false,
      },
    });

    if (!otpVerification) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await prisma.otpVerification.update({
      where: { id: otpVerification.id },
      data: { used: true },
    });

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { identifier },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { identifier },
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id, identifier: user.identifier },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.setHeader(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`
    );

    return res.status(200).json({
      message: 'Successfully authenticated',
      user: {
        id: user.id,
        identifier: user.identifier,
      },
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Error verifying OTP' });
  }
}