import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { identifier },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        identifier,
      },
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        identifier: user.identifier,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}