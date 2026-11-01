import { Router } from 'express';
import { prisma } from '../db.js';
import { formatDecimal } from '../utils/format.js';
import { optionalAuthenticate, AuthRequest } from '../middleware/auth.js';
import { HINDU_WEDDING_CATEGORIES } from '../constants/categories.js';

const router = Router();

// GET /api/v1/quotations/categories
// Returns all 39 Hindu wedding categories with current quotation counts and client selections
router.get('/categories', optionalAuthenticate, async (req: AuthRequest, res) => {
  try {
    const enquiryId = 1;

    // Get all quotations for this enquiry
    const quotations = await prisma.vendorQuotation.findMany({
      where: { enquiryId },
      select: {
        id: true,
        serviceCategory: true,
        vendorName: true,
        packageTitle: true,
        totalEstimatedPrice: true,
        status: true,
      },
    });

    // Also get active line items from the invoice
    const activeLineItems = await prisma.invoiceLineItem.findMany({
      where: { enquiryId },
    });

    const categoryStats = HINDU_WEDDING_CATEGORIES.map((cat) => {
      // Find matching quotes by category name or id
      const matchingQuotes = quotations.filter((q) => {
        const qCat = q.serviceCategory.toLowerCase();
        return qCat === cat.name.toLowerCase() || 
               qCat === cat.id.toLowerCase() ||
               (cat.name.includes('Catering') && qCat.includes('catering')) ||
               (cat.name.includes('Mandap') && qCat.includes('mandap')) ||
               (cat.name.includes('Photography') && qCat.includes('photography')) ||
               (cat.name.includes('Mehendi') && qCat.includes('mehendi')) ||
               (cat.name.includes('Pandit') && qCat.includes('pandit')) ||
               (cat.name.includes('Music') && qCat.includes('music'));
      });

      const selectedQuote = matchingQuotes.find(
        (q) => q.status === 'ACCEPTED' || q.status === 'SELECTED'
      );

      const matchingLineItem = activeLineItems.find((li) => {
        const liCat = li.category.toLowerCase();
        return liCat === cat.name.toLowerCase() ||
               (cat.name.includes('Catering') && liCat.includes('catering')) ||
               (cat.name.includes('Mandap') && liCat.includes('mandap')) ||
               (cat.name.includes('Photography') && liCat.includes('photography')) ||
               (cat.name.includes('Mehendi') && liCat.includes('mehendi')) ||
               (cat.name.includes('Pandit') && liCat.includes('pandit')) ||
               (cat.name.includes('Music') && liCat.includes('music'));
      });

      return {
        ...cat,
        quotationCount: matchingQuotes.length,
        selectedVendor: selectedQuote ? selectedQuote.vendorName : (matchingLineItem?.vendorName || null),
        selectedPackage: selectedQuote ? selectedQuote.packageTitle : (matchingLineItem?.packageTitle || null),
        selectedAmount: selectedQuote ? Number(selectedQuote.totalEstimatedPrice) : (matchingLineItem ? Number(matchingLineItem.lineTotal) : null),
        selectedQuotationId: selectedQuote?.id || matchingLineItem?.quotationId || null,
        isSelected: !!(selectedQuote || matchingLineItem),
      };
    });

    return res.json({
      success: true,
      message: 'Hindu wedding vendor categories retrieved',
      data: categoryStats,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: error.message,
    });
  }
});

// GET /api/v1/quotations
router.get('/', optionalAuthenticate, async (req: AuthRequest, res) => {
  try {
    const whereClause: any = {};

    // Vendor privacy restriction
    if (req.user?.role === 'ROLE_VENDOR') {
      whereClause.vendorEmail = req.user.email;
    }

    // Category filter: support exact or fuzzy category matching
    if (req.query.category) {
      const catParam = String(req.query.category).trim();
      const tokens = catParam.split(/[\s/]+/).filter((t) => t.length >= 4);
      whereClause.OR = [
        { serviceCategory: { equals: catParam, mode: 'insensitive' } },
        { serviceCategory: { contains: catParam, mode: 'insensitive' } },
        ...tokens.map((t) => ({ serviceCategory: { contains: t, mode: 'insensitive' } })),
      ];
    }

    if (req.query.enquiryId) {
      whereClause.enquiryId = Number(req.query.enquiryId);
    }

    const quotes = await prisma.vendorQuotation.findMany({
      where: whereClause,
      orderBy: { totalEstimatedPrice: 'asc' },
    });

    return res.json({
      success: true,
      message: 'Quotations retrieved',
      data: formatDecimal(quotes),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve quotations',
      error: error.message,
    });
  }
});

// GET /api/v1/quotations/catering (Preserved for backwards compatibility)
router.get('/catering', optionalAuthenticate, async (req: AuthRequest, res) => {
  try {
    const whereClause: any = {
      OR: [
        { serviceCategory: { equals: 'Catering', mode: 'insensitive' } },
        { serviceCategory: { equals: 'Wedding Catering', mode: 'insensitive' } },
      ],
    };
    if (req.user?.role === 'ROLE_VENDOR') {
      whereClause.vendorEmail = req.user.email;
    }

    const quotes = await prisma.vendorQuotation.findMany({
      where: whereClause,
      orderBy: { totalEstimatedPrice: 'asc' },
    });
    return res.json({
      success: true,
      message: 'Catering quotations retrieved',
      data: formatDecimal(quotes),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve catering quotations',
      error: error.message,
    });
  }
});

// POST /api/v1/quotations/request
// Client requests quotations for a category with no available quotes
router.post('/request', async (req, res) => {
  const { category, notes, clientName } = req.body;
  const catName = category || 'Wedding Service';
  const couple = clientName || 'Aanya Sharma & Arjun Mehta';

  try {
    const notif = await prisma.notification.create({
      data: {
        title: 'Vendor Quotation Requested',
        message: `${couple} requested vendor quotations for "${catName}". Client notes: ${notes || 'Standard royal wedding scope'}.`,
        type: 'QUOTATION_REQUESTED',
        targetRole: 'ROLE_PLANNER',
        isRead: false,
      },
    });

    return res.status(201).json({
      success: true,
      message: `Quotation request for "${catName}" has been transmitted to Lead Planner Ishaani Sharma.`,
      data: formatDecimal(notif),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to transmit quotation request',
      error: error.message,
    });
  }
});

// POST /api/v1/quotations
// Vendor submits or updates quotation
router.post('/', async (req, res) => {
  const data = req.body;
  const pricingModel = data.pricingModel || (data.guestCount > 1 ? 'PER_PLATE' : 'FIXED');
  const pricePerPlate = Number(data.pricePerPlate) || 2000;
  const guestCount = Number(data.guestCount) || (pricingModel === 'FIXED' ? 1 : 400);
  const additionalCharges = Number(data.additionalCharges) || 0;
  const taxAmount = Number(data.taxAmount) || 0;
  const totalEstimatedPrice = pricingModel === 'FIXED'
    ? pricePerPlate + additionalCharges + taxAmount
    : pricePerPlate * guestCount + additionalCharges + taxAmount;

  try {
    const quote = await prisma.vendorQuotation.create({
      data: {
        vendorName: data.vendorName || 'Royal Rasoi Caterers',
        vendorEmail: data.vendorEmail || 'vendor@royalknot.com',
        serviceCategory: data.serviceCategory || 'Wedding Catering',
        pricingModel,
        packageTitle: data.packageTitle || 'Bespoke Package',
        description: data.description || 'Full luxury wedding service.',
        cuisineType: data.cuisineType || 'Royal Awadhi & Mughlai Heritage',
        regionalSpecialization: data.regionalSpecialization || 'Traditional Heritage Specialization',
        menuDetails: data.menuDetails || 'Full service luxury presentation',
        vegetarianOptionsCount: Number(data.vegetarianOptionsCount) || 15,
        nonVegetarianOptionsCount: Number(data.nonVegetarianOptionsCount) || 10,
        pricePerPlate,
        guestCount,
        additionalCharges,
        taxAmount,
        totalEstimatedPrice,
        serviceInclusions: data.serviceInclusions || 'Full palace service equipment and staff',
        exclusions: data.exclusions || 'Custom licensing permits',
        recommended: Boolean(data.recommended),
        status: 'SUBMITTED',
        enquiryId: Number(data.enquiryId) || 1,
        availability: data.availability || 'Confirmed Available for Wedding Date',
        validUntil: data.validUntil ? new Date(data.validUntil) : new Date('2026-12-31T23:59:59Z'),
        termsAndConditions: data.termsAndConditions || 'Guaranteed booking, 50% advance upon contract signing.',
      },
    });

    await prisma.notification.create({
      data: {
        title: 'New Quotation Received',
        message: `${quote.vendorName} submitted a quote of ₹${totalEstimatedPrice.toLocaleString('en-IN')} for ${quote.serviceCategory}.`,
        type: 'QUOTATION_RECEIVED',
        targetRole: 'ROLE_PLANNER',
        isRead: false,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Quotation submitted successfully',
      data: formatDecimal(quote),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit quotation',
      error: error.message,
    });
  }
});

// POST /api/v1/quotations/:id/select
// Client selects one quotation for a category; updates line items and bill dynamically
router.post('/:id/select', async (req, res) => {
  const quoteId = parseInt(req.params.id, 10);
  const allowReplace = Boolean(req.body?.replace);

  try {
    const selected = await prisma.vendorQuotation.findUnique({ where: { id: quoteId } });
    if (!selected) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    const targetEnquiryId = selected.enquiryId || 1;

    // 1. If this quotation has already been accepted:
    if (selected.status === 'ACCEPTED' || selected.status === 'SELECTED') {
      return res.status(400).json({
        success: false,
        message: 'This vendor quotation has already been accepted and confirmed for this booking.',
      });
    }

    // 2. Check if another quotation in the SAME category is currently accepted:
    const existingAccepted = await prisma.vendorQuotation.findFirst({
      where: {
        enquiryId: targetEnquiryId,
        serviceCategory: selected.serviceCategory,
        status: { in: ['ACCEPTED', 'SELECTED'] },
      },
    });

    if (existingAccepted && !allowReplace) {
      return res.status(400).json({
        success: false,
        message: `A quotation has already been confirmed for this booking (${existingAccepted.vendorName}). Multiple selections are not permitted.`,
      });
    }

    // 3. Ensure an active Invoice exists
    let activeInvoice = await prisma.invoice.findFirst({
      orderBy: { generatedAt: 'desc' },
    });

    if (!activeInvoice) {
      activeInvoice = await prisma.invoice.create({
        data: {
          invoiceNumber: 'INV-RK-2026-001',
          clientNames: 'Aanya Sharma & Arjun Mehta',
          agreedPackageAmount: 2500000.0,
          approvedAdditionalCosts: 120000.0,
          finalClientAmount: 2620000.0,
          amountReceived: 1500000.0,
          outstandingBalance: 1120000.0,
          vendorPayableAmount: 1450000.0,
          paymentStatus: 'PARTIALLY_PAID',
        },
      });
    }

    // 4. Atomic Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Step A: Mark previous accepted quote in this category back to SUBMITTED if replacing
      if (existingAccepted) {
        await tx.vendorQuotation.update({
          where: { id: existingAccepted.id },
          data: { status: 'SUBMITTED', selectionTimestamp: null },
        });
      }

      // Step B: Update newly selected quote to ACCEPTED
      const updatedQuote = await tx.vendorQuotation.update({
        where: { id: quoteId },
        data: {
          status: 'ACCEPTED',
          selectionTimestamp: new Date(),
        },
      });

      // Step C: Mark competing quotations within the SAME category and enquiry as REJECTED
      await tx.vendorQuotation.updateMany({
        where: {
          enquiryId: targetEnquiryId,
          serviceCategory: selected.serviceCategory,
          id: { not: quoteId },
        },
        data: {
          status: 'REJECTED',
        },
      });

      // Step D: Calculate line item amounts
      const isFixed = selected.pricingModel === 'FIXED';
      const unitPrice = Number(selected.pricePerPlate);
      const quantity = isFixed ? 1 : (selected.guestCount || 400);
      const baseAmount = isFixed ? unitPrice : unitPrice * quantity;
      const additionalCharges = Number(selected.additionalCharges) || 0;
      const taxAmount = Number(selected.taxAmount) || 0;
      const lineTotal = baseAmount + additionalCharges + taxAmount;

      // Step E: Upsert itemized line item in invoice_line_items
      const lineItem = await tx.invoiceLineItem.upsert({
        where: {
          enquiryId_category: {
            enquiryId: targetEnquiryId,
            category: selected.serviceCategory,
          },
        },
        create: {
          enquiryId: targetEnquiryId,
          invoiceId: activeInvoice.id,
          category: selected.serviceCategory,
          quotationId: selected.id,
          vendorName: selected.vendorName,
          vendorEmail: selected.vendorEmail,
          packageTitle: selected.packageTitle || selected.vendorName,
          pricingModel: selected.pricingModel || 'PER_PLATE',
          unitPrice,
          quantity,
          baseAmount,
          additionalCharges,
          taxAmount,
          discountAmount: 0,
          lineTotal,
          status: 'SELECTED',
        },
        update: {
          quotationId: selected.id,
          vendorName: selected.vendorName,
          vendorEmail: selected.vendorEmail,
          packageTitle: selected.packageTitle || selected.vendorName,
          pricingModel: selected.pricingModel || 'PER_PLATE',
          unitPrice,
          quantity,
          baseAmount,
          additionalCharges,
          taxAmount,
          discountAmount: 0,
          lineTotal,
          status: 'SELECTED',
          selectedAt: new Date(),
        },
      });

      // Step F: Recalculate invoice totals dynamically
      const allActiveLineItems = await tx.invoiceLineItem.findMany({
        where: { enquiryId: targetEnquiryId, status: 'SELECTED' },
      });
      const totalServicesAmount = allActiveLineItems.reduce(
        (sum, item) => sum + Number(item.lineTotal),
        0
      );

      const approvedExpenses = await tx.additionalExpense.findMany({
        where: { clientApprovalStatus: 'Approved' },
      });
      const totalApprovedExtras = approvedExpenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      // Compute final amount and outstanding balance
      const finalClientAmount = totalServicesAmount > 0 
        ? totalServicesAmount + totalApprovedExtras 
        : Number(activeInvoice.agreedPackageAmount) + totalApprovedExtras;
      const amountReceived = Number(activeInvoice.amountReceived);
      const outstandingBalance = Math.max(0, finalClientAmount - amountReceived);

      await tx.invoice.update({
        where: { id: activeInvoice.id },
        data: {
          agreedPackageAmount: totalServicesAmount > 0 ? totalServicesAmount : activeInvoice.agreedPackageAmount,
          approvedAdditionalCosts: totalApprovedExtras,
          finalClientAmount,
          outstandingBalance,
        },
      });

      // Step G: Notify Planner
      await tx.notification.create({
        data: {
          title: 'Vendor Quotation Accepted',
          message: `Client confirmed ${selected.vendorName} for ${selected.serviceCategory} (Total: ₹${lineTotal.toLocaleString('en-IN')})! Added to My Wedding Bill.`,
          type: 'VENDOR_ACCEPTED',
          targetRole: 'ROLE_PLANNER',
          isRead: false,
        },
      });

      // Step H: Notify Selected Vendor
      await tx.notification.create({
        data: {
          title: 'Your Quotation Was Accepted!',
          message: `Congratulations! Your proposal for ${selected.serviceCategory} has been selected by Aanya & Arjun for their Royal Wedding.`,
          type: 'QUOTATION_ACCEPTED',
          targetRole: 'ROLE_VENDOR',
          isRead: false,
        },
      });

      // Step I: Vendor Event Tracking
      const existingVendorEvent = await tx.vendorEvent.findFirst({
        where: {
          vendorEmail: selected.vendorEmail,
          category: 'ONGOING',
        },
      });

      if (!existingVendorEvent) {
        await tx.vendorEvent.create({
          data: {
            vendorEmail: selected.vendorEmail,
            vendorName: selected.vendorName,
            eventName: 'The Sharma & Mehta Royal Wedding',
            clientName: 'Aanya Sharma & Arjun Mehta',
            eventDate: new Date('2026-11-01T09:00:00Z'),
            venue: 'City Palace, Udaipur, Rajasthan',
            guestCount: selected.guestCount,
            serviceType: selected.serviceCategory,
            requirements: selected.serviceInclusions || 'Royal banquet and wedding execution',
            acceptedQuotationAmount: lineTotal,
            category: 'ONGOING',
            eventStatus: 'In Progress',
            expectedServiceTime: '09:00 AM - 04:00 PM',
            arrivalStatus: 'Arrived',
            serviceProgress: 'Positioned on-site at City Palace; execution active',
            paymentStatus: 'Advance Deposit Paid (50%)',
          },
        });
      }

      return { quote: updatedQuote, lineItem };
    });

    return res.json({
      success: true,
      message: 'Vendor quotation accepted and added to itemized wedding bill',
      data: formatDecimal(result.quote),
      lineItem: formatDecimal(result.lineItem),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to select vendor quotation',
      error: error.message,
    });
  }
});

// POST /api/v1/quotations/:id/unselect
// Client removes a quotation selection before final booking confirmation
router.post('/:id/unselect', async (req, res) => {
  const quoteId = parseInt(req.params.id, 10);

  try {
    const selected = await prisma.vendorQuotation.findUnique({ where: { id: quoteId } });
    if (!selected) {
      return res.status(404).json({ success: false, message: 'Quotation not found' });
    }

    const targetEnquiryId = selected.enquiryId || 1;

    const result = await prisma.$transaction(async (tx) => {
      // Step A: Reset selected quotation status to SUBMITTED
      const resetQuote = await tx.vendorQuotation.update({
        where: { id: quoteId },
        data: {
          status: 'SUBMITTED',
          selectionTimestamp: null,
        },
      });

      // Step B: Reset any other REJECTED quotes in that category and enquiry back to SUBMITTED
      await tx.vendorQuotation.updateMany({
        where: {
          enquiryId: targetEnquiryId,
          serviceCategory: selected.serviceCategory,
          status: 'REJECTED',
        },
        data: {
          status: 'SUBMITTED',
        },
      });

      // Step C: Delete line item from invoice_line_items
      await tx.invoiceLineItem.deleteMany({
        where: {
          enquiryId: targetEnquiryId,
          category: selected.serviceCategory,
        },
      });

      // Step D: Recalculate invoice totals
      const activeInvoice = await tx.invoice.findFirst({ orderBy: { generatedAt: 'desc' } });
      if (activeInvoice) {
        const remainingItems = await tx.invoiceLineItem.findMany({
          where: { enquiryId: targetEnquiryId, status: 'SELECTED' },
        });
        const totalServices = remainingItems.reduce(
          (sum, item) => sum + Number(item.lineTotal),
          0
        );

        const approvedExpenses = await tx.additionalExpense.findMany({
          where: { clientApprovalStatus: 'Approved' },
        });
        const totalApprovedExtras = approvedExpenses.reduce(
          (sum, item) => sum + Number(item.amount),
          0
        );

        const finalClientAmount = totalServices > 0 
          ? totalServices + totalApprovedExtras 
          : 2500000.0 + totalApprovedExtras;
        const amountReceived = Number(activeInvoice.amountReceived);
        const outstandingBalance = Math.max(0, finalClientAmount - amountReceived);

        await tx.invoice.update({
          where: { id: activeInvoice.id },
          data: {
            agreedPackageAmount: totalServices > 0 ? totalServices : 2500000.0,
            finalClientAmount,
            outstandingBalance,
          },
        });
      }

      // Step E: Notify Planner
      await tx.notification.create({
        data: {
          title: 'Quotation Selection Removed',
          message: `Client removed selection for ${selected.serviceCategory} (${selected.vendorName}). Available bids have been reopened.`,
          type: 'SELECTION_REMOVED',
          targetRole: 'ROLE_PLANNER',
          isRead: false,
        },
      });

      return resetQuote;
    });

    return res.json({
      success: true,
      message: 'Quotation selection removed and bill updated',
      data: formatDecimal(result),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove quotation selection',
      error: error.message,
    });
  }
});

export default router;
