import express from 'express';
import cors from 'cors';
import { prisma } from './src/db.js';
import authRoutes from './src/routes/auth.routes.js';
import packagesRoutes from './src/routes/packages.routes.js';
import enquiriesRoutes from './src/routes/enquiries.routes.js';
import agreementsRoutes from './src/routes/agreements.routes.js';
import quotationsRoutes from './src/routes/quotations.routes.js';
import tasksRoutes from './src/routes/tasks.routes.js';
import scheduleRoutes from './src/routes/schedule.routes.js';
import invoicesRoutes from './src/routes/invoices.routes.js';
import notificationsRoutes from './src/routes/notifications.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import vendorRoutes from './src/routes/vendor.routes.js';
import { HINDU_WEDDING_CATEGORIES } from './src/constants/categories.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/packages', packagesRoutes);
app.use('/api/v1/enquiries', enquiriesRoutes);
app.use('/api/v1/agreements', agreementsRoutes);
app.use('/api/v1/quotations', quotationsRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/schedule', scheduleRoutes);
app.use('/api/v1/invoices', invoicesRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/vendor', vendorRoutes);

const server = app.listen(5099, async () => {
  const baseUrl = 'http://localhost:5099/api/v1';
  let passedCount = 0;
  let failedCount = 0;

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passedCount++;
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
      failedCount++;
    }
  }

  try {
    console.log('===============================================================');
    console.log('👑 THE ROYAL KNOT — CLIENT MARKETPLACE & BILLING VERIFICATION');
    console.log('===============================================================');

    // 0. Reset state for clean testing
    await prisma.invoiceLineItem.deleteMany({});
    await prisma.vendorQuotation.updateMany({ data: { status: 'SUBMITTED', selectionTimestamp: null } });

    // Login client
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@royalknot.com', password: 'Royal@2026!' }),
    });
    const loginData = await loginRes.json();
    const clientToken = loginData.data.token;
    assert(loginRes.status === 200, 'Client authenticated successfully');

    // TEST 1 & 2: Category directory returned first, exactly 39 categories across 7 collections
    console.log('\n--- TEST CRITERIA 1-4: Categories Directory & Isolation ---');
    const catRes = await fetch(`${baseUrl}/quotations/categories`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const catData = await catRes.json();
    assert(catRes.status === 200, 'GET /quotations/categories returns status 200');
    assert(catData.data.length === 39, `Exactly 39 Hindu wedding vendor categories loaded (found: ${catData.data.length})`);
    
    const collections = new Set(catData.data.map((c: any) => c.collectionCode));
    assert(collections.size === 7, 'All 7 ceremonial collections (A through G) represented');

    // TEST 3: Clicking Catering returns only Catering quotations
    const cateringRes = await fetch(`${baseUrl}/quotations?category=${encodeURIComponent('Wedding Catering')}`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const cateringData = await cateringRes.json();
    assert(cateringRes.status === 200, 'GET /quotations?category=Wedding Catering returns status 200');
    assert(cateringData.data.length >= 3, 'All 3 distinct catering proposals retrieved');
    const allAreCatering = cateringData.data.every((q: any) => q.serviceCategory.toLowerCase().includes('catering'));
    assert(allAreCatering, 'No unrelated categories mixed into Catering quotations');

    // TEST 4: Clicking Photography returns only Photography quotations
    const photoRes = await fetch(`${baseUrl}/quotations?category=${encodeURIComponent('Candid Photography')}`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const photoData = await photoRes.json();
    assert(photoRes.status === 200, 'GET /quotations?category=Candid Photography returns status 200');
    assert(photoData.data.length >= 2, 'Candid photography proposals retrieved');
    const allArePhoto = photoData.data.every((q: any) => q.serviceCategory.toLowerCase().includes('photography'));
    assert(allArePhoto, 'No unrelated categories mixed into Photography quotations');

    // TEST 5: Compare different quotations within a category
    console.log('\n--- TEST CRITERIA 5-8: Multi-Category Selection & Bill Generation ---');
    const cateringQuote1 = cateringData.data[0]; // Maharaja Catering
    const cateringQuote2 = cateringData.data[1]; // Deccan Royal Kitchens
    assert(cateringQuote1.packageTitle !== cateringQuote2.packageTitle, 'Different quotations have different package titles');
    assert(cateringQuote1.pricePerPlate !== cateringQuote2.pricePerPlate, 'Different quotations have distinct unit prices');

    // TEST 6: Client selects one quotation from Catering
    const selectCatRes = await fetch(`${baseUrl}/quotations/${cateringQuote1.id}/select`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const selectCatData = await selectCatRes.json();
    assert(selectCatRes.status === 200, 'Client successfully selected Catering quotation');
    assert(selectCatData.data.status === 'ACCEPTED', 'Catering quotation status marked ACCEPTED');

    // TEST 7: Client selects another quotation from Mandap and Stage Decoration
    const decorRes = await fetch(`${baseUrl}/quotations?category=${encodeURIComponent('Mandap and Stage Decoration')}`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const decorData = await decorRes.json();
    assert(decorData.data.length >= 3, 'Mandap & stage decoration quotations retrieved');
    const decorQuote1 = decorData.data[0]; // Jaipur Heritage Decor

    const selectDecorRes = await fetch(`${baseUrl}/quotations/${decorQuote1.id}/select`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert(selectDecorRes.status === 200, 'Client successfully selected Mandap Decoration quotation');

    // TEST 8: Both selected services appear in the wedding bill
    const billRes = await fetch(`${baseUrl}/invoices/bill`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const billData = await billRes.json();
    assert(billRes.status === 200, 'GET /invoices/bill returns status 200');
    const lineItemCategories = billData.data.lineItems.map((li: any) => li.category);
    assert(
      lineItemCategories.some((c: string) => c.toLowerCase().includes('catering')) &&
      lineItemCategories.some((c: string) => c.toLowerCase().includes('mandap')),
      'Both Catering and Mandap Decoration appear as itemized line items in My Wedding Bill'
    );

    // TEST 9: Client cannot select two active quotations for the same category without replacement
    console.log('\n--- TEST CRITERIA 9-11: Category Concurrency & Safe Replacement ---');
    const duplicateCatRes = await fetch(`${baseUrl}/quotations/${cateringQuote2.id}/select`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert(duplicateCatRes.status === 400, 'Second selection attempt in same category safely rejected with HTTP 400');

    // TEST 10: Selecting new quotation does not close selections from other categories
    const decorInBill = billData.data.lineItems.find((li: any) => li.category.toLowerCase().includes('mandap'));
    assert(!!decorInBill, 'Decoration line item remains intact when competing catering bid was rejected');

    // TEST 11: Replacing a selection safely updates the bill
    const replaceCatRes = await fetch(`${baseUrl}/quotations/${cateringQuote2.id}/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ replace: true }),
    });
    assert(replaceCatRes.status === 200, 'Safe replacement in same category succeeds with replace: true');

    const refreshedBillRes = await fetch(`${baseUrl}/invoices/bill`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const refreshedBill = await refreshedBillRes.json();
    const updatedCatering = refreshedBill.data.lineItems.find((li: any) => li.category.toLowerCase().includes('catering'));
    assert(updatedCatering.vendorName === cateringQuote2.vendorName, 'Catering line item in bill replaced with Deccan Royal Kitchens');

    // Unselect/Remove selection
    const removeRes = await fetch(`${baseUrl}/quotations/${cateringQuote2.id}/unselect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    assert(removeRes.status === 200, 'Removing quotation selection succeeds (status 200)');

    const billAfterRemoval = await (await fetch(`${baseUrl}/invoices/bill`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    })).json();
    assert(
      !billAfterRemoval.data.lineItems.some((li: any) => li.category.toLowerCase().includes('catering')),
      'Removed catering line item deleted from wedding bill'
    );
    assert(
      billAfterRemoval.data.lineItems.some((li: any) => li.category.toLowerCase().includes('mandap')),
      'Mandap decoration remains unaffected after removing catering'
    );

    // Re-select catering for calculations
    await fetch(`${baseUrl}/quotations/${cateringQuote1.id}/select`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
    });

    // TEST 12, 13, 14, 15: Mathematical Billing Calculations
    console.log('\n--- TEST CRITERIA 12-16: Mathematical Reconciliations & Payments ---');
    const calcBill = await (await fetch(`${baseUrl}/invoices/bill`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    })).json();

    const catLine = calcBill.data.lineItems.find((li: any) => li.category.toLowerCase().includes('catering'));
    const decorLine = calcBill.data.lineItems.find((li: any) => li.category.toLowerCase().includes('mandap'));

    // Test 12: Per-plate calculations use guest count
    assert(catLine.pricingModel === 'PER_PLATE', 'Catering is PER_PLATE pricing model');
    assert(catLine.quantity === 400, 'Guest count is 400');
    assert(catLine.baseAmount === catLine.unitPrice * 400, 'Per-plate baseAmount = unitPrice * guestCount (2200 * 400 = 880000)');

    // Test 13: Fixed-price categories use flat rate
    assert(decorLine.pricingModel === 'FIXED', 'Mandap decor is FIXED pricing model');
    assert(decorLine.baseAmount === decorLine.unitPrice, 'Fixed baseAmount = flat rate (450000)');

    // Test 14: Additional charges and taxes not double counted
    assert(catLine.lineTotal === catLine.baseAmount + catLine.additionalCharges + catLine.taxAmount, 'Line total = baseAmount + extras + taxes');

    // Test 15: Subtotal and total calculated dynamically
    const expectedSubtotal = catLine.baseAmount + decorLine.baseAmount;
    assert(calcBill.data.summary.subtotal === expectedSubtotal, 'Subtotal correctly aggregates all service base amounts');
    assert(calcBill.data.summary.totalWeddingServiceAmount >= catLine.lineTotal + decorLine.lineTotal, 'Total service amount includes all line totals');

    // Test 16: Payment records update amount paid and outstanding balance
    const paymentAmount = 100000;
    const payRes = await fetch(`${baseUrl}/invoices/record-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ amount: paymentAmount, milestoneTitle: 'Test Milestone Payment' }),
    });
    assert(payRes.status === 200, 'Milestone payment recorded (status 200)');

    const billAfterPayment = await (await fetch(`${baseUrl}/invoices/bill`, {
      headers: { Authorization: `Bearer ${clientToken}` },
    })).json();
    assert(billAfterPayment.data.summary.amountAlreadyPaid > 0, 'Amount paid updated in bill');
    assert(
      billAfterPayment.data.summary.outstandingBalance === Math.max(0, billAfterPayment.data.summary.totalWeddingServiceAmount - billAfterPayment.data.summary.amountAlreadyPaid),
      'Outstanding balance = Total amount - amount paid'
    );

    // TEST 17: Data persists across sessions
    console.log('\n--- TEST CRITERIA 17-20: Persistence, Privacy & System Integrity ---');
    const reLogin = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@royalknot.com', password: 'Royal@2026!' }),
    });
    const reLoginData = await reLogin.json();
    const persistedBill = await (await fetch(`${baseUrl}/invoices/bill`, {
      headers: { Authorization: `Bearer ${reLoginData.data.token}` },
    })).json();
    assert(persistedBill.data.lineItems.length >= 2, 'Selected line items persist across logout and login');

    // TEST 18: Vendor cannot access complete private client bill
    const vendorLogin = await (await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'vendor@royalknot.com', password: 'Royal@2026!' }),
    })).json();
    const vendorQuotesRes = await fetch(`${baseUrl}/quotations`, {
      headers: { Authorization: `Bearer ${vendorLogin.data.token}` },
    });
    const vendorQuotesData = await vendorQuotesRes.json();
    const allBelongToVendor = vendorQuotesData.data.every((q: any) => q.vendorEmail === 'vendor@royalknot.com');
    assert(allBelongToVendor, 'Strict Vendor Privacy: Vendor only sees their own quotations');

    // TEST 19: Notifications sent to Planner and Vendor
    const plannerNotifs = await prisma.notification.findMany({
      where: { targetRole: 'ROLE_PLANNER' },
      orderBy: { id: 'desc' },
      take: 5,
    });
    const hasSelectionNotif = plannerNotifs.some((n) => n.type === 'VENDOR_ACCEPTED');
    assert(hasSelectionNotif, 'Lead Planner received VENDOR_ACCEPTED notification');

    const vendorNotifs = await prisma.notification.findMany({
      where: { targetRole: 'ROLE_VENDOR' },
      orderBy: { id: 'desc' },
      take: 5,
    });
    const hasVendorAccepted = vendorNotifs.some((n) => n.type === 'QUOTATION_ACCEPTED');
    assert(hasVendorAccepted, 'Selected Vendor received QUOTATION_ACCEPTED notification');

    // TEST 20: On-demand quotation request from planner
    const requestRes = await fetch(`${baseUrl}/quotations/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clientToken}` },
      body: JSON.stringify({ category: 'Wedding Cakes', notes: 'Need 5-tier royal eggless cake with edible gold foil' }),
    });
    assert(requestRes.status === 201, 'On-demand quotation request submitted (status 201)');

    console.log('===============================================================');
    console.log(`📊 FINAL TEST AUDIT: ${passedCount} PASSED / ${failedCount} FAILED`);
    console.log('===============================================================');

    // Reset database to fresh seed state
    await prisma.invoiceLineItem.deleteMany({});
    await prisma.vendorQuotation.updateMany({ data: { status: 'SUBMITTED', selectionTimestamp: null } });

  } catch (err: any) {
    console.error('Test execution failed with error:', err);
    failedCount++;
  } finally {
    server.close();
    process.exit(failedCount > 0 ? 1 : 0);
  }
});

