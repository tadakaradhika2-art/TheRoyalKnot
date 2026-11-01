import { Router } from 'express';
import { prisma } from '../db.js';
import { formatDecimal } from '../utils/format.js';

const router = Router();

const DEFAULT_25_TASKS = [
  // 1. Venue & Logistics
  { title: 'Venue confirmation', description: 'Finalize luxury heritage palace contracts for all 3 days', category: 'Venue and Logistics', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'CRITICAL', status: 'Completed' },
  { title: 'Accommodation arrangements', description: 'Block 120 luxury suites for out-of-town guests', category: 'Venue and Logistics', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'HIGH', status: 'Completed' },
  { title: 'Guest transportation', description: 'Charter vintage cars for bridal party and luxury shuttles', category: 'Venue and Logistics', assignedOwner: 'Transport Lead', priority: 'MEDIUM', status: 'In Progress' },
  { title: 'Seating arrangements', description: 'Design VIP royal court and family table seating plan', category: 'Venue and Logistics', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'HIGH', status: 'In Progress' },

  // 2. Design & Decoration
  { title: 'Theme finalization', description: 'Lock Royal Heritage & Gold moodboard and palette', category: 'Design and Decoration', assignedOwner: 'Creative Director', priority: 'HIGH', status: 'Completed' },
  { title: 'Stage design', description: 'Fabricate bespoke carved golden mandap backdrop', category: 'Design and Decoration', assignedOwner: 'Production Lead', priority: 'CRITICAL', status: 'In Progress' },
  { title: 'Floral arrangements', description: 'Order 10,00,000 fresh marigolds, red roses & exotic orchids', category: 'Design and Decoration', assignedOwner: 'Floral Lead', priority: 'HIGH', status: 'To Plan' },
  { title: 'Lighting arrangements', description: 'Install fairy light canopy and architectural palace uplighting', category: 'Design and Decoration', assignedOwner: 'Lighting Director', priority: 'MEDIUM', status: 'To Plan' },

  // 3. Vendor Coordination
  { title: 'Caterer confirmation', description: 'Lock Maharaja Catering & Events contract and finalize 8 live counters', category: 'Vendor Coordination', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'CRITICAL', status: 'Completed' },
  { title: 'Photography confirmation', description: 'Contract candid luxury photographer and drone crew', category: 'Vendor Coordination', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'HIGH', status: 'Completed' },
  { title: 'Videography confirmation', description: 'Brief cinematic video team for same-day edit trailer', category: 'Vendor Coordination', assignedOwner: 'Media Lead', priority: 'MEDIUM', status: 'In Progress' },
  { title: 'Entertainment arrangements', description: 'Confirm classical shehnai troupe and celebrity DJ', category: 'Vendor Coordination', assignedOwner: 'Entertainment Manager', priority: 'HIGH', status: 'In Progress' },

  // 4. Wedding Ceremonies
  { title: 'Mehendi arrangements', description: 'Setup bohemian colorful courtyard with organic henna artists', category: 'Wedding Ceremonies', assignedOwner: 'Cultural Lead', priority: 'HIGH', status: 'To Plan' },
  { title: 'Haldi arrangements', description: 'Design floral pool deck with yellow marigold curtains', category: 'Wedding Ceremonies', assignedOwner: 'Cultural Lead', priority: 'HIGH', status: 'To Plan' },
  { title: 'Sangeet arrangements', description: 'Rehearse bridal dance sequence and test sound stage', category: 'Wedding Ceremonies', assignedOwner: 'Choreographer', priority: 'HIGH', status: 'In Progress' },
  { title: 'Wedding ceremony preparation', description: 'Review Vedic priest requirements, sacred fire havan kund', category: 'Wedding Ceremonies', assignedOwner: 'Lead Priest & Planner', priority: 'CRITICAL', status: 'To Plan' },

  // 5. Reception
  { title: 'Reception stage preparation', description: 'Construct royal throne podium with floral chandeliers', category: 'Reception', assignedOwner: 'Production Lead', priority: 'HIGH', status: 'To Plan' },
  { title: 'Reception catering', description: 'Coordinate 7-course royal banquet and dessert bar', category: 'Reception', assignedOwner: 'Maharaja Catering & Events', priority: 'CRITICAL', status: 'To Plan' },
  { title: 'Guest welcome arrangements', description: 'Organize traditional rose water sprinkling & aarti welcome', category: 'Reception', assignedOwner: 'Hospitality Desk', priority: 'MEDIUM', status: 'To Plan' },

  // 6. Additional Planning
  { title: 'Invitation design', description: 'Dispatch gold-foiled laser cut digital invitations', category: 'Additional Planning', assignedOwner: 'Creative Director', priority: 'HIGH', status: 'Completed' },
  { title: 'Guest list finalization', description: 'Lock final headcount at 400 guests with RSVP validation', category: 'Additional Planning', assignedOwner: 'Couple', priority: 'CRITICAL', status: 'Completed' },
  { title: 'Return gifts', description: 'Curate silver coin keepsake boxes and artisanal sweets', category: 'Additional Planning', assignedOwner: 'Gifting Lead', priority: 'MEDIUM', status: 'In Progress' },
  { title: 'Makeup coordination', description: 'Conduct bridal trial with luxury celebrity MUA', category: 'Additional Planning', assignedOwner: 'Bridal Lead', priority: 'HIGH', status: 'In Progress' },
  { title: 'Final vendor confirmation', description: 'Conduct all-hands vendor briefing and call sheets', category: 'Additional Planning', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'CRITICAL', status: 'To Plan' },
  { title: 'Final event checklist', description: 'Comprehensive master checklist walkthrough with couple', category: 'Additional Planning', assignedOwner: 'Ishaani Sharma (Lead Planner)', priority: 'CRITICAL', status: 'To Plan' },
];

// GET /api/v1/tasks
router.get('/', async (req, res) => {
  try {
    let tasks = await prisma.weddingTask.findMany({
      orderBy: { id: 'asc' },
    });

    if (tasks.length === 0) {
      for (const t of DEFAULT_25_TASKS) {
        await prisma.weddingTask.upsert({
          where: {
            enquiryId_title: {
              enquiryId: 1,
              title: t.title,
            },
          },
          update: {},
          create: {
            ...t,
            enquiryId: 1,
          },
        });
      }
      tasks = await prisma.weddingTask.findMany({ orderBy: { id: 'asc' } });
    }

    return res.json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: formatDecimal(tasks),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: error.message,
    });
  }
});

// GET /api/v1/tasks/stats
router.get('/stats', async (req, res) => {
  try {
    const tasks = await prisma.weddingTask.findMany();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const toPlan = tasks.filter((t) => t.status === 'To Plan').length;
    const delayed = tasks.filter((t) => t.status === 'Delayed').length;

    return res.json({
      success: true,
      message: 'Task statistics retrieved',
      data: {
        total,
        completed,
        inProgress,
        toPlan,
        delayed,
        progressPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task stats',
      error: error.message,
    });
  }
});

// POST /api/v1/tasks/auto-generate
router.post('/auto-generate', async (req, res) => {
  try {
    for (const t of DEFAULT_25_TASKS) {
      await prisma.weddingTask.upsert({
        where: {
          enquiryId_title: {
            enquiryId: 1,
            title: t.title,
          },
        },
        update: {},
        create: {
          ...t,
          enquiryId: 1,
        },
      });
    }
    const tasks = await prisma.weddingTask.findMany({ orderBy: { id: 'asc' } });

    // Only notify if needed or idempotent
    await prisma.notification.create({
      data: {
        title: 'Master Tasks Auto-Generated',
        message: '25 automated milestone tasks initialized for the wedding plan.',
        type: 'TASKS_GENERATED',
        targetRole: 'ROLE_PLANNER',
        isRead: false,
      },
    });

    return res.json({
      success: true,
      message: '25 master tasks generated successfully',
      data: formatDecimal(tasks),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to auto-generate tasks',
      error: error.message,
    });
  }
});

// PATCH /api/v1/tasks/:id/status
router.patch('/:id/status', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  try {
    const updated = await prisma.weddingTask.update({
      where: { id },
      data: {
        status,
        completionTimestamp: status === 'Completed' ? new Date() : null,
      },
    });

    return res.json({
      success: true,
      message: 'Task status updated',
      data: formatDecimal(updated),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update task status',
      error: error.message,
    });
  }
});

export default router;
