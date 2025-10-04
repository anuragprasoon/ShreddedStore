import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

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
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: 'Identifier is required' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { identifier },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
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
      message: 'Logged in successfully',
      user: {
        id: user.id,
        identifier: user.identifier,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}