import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth.js';

const router = Router();

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  return secret;
};

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const secret = getJwtSecret();
    const token = jwt.sign(
      {
        sub: user.email,
        email: user.email,
        id: user.id,
        role: user.role,
        roles: [user.role],
      },
      secret,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        type: 'Bearer',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          active: user.active,
          roles: [user.role],
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Authentication processing error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// GET /api/v1/auth/me (Protected with JWT authentication)
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    if (!req.user?.email) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: missing user context',
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    return res.json({
      success: true,
      message: 'User retrieved',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        active: user.active,
        roles: [user.role],
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve authenticated user',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

// GET /api/v1/auth/role-test (Role-based authorization test endpoint)
router.get('/role-test', authenticateToken, requireRole(['ROLE_ADMIN']), (req: AuthRequest, res) => {
  return res.json({
    success: true,
    message: 'Admin authorization granted',
    user: req.user,
  });
});

export default router;
