import { Router } from 'express';
import { prisma } from '../db.js';
import { formatDecimal } from '../utils/format.js';

const router = Router();

// GET /api/v1/agreements/active
router.get('/active', async (req, res) => {
  try {
    let agr = await prisma.agreement.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!agr) {
      agr = await prisma.agreement.create({
        data: {
          agreementNumber: 'AGR-2026-SHARMA-01',
          clientNames: 'Aanya Sharma & Arjun Mehta',
          clientEmail: 'client@royalknot.com',
          packageName: 'Full-Service Royal Luxury',
          serviceScope: 'Complete 3-Day Wedding Planning at City Palace, Udaipur: Royal Rajasthani Mandap styling, 3-Day Catering coordination for 400 guests, Sangeet & Shehnai orchestration, 25+ automated task management, and live event control.',
          agreedPrice: 2500000.0,
          termsAndConditions: '1. A 20% booking deposit (₹5,00,000) confirms reservation.\n2. Milestone 2 due 30 days prior to wedding date.\n3. The Royal Knot provides dedicated senior wedding planner and day-of control team.',
          status: 'Sent',
        },
      });
    }

    return res.json({
      success: true,
      message: 'Active agreement retrieved',
      data: formatDecimal(agr),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve active agreement',
      error: error.message,
    });
  }
});

// GET /api/v1/agreements
router.get('/', async (req, res) => {
  try {
    const list = await prisma.agreement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json({
      success: true,
      message: 'Agreements list retrieved',
      data: formatDecimal(list),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve agreements',
      error: error.message,
    });
  }
});

// POST /api/v1/agreements
router.post('/', async (req, res) => {
  const data = req.body;
  try {
    const agreement = await prisma.agreement.create({
      data: {
        agreementNumber: data.agreementNumber || `AGR-${Date.now()}`,
        clientNames: data.clientNames,
        clientEmail: data.clientEmail,
        packageName: data.packageName || 'Full-Service Wedding',
        serviceScope: data.serviceScope,
        agreedPrice: Number(data.agreedPrice) || 2500000,
        termsAndConditions: data.termsAndConditions,
        status: 'Sent',
      },
    });

    await prisma.notification.create({
      data: {
        title: 'New Service Agreement Generated',
        message: `Agreement #${agreement.agreementNumber} prepared for ${agreement.clientNames}.`,
        type: 'AGREEMENT_GENERATED',
        targetRole: 'ROLE_CLIENT',
        isRead: false,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Agreement created successfully',
      data: formatDecimal(agreement),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create agreement',
      error: error.message,
    });
  }
});

// POST /api/v1/agreements/sign
router.post('/sign', async (req, res) => {
  const { agreementId, signatureData, signerName } = req.body;

  try {
    const targetAgreement = agreementId
      ? await prisma.agreement.findUnique({ where: { id: parseInt(agreementId, 10) } })
      : await prisma.agreement.findFirst({ orderBy: { createdAt: 'desc' } });

    if (!targetAgreement) {
      return res.status(404).json({ success: false, message: 'Agreement not found' });
    }

    const [updated] = await prisma.$transaction([
      prisma.agreement.update({
        where: { id: targetAgreement.id },
        data: {
          signatureData: signatureData || 'DIGITAL_SIGNATURE_CAPTURED',
          signedTimestamp: new Date(),
          status: 'Signed',
        },
      }),
      prisma.notification.create({
        data: {
          title: 'Agreement Digitally Signed',
          message: `Service Agreement #${targetAgreement.agreementNumber} signed by ${signerName || targetAgreement.clientNames}!`,
          type: 'AGREEMENT_SIGNED',
          targetRole: 'ROLE_PLANNER',
          isRead: false,
        },
      }),
    ]);

    return res.json({
      success: true,
      message: 'Agreement signed successfully',
      data: formatDecimal(updated),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to sign agreement',
      error: error.message,
    });
  }
});

export default router;
