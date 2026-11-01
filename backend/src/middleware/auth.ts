import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id?: number;
    email: string;
    role: string;
  };
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  return secret;
};

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access token is missing',
    });
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token is missing',
    });
  }

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as any;
    const email = decoded.email || decoded.sub;
    const role = decoded.role || (Array.isArray(decoded.roles) ? decoded.roles[0] : (typeof decoded.roles === 'string' ? decoded.roles.split(',')[0] : undefined));

    if (!email || !role) {
      return res.status(401).json({
        success: false,
        message: 'Invalid access token payload',
      });
    }

    req.user = {
      id: decoded.id,
      email,
      role,
    };

    next();
  } catch (err: any) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
    });
  }
};

export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token) {
      try {
        const secret = getJwtSecret();
        const decoded = jwt.verify(token, secret) as any;
        const email = decoded.email || decoded.sub;
        const role = decoded.role || (Array.isArray(decoded.roles) ? decoded.roles[0] : (typeof decoded.roles === 'string' ? decoded.roles.split(',')[0] : undefined));
        if (email && role) {
          req.user = {
            id: decoded.id,
            email,
            role,
          };
        }
      } catch {
        // Silently continue without user
      }
    }
  }
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient role permissions',
        data: null,
      });
    }
    next();
  };
};
