import { Router } from 'express';
import { prisma } from '../db.js';
import { formatDecimal } from '../utils/format.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/vendor/events
// Returns ongoing, upcoming, and past accepted events for the logged-in vendor
router.get('/events', authenticateToken, async (req: AuthRequest, res) => {
  const vendorEmail = req.user?.email;
  if (!vendorEmail) {
    return res.status(401).json({ success: false, message: 'Vendor identity not found' });
  }

  try {
    const isStaff = req.user?.role === 'ROLE_ADMIN' || req.user?.role === 'ROLE_PLANNER';
    const filterEmail = isStaff && req.query.email ? String(req.query.email) : vendorEmail;

    const whereClause: any = isStaff && !req.query.email ? {} : { vendorEmail: filterEmail };

    const events = await prisma.vendorEvent.findMany({
      where: whereClause,
      orderBy: { eventDate: 'asc' },
    });

    const ongoing = events.filter((e) => e.category === 'ONGOING' || e.eventStatus === 'In Progress');
    const upcoming = events.filter((e) => e.category === 'UPCOMING' && e.eventStatus !== 'In Progress');
    const past = events.filter((e) => e.category === 'PAST' || e.eventStatus === 'Completed');

    return res.json({
      success: true,
      message: 'Vendor events retrieved successfully',
      data: {
        all: formatDecimal(events),
        ongoing: formatDecimal(ongoing),
        upcoming: formatDecimal(upcoming),
        past: formatDecimal(past),
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor events',
      error: error.message,
    });
  }
});

// PATCH /api/v1/vendor/events/:id/progress
// Vendor updates their own assigned service progress and arrival status
router.patch('/events/:id/progress', authenticateToken, async (req: AuthRequest, res) => {
  const eventId = parseInt(req.params.id as string, 10);
  const { arrivalStatus, serviceProgress } = req.body;
  const vendorEmail = req.user?.email;

  try {
    const existing = await prisma.vendorEvent.findUnique({ where: { id: eventId } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Strict vendor restriction: Vendor can ONLY update their own event
    if (req.user?.role === 'ROLE_VENDOR' && existing.vendorEmail !== vendorEmail) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only update your own assigned event services',
      });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const event = await tx.vendorEvent.update({
        where: { id: eventId },
        data: {
          arrivalStatus: arrivalStatus !== undefined ? arrivalStatus : existing.arrivalStatus,
          serviceProgress: serviceProgress !== undefined ? serviceProgress : existing.serviceProgress,
        },
      });

      // Dispatches operational alert to Lead Planner Control Room
      await tx.notification.create({
        data: {
          title: `Vendor Progress: ${existing.vendorName}`,
          message: `${existing.eventName} (${existing.serviceType}): ${arrivalStatus || existing.arrivalStatus}. Progress: ${serviceProgress || existing.serviceProgress}`,
          type: arrivalStatus === 'Running Late' ? 'ARRIVAL_ALERT' : 'VENDOR_UPDATE',
          targetRole: 'ROLE_PLANNER',
          isRead: false,
        },
      });

      // Synchronize arrival status on eventTimeline where assignedVendor matches
      if (arrivalStatus) {
        await tx.eventTimeline.updateMany({
          where: {
            assignedVendor: { contains: existing.vendorName },
          },
          data: {
            arrivalStatus,
            statusUpdatedAt: new Date(),
          },
        });
      }

      return event;
    });

    return res.json({
      success: true,
      message: 'Service progress updated successfully',
      data: formatDecimal(updated),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update service progress',
      error: error.message,
    });
  }
});

export default router;
