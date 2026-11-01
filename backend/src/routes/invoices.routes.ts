import { Router } from 'express';
import { prisma } from '../db.js';
import { formatDecimal } from '../utils/format.js';

const router = Router();

// GET /api/v1/invoices/active & GET /api/v1/invoices
router.get(['/', '/active'], async (req, res) => {
  try {
    let inv = await prisma.invoice.findFirst({
      orderBy: { generatedAt: 'desc' },
    });

    if (!inv) {
      inv = await prisma.invoice.create({
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
          dueDate: new Date('2027-02-28'),
        },
      });
    }

    return res.json({
      success: true,
      message: 'Active invoice retrieved',
      data: formatDecimal(inv),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve invoice',
      error: error.message,
    });
  }
});

// GET /api/v1/invoices/expenses
router.get('/expenses', async (req, res) => {
  try {
    const list = await prisma.additionalExpense.findMany({
      orderBy: { requestedAt: 'desc' },
    });
    return res.json({
      success: true,
      message: 'Additional expenses retrieved',
      data: formatDecimal(list),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses',
      error: error.message,
    });
  }
});

// POST /api/v1/invoices/expenses (Add new expense request with duplicate prevention)
router.post('/expenses', async (req, res) => {
  const { itemDescription, category, amount, reason } = req.body;
  const numAmount = Number(amount) || 0;
  const desc = (itemDescription || 'Additional Service').trim();

  try {
    // Idempotency check: does this expense already exist for enquiryId 1?
    const existing = await prisma.additionalExpense.findFirst({
      where: {
        enquiryId: 1,
        itemDescription: { equals: desc, mode: 'insensitive' },
      },
    });

    if (existing) {
      return res.status(201).json({
        success: true,
        message: 'Additional expense already recorded (idempotent)',
        data: formatDecimal(existing),
      });
    }

    const [expense] = await prisma.$transaction([
      prisma.additionalExpense.create({
        data: {
          enquiryId: 1,
          itemDescription: desc,
          category: category || 'Catering',
          amount: numAmount,
          clientApprovalStatus: 'Pending Approval',
          reason: reason || 'Service scope expansion',
        },
      }),
      prisma.notification.create({
        data: {
          title: 'Additional Expense Submitted',
          message: `Approval requested for "${desc}" (₹${numAmount.toLocaleString('en-IN')}).`,
          type: 'EXPENSE_REQUESTED',
          targetRole: 'ROLE_CLIENT',
          isRead: false,
        },
      }),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Additional expense recorded',
      data: formatDecimal(expense),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record expense',
      error: error.message,
    });
  }
});

// POST /api/v1/invoices/expenses/:id/approve
router.post('/expenses/:id/approve', async (req, res) => {
  const expenseId = parseInt(req.params.id, 10);

  try {
    const expense = await prisma.additionalExpense.findUnique({ where: { id: expenseId } });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense item not found' });
    }

    let inv = await prisma.invoice.findFirst({ orderBy: { generatedAt: 'desc' } });
    if (!inv) {
      inv = await prisma.invoice.create({
        data: {
          invoiceNumber: 'INV-RK-2026-001',
          clientNames: 'Aanya Sharma & Arjun Mehta',
          agreedPackageAmount: 2500000.0,
          approvedAdditionalCosts: 0,
          finalClientAmount: 2500000.0,
          amountReceived: 1500000.0,
          outstandingBalance: 1000000.0,
          vendorPayableAmount: 1450000.0,
          paymentStatus: 'PARTIALLY_PAID',
        },
      });
    }

    // Run in transaction: approve expense and recalculate invoice totals
    const result = await prisma.$transaction(async (tx) => {
      await tx.additionalExpense.update({
        where: { id: expenseId },
        data: {
          clientApprovalStatus: 'Approved',
          resolvedAt: new Date(),
        },
      });

      const approvedExpenses = await tx.additionalExpense.findMany({
        where: { clientApprovalStatus: 'Approved' },
      });
      const totalApprovedExtras = approvedExpenses.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      const agreedPackage = Number(inv.agreedPackageAmount);
      const amountRec = Number(inv.amountReceived);
      const finalAmount = agreedPackage + totalApprovedExtras;
      const outstanding = Math.max(0, finalAmount - amountRec);

      const updatedInvoice = await tx.invoice.update({
        where: { id: inv.id },
        data: {
          approvedAdditionalCosts: totalApprovedExtras,
          finalClientAmount: finalAmount,
          outstandingBalance: outstanding,
        },
      });

      await tx.notification.create({
        data: {
          title: 'Expense Approved by Client',
          message: `Client approved expense "${expense.itemDescription}" for ₹${Number(expense.amount).toLocaleString('en-IN')}.`,
          type: 'EXPENSE_APPROVED',
          targetRole: 'ROLE_PLANNER',
          isRead: false,
        },
      });

      return updatedInvoice;
    });

    return res.json({
      success: true,
      message: 'Expense approved and invoice updated',
      data: formatDecimal(result),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to approve expense',
      error: error.message,
    });
  }
});

// GET /api/v1/invoices/payments
router.get('/payments', async (req, res) => {
  try {
    const list = await prisma.payment.findMany({
      orderBy: { id: 'asc' },
    });
    return res.json({
      success: true,
      message: 'Payment schedule retrieved',
      data: formatDecimal(list),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments',
      error: error.message,
    });
  }
});

// POST /api/v1/invoices/record-payment
router.post('/record-payment', async (req, res) => {
  const { amount, milestoneTitle, reference } = req.body;
  const numAmount = Number(amount) || 0;
  const ref = reference || `TXN-${Date.now()}`;
  const title = (milestoneTitle || 'Milestone Payment').trim();

  try {
    let inv = await prisma.invoice.findFirst({ orderBy: { generatedAt: 'desc' } });
    if (!inv) {
      inv = await prisma.invoice.create({
        data: {
          invoiceNumber: 'INV-RK-2026-001',
          clientNames: 'Aanya Sharma & Arjun Mehta',
          agreedPackageAmount: 2500000.0,
          approvedAdditionalCosts: 120000.0,
          finalClientAmount: 2620000.0,
          amountReceived: 0,
          outstandingBalance: 2620000.0,
          vendorPayableAmount: 1450000.0,
          paymentStatus: 'PENDING',
        },
      });
    }

    // Check if payment with this transaction reference already exists (idempotency)
    if (reference) {
      const existingRef = await prisma.payment.findUnique({
        where: { transactionReference: reference },
      });
      if (existingRef) {
        return res.json({
          success: true,
          message: 'Payment already recorded (idempotent)',
          data: formatDecimal(inv),
        });
      }
    }

    // Check if this milestone is already marked as PAID
    const existingMilestone = await prisma.payment.findFirst({
      where: {
        enquiryId: 1,
        milestoneTitle: title,
      },
    });

    if (existingMilestone && existingMilestone.status === 'PAID') {
      return res.json({
        success: true,
        message: 'Milestone payment already completed (idempotent)',
        data: formatDecimal(inv),
      });
    }

    const updatedInvoice = await prisma.$transaction(async (tx) => {
      if (existingMilestone) {
        await tx.payment.update({
          where: { id: existingMilestone.id },
          data: {
            amountPaid: numAmount > 0 ? numAmount : existingMilestone.amountDue,
            paymentDate: new Date(),
            status: 'PAID',
            transactionReference: ref,
          },
        });
      } else {
        await tx.payment.create({
          data: {
            enquiryId: 1,
            milestoneTitle: title,
            amountDue: numAmount,
            amountPaid: numAmount,
            dueDate: new Date(),
            paymentDate: new Date(),
            status: 'PAID',
            transactionReference: ref,
          },
        });
      }

      // Calculate total paid across all payments
      const allPaid = await tx.payment.findMany({ where: { status: 'PAID' } });
      const totalReceived = allPaid.reduce((sum, p) => sum + Number(p.amountPaid || 0), 0);
      const finalAmount = Number(inv.finalClientAmount);
      const newOutstanding = Math.max(0, finalAmount - totalReceived);
      const newStatus = newOutstanding === 0 ? 'FULLY_PAID' : 'PARTIALLY_PAID';

      const updated = await tx.invoice.update({
        where: { id: inv.id },
        data: {
          amountReceived: totalReceived,
          outstandingBalance: newOutstanding,
          paymentStatus: newStatus,
        },
      });

      await tx.notification.create({
        data: {
          title: 'Payment Received',
          message: `Payment of ₹${numAmount.toLocaleString('en-IN')} received for ${title} (Ref: ${ref}).`,
          type: 'PAYMENT_RECEIVED',
          targetRole: 'ROLE_ADMIN',
          isRead: false,
        },
      });

      return updated;
    });

    return res.json({
      success: true,
      message: 'Payment recorded and invoice balance updated',
      data: formatDecimal(updatedInvoice),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message,
    });
  }
});

// GET /api/v1/invoices/bill
// Dedicated itemized wedding bill with all selected category line items, expenses, and payments
router.get('/bill', async (req, res) => {
  try {
    const enquiryId = 1;
    let inv = await prisma.invoice.findFirst({
      orderBy: { generatedAt: 'desc' },
    });

    if (!inv) {
      inv = await prisma.invoice.create({
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
          dueDate: new Date('2027-02-28'),
        },
      });
    }

    const [lineItems, expenses, payments] = await Promise.all([
      prisma.invoiceLineItem.findMany({
        where: { enquiryId, status: 'SELECTED' },
        orderBy: { id: 'asc' },
      }),
      prisma.additionalExpense.findMany({
        where: { clientApprovalStatus: 'Approved' },
        orderBy: { requestedAt: 'desc' },
      }),
      prisma.payment.findMany({
        orderBy: { id: 'asc' },
      }),
    ]);

    const subtotal = lineItems.reduce((acc, item) => acc + Number(item.baseAmount), 0);
    const totalAdditionalCharges = lineItems.reduce((acc, item) => acc + Number(item.additionalCharges), 0);
    const totalTaxes = lineItems.reduce((acc, item) => acc + Number(item.taxAmount), 0);
    const totalDiscount = lineItems.reduce((acc, item) => acc + Number(item.discountAmount), 0);
    const totalLineItems = lineItems.reduce((acc, item) => acc + Number(item.lineTotal), 0);
    const approvedExpensesTotal = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

    const totalWeddingServiceAmount = totalLineItems > 0
      ? totalLineItems + approvedExpensesTotal
      : Number(inv.agreedPackageAmount) + approvedExpensesTotal;

    const amountAlreadyPaid = payments
      .filter((p) => p.status === 'PAID')
      .reduce((acc, p) => acc + Number(p.amountPaid || 0), 0);

    const outstandingBalance = Math.max(0, totalWeddingServiceAmount - amountAlreadyPaid);

    return res.json({
      success: true,
      message: 'Itemized wedding bill retrieved',
      data: {
        invoice: formatDecimal(inv),
        lineItems: formatDecimal(lineItems),
        additionalExpenses: formatDecimal(expenses),
        payments: formatDecimal(payments),
        summary: {
          subtotal,
          totalAdditionalCharges,
          totalTaxes,
          totalDiscount,
          totalLineItems,
          approvedExpensesTotal,
          totalWeddingServiceAmount,
          amountAlreadyPaid,
          outstandingBalance,
        },
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve itemized bill',
      error: error.message,
    });
  }
});

export default router;
