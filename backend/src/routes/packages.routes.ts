import { Router } from 'express';
import { prisma } from '../db.js';
import { formatDecimal } from '../utils/format.js';

const router = Router();

// GET /api/v1/packages
router.get('/', async (req, res) => {
  try {
    const packages = await prisma.weddingPackage.findMany({
      orderBy: { id: 'asc' },
    });
    return res.json({
      success: true,
      message: 'Wedding packages retrieved successfully',
      data: formatDecimal(packages),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve wedding packages',
      error: error.message,
    });
  }
});

// GET /api/v1/packages/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const pkg = await prisma.weddingPackage.findUnique({
      where: { id },
    });

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: 'Wedding package not found',
      });
    }

    return res.json({
      success: true,
      message: 'Wedding package retrieved',
      data: formatDecimal(pkg),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching wedding package',
      error: error.message,
    });
  }
});

export default router;
