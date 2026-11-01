import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/v1/notifications
router.get('/', async (req, res) => {
  const role = req.query.role as string | undefined;

  try {
    const whereClause: any = {};
    if (role) {
      whereClause.OR = [{ targetRole: role }, { targetRole: null }];
    }

    const list = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    // Map to frontend NotificationItem interface (supporting both read and isRead)
    const formatted = list.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type,
      targetRole: n.targetRole,
      read: n.isRead,
      isRead: n.isRead,
      timestamp: n.timestamp.toISOString(),
    }));

    return res.json({
      success: true,
      message: 'Notifications retrieved',
      data: formatted,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
      error: error.message,
    });
  }
});

// PATCH /api/v1/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  try {
    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return res.json({
      success: true,
      message: 'Notification marked as read',
      data: {
        id: updated.id,
        title: updated.title,
        message: updated.message,
        type: updated.type,
        targetRole: updated.targetRole,
        read: updated.isRead,
        isRead: updated.isRead,
        timestamp: updated.timestamp.toISOString(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
});

// POST /api/v1/notifications/mark-all-read
router.post('/mark-all-read', async (req, res) => {
  const { role } = req.body;

  try {
    const whereClause: any = {};
    if (role) {
      whereClause.targetRole = role;
    }

    await prisma.notification.updateMany({
      where: whereClause,
      data: { isRead: true },
    });

    return res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message,
    });
  }
});

// POST /api/v1/notifications
router.post('/', async (req, res) => {
  const { title, message, type = 'INFO', targetRole } = req.body;

  try {
    const notif = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        targetRole: targetRole || null,
        isRead: false,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Notification created',
      data: {
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        targetRole: notif.targetRole,
        read: notif.isRead,
        isRead: notif.isRead,
        timestamp: notif.timestamp.toISOString(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message,
    });
  }
});

export default router;
