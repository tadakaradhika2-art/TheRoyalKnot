import { Router } from 'express';
import { prisma } from '../db.js';
import { formatDecimal } from '../utils/format.js';

const router = Router();

// GET /api/v1/enquiries
router.get('/', async (req, res) => {
  try {
    const list = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({
      success: true,
      message: 'Consultation enquiries retrieved',
      data: formatDecimal(list),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve enquiries',
      error: error.message,
    });
  }
});

// GET /api/v1/enquiries/:id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const enquiry = await prisma.enquiry.findUnique({ where: { id } });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }
    return res.json({
      success: true,
      message: 'Enquiry details',
      data: formatDecimal(enquiry),
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Error retrieving enquiry', error: error.message });
  }
});

// POST /api/v1/enquiries
router.post('/', async (req, res) => {
  const data = req.body;
  const email = (data.email || '').trim().toLowerCase();

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required for enquiry submission',
    });
  }

  try {
    // Idempotent upsert logic: check if enquiry with this email already exists
    const existing = await prisma.enquiry.findUnique({
      where: { email },
    });

    if (existing) {
      const updated = await prisma.enquiry.update({
        where: { id: existing.id },
        data: {
          coupleNames: data.coupleNames || existing.coupleNames,
          phone: data.phone || existing.phone,
          preferredWeddingDate: data.preferredWeddingDate ? new Date(data.preferredWeddingDate) : existing.preferredWeddingDate,
          estimatedGuestCount: Number(data.estimatedGuestCount) || existing.estimatedGuestCount,
          weddingLocation: data.weddingLocation || existing.weddingLocation,
          preferredTheme: data.preferredTheme || existing.preferredTheme,
          weddingType: data.weddingType || existing.weddingType,
          selectedPackage: data.selectedPackage || existing.selectedPackage,
          maximumBudget: Number(data.maximumBudget) || existing.maximumBudget,
          additionalRequirements: data.additionalRequirements || existing.additionalRequirements,
        },
      });

      return res.status(201).json({
        success: true,
        message: 'Enquiry updated successfully (idempotent)',
        data: formatDecimal(updated),
      });
    }

    const [enquiry] = await prisma.$transaction([
      prisma.enquiry.create({
        data: {
          coupleNames: data.coupleNames || 'Prospective Couple',
          email,
          phone: data.phone,
          preferredWeddingDate: data.preferredWeddingDate ? new Date(data.preferredWeddingDate) : null,
          estimatedGuestCount: Number(data.estimatedGuestCount) || 400,
          weddingLocation: data.weddingLocation || 'Rajasthan Heritage Palace',
          preferredTheme: data.preferredTheme || 'Royal Heritage',
          weddingType: data.weddingType || 'Traditional Royal',
          selectedPackage: data.selectedPackage || 'Full-Service Wedding',
          maximumBudget: Number(data.maximumBudget) || 2500000,
          additionalRequirements: data.additionalRequirements || null,
          status: 'New',
          assignedPlannerEmail: 'planner@royalknot.com',
        },
      }),
      prisma.notification.create({
        data: {
          title: 'New Consultation Enquiry',
          message: `${data.coupleNames || 'Prospective Couple'} registered interest for ${data.selectedPackage || 'Full-Service Wedding'}.`,
          type: 'ENQUIRY_SUBMITTED',
          targetRole: 'ROLE_PLANNER',
          isRead: false,
        },
      }),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: formatDecimal(enquiry),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry',
      error: error.message,
    });
  }
});

// POST /api/v1/enquiries/:id/schedule-consultation
router.post('/:id/schedule-consultation', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { scheduledDate, plannerEmail } = req.body;

  try {
    const [updated] = await prisma.$transaction([
      prisma.enquiry.update({
        where: { id },
        data: {
          consultationScheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
          status: 'Consultation Scheduled',
          assignedPlannerEmail: plannerEmail || 'planner@royalknot.com',
        },
      }),
      prisma.notification.create({
        data: {
          title: 'Consultation Scheduled',
          message: `Consultation confirmed for Enquiry #${id} on ${new Date(scheduledDate).toLocaleString()}.`,
          type: 'CONSULTATION_SCHEDULED',
          targetRole: 'ROLE_CLIENT',
          isRead: false,
        },
      }),
    ]);

    return res.json({
      success: true,
      message: 'Consultation scheduled successfully',
      data: formatDecimal(updated),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to schedule consultation',
      error: error.message,
    });
  }
});

// PATCH /api/v1/enquiries/:id/status
router.patch('/:id/status', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status, assignedPlannerEmail } = req.body;

  try {
    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        status,
        assignedPlannerEmail: assignedPlannerEmail || undefined,
      },
    });

    return res.json({
      success: true,
      message: 'Enquiry status updated',
      data: formatDecimal(updated),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update enquiry status',
      error: error.message,
    });
  }
});

export default router;
