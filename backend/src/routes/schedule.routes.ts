import { Router } from 'express';
import { prisma } from '../db.js';
import { formatDecimal } from '../utils/format.js';
import { optionalAuthenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

const DEFAULT_SCHEDULE = [
  { timeSlot: '08:00 AM', activity: 'Venue preparation & Stage Setup', assignedVendor: 'Jaipur Heritage Decor Crew', activityStatus: 'Completed', expectedCompletion: '09:30 AM', actualCompletion: '09:15 AM', delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'All floral trucks checked in at South Gate on schedule.' },
  { timeSlot: '09:00 AM', activity: 'Vendor setup & Live Kitchens', assignedVendor: 'Maharaja Catering & Events', activityStatus: 'In Progress', expectedCompletion: '11:00 AM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Kitchen equipment positioned in Palace Banquet Hall; prep underway.' },
  { timeSlot: '10:00 AM', activity: 'Groom arrival & Baraat procession', assignedVendor: 'Saptapadi Brass Band & Royal Elephant Escort', activityStatus: 'Completed', expectedCompletion: '11:00 AM', actualCompletion: '10:50 AM', delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Vintage Rolls Royce arrived on schedule; Baraat reached palace gate.' },
  { timeSlot: '11:00 AM', activity: 'Garland exchange (Varmala)', assignedVendor: 'Event Coordination Team', activityStatus: 'In Progress', expectedCompletion: '11:45 AM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Varmala revolving stage tested and ready.' },
  { timeSlot: '12:00 PM', activity: 'Wedding rituals and vows (Mandap Pheras)', assignedVendor: 'Lead Priest & Vedic Troupe', activityStatus: 'Upcoming', expectedCompletion: '01:30 PM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Havan kund setup completed by Vedic priests.' },
  { timeSlot: '02:00 PM', activity: 'Royal Lunch Banquet', assignedVendor: 'Maharaja Catering & Events', activityStatus: 'Delayed', expectedCompletion: '03:45 PM', actualCompletion: null, delayMinutes: 15, arrivalStatus: 'Running Late', notes: 'Dessert counter delay reported: 15 min buffer applied.' },
  { timeSlot: '06:00 PM', activity: 'Reception preparation & Sound check', assignedVendor: 'Sound & Lighting Team', activityStatus: 'Upcoming', expectedCompletion: '06:45 PM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Arrived', notes: 'Acoustics calibrated for palace courtyard.' },
  { timeSlot: '07:00 PM', activity: 'Grand Reception begins', assignedVendor: 'Celebrity DJ & Live Troupe', activityStatus: 'Upcoming', expectedCompletion: '11:30 PM', actualCompletion: null, delayMinutes: 0, arrivalStatus: 'Not Arrived', notes: 'Expected arrival at 06:45 PM for technical briefing.' },
];

// GET /api/v1/schedule
// Returns live wedding timeline for Planner and authenticated users
router.get('/', optionalAuthenticate, async (req: AuthRequest, res) => {
  try {
    let list = await prisma.eventTimeline.findMany({
      orderBy: { id: 'asc' },
    });

    if (list.length === 0) {
      for (const item of DEFAULT_SCHEDULE) {
        await prisma.eventTimeline.upsert({
          where: {
            timeSlot_activity: {
              timeSlot: item.timeSlot,
              activity: item.activity,
            },
          },
          update: {},
          create: item,
        });
      }
      list = await prisma.eventTimeline.findMany({ orderBy: { id: 'asc' } });
    }

    return res.json({
      success: true,
      message: 'Schedule retrieved successfully',
      data: formatDecimal(list),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve schedule',
      error: error.message,
    });
  }
});

// PATCH /api/v1/schedule/:id/activity-status
// Lead Planner updates activity status, completion time, delay minutes, or notes
router.patch('/:id/activity-status', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { activityStatus, actualCompletion, expectedCompletion, delayMinutes, notes } = req.body;

  try {
    const target = await prisma.eventTimeline.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, message: 'Timeline item not found' });
    }

    const updatedData: any = {
      statusUpdatedAt: new Date(),
    };

    if (activityStatus !== undefined) updatedData.activityStatus = activityStatus;
    if (actualCompletion !== undefined) updatedData.actualCompletion = actualCompletion;
    if (expectedCompletion !== undefined) updatedData.expectedCompletion = expectedCompletion;
    if (delayMinutes !== undefined) updatedData.delayMinutes = Number(delayMinutes);
    if (notes !== undefined) updatedData.notes = notes;

    // Auto set actual completion time if marked completed and not explicitly provided
    if (activityStatus === 'Completed' && !actualCompletion && !target.actualCompletion) {
      const now = new Date();
      updatedData.actualCompletion = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    const [updated] = await prisma.$transaction([
      prisma.eventTimeline.update({
        where: { id },
        data: updatedData,
      }),
      prisma.notification.create({
        data: {
          title: `Control Room: ${target.activity} is ${activityStatus || target.activityStatus}`,
          message: `Planner updated ${target.activity} (${target.timeSlot}): Status is ${activityStatus || target.activityStatus}${delayMinutes ? ` (Delay: ${delayMinutes} min)` : ''}. ${notes || ''}`.trim(),
          type: activityStatus === 'Delayed' ? 'ACTIVITY_DELAYED' : activityStatus === 'Completed' ? 'ACTIVITY_COMPLETED' : 'SCHEDULE_UPDATE',
          targetRole: 'ROLE_PLANNER',
          isRead: false,
        },
      }),
    ]);

    return res.json({
      success: true,
      message: 'Event activity status updated successfully',
      data: formatDecimal(updated),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update activity status',
      error: error.message,
    });
  }
});

// PATCH /api/v1/schedule/:id/timing
// Planner modifies activity timing, expected completion, or operational notes
router.patch('/:id/timing', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { timeSlot, expectedCompletion, notes, delayMinutes } = req.body;

  try {
    const target = await prisma.eventTimeline.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, message: 'Timeline item not found' });
    }

    const updated = await prisma.eventTimeline.update({
      where: { id },
      data: {
        timeSlot: timeSlot || target.timeSlot,
        expectedCompletion: expectedCompletion !== undefined ? expectedCompletion : target.expectedCompletion,
        notes: notes !== undefined ? notes : target.notes,
        delayMinutes: delayMinutes !== undefined ? Number(delayMinutes) : target.delayMinutes,
        statusUpdatedAt: new Date(),
      },
    });

    await prisma.notification.create({
      data: {
        title: `Schedule Adjustment: ${target.activity}`,
        message: `Timing updated to ${timeSlot || target.timeSlot}. Expected completion: ${expectedCompletion || target.expectedCompletion || 'N/A'}.`,
        type: 'SCHEDULE_UPDATE',
        targetRole: 'ROLE_PLANNER',
        isRead: false,
      },
    });

    return res.json({
      success: true,
      message: 'Timeline timing updated successfully',
      data: formatDecimal(updated),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update timeline timing',
      error: error.message,
    });
  }
});

// POST /api/v1/schedule/arrival-update
// Updates vendor arrival status, arrival time, notes
router.post('/arrival-update', async (req, res) => {
  const { timelineId, arrivalStatus, notes, delayMinutes } = req.body;
  const id = parseInt(timelineId, 10);

  try {
    const target = await prisma.eventTimeline.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, message: 'Timeline item not found' });
    }

    const [updated] = await prisma.$transaction([
      prisma.eventTimeline.update({
        where: { id },
        data: {
          arrivalStatus,
          notes: notes !== undefined ? notes : target.notes,
          delayMinutes: delayMinutes !== undefined ? Number(delayMinutes) : target.delayMinutes,
          statusUpdatedAt: new Date(),
        },
      }),
      prisma.notification.create({
        data: {
          title: `Vendor Arrival: ${target.assignedVendor || 'Vendor'} is ${arrivalStatus}`,
          message: `${target.activity} (${target.timeSlot}): ${arrivalStatus}. ${notes || ''}`.trim(),
          type: arrivalStatus === 'Running Late' ? 'ARRIVAL_ALERT' : 'VENDOR_ARRIVED',
          targetRole: 'ROLE_PLANNER',
          isRead: false,
        },
      }),
    ]);

    return res.json({
      success: true,
      message: 'Vendor arrival status updated',
      data: formatDecimal(updated),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update arrival status',
      error: error.message,
    });
  }
});

// POST /api/v1/schedule
router.post('/', async (req, res) => {
  const data = req.body;
  try {
    const item = await prisma.eventTimeline.upsert({
      where: {
        timeSlot_activity: {
          timeSlot: data.timeSlot,
          activity: data.activity,
        },
      },
      update: {
        assignedVendor: data.assignedVendor || undefined,
        activityStatus: data.activityStatus || undefined,
        expectedCompletion: data.expectedCompletion || undefined,
        actualCompletion: data.actualCompletion || undefined,
        delayMinutes: data.delayMinutes !== undefined ? Number(data.delayMinutes) : undefined,
        arrivalStatus: data.arrivalStatus || undefined,
        notes: data.notes || undefined,
      },
      create: {
        timeSlot: data.timeSlot,
        activity: data.activity,
        assignedVendor: data.assignedVendor || null,
        activityStatus: data.activityStatus || 'Upcoming',
        expectedCompletion: data.expectedCompletion || null,
        actualCompletion: data.actualCompletion || null,
        delayMinutes: Number(data.delayMinutes) || 0,
        arrivalStatus: data.arrivalStatus || 'Not Arrived',
        notes: data.notes || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Timeline item recorded',
      data: formatDecimal(item),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add timeline item',
      error: error.message,
    });
  }
});

export default router;
