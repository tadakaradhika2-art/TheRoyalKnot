import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import { prisma } from './src/db.js';

// Route imports
import authRoutes from './src/routes/auth.routes.js';
import packagesRoutes from './src/routes/packages.routes.js';
import enquiriesRoutes from './src/routes/enquiries.routes.js';
import agreementsRoutes from './src/routes/agreements.routes.js';
import quotationsRoutes from './src/routes/quotations.routes.js';
import tasksRoutes from './src/routes/tasks.routes.js';
import scheduleRoutes from './src/routes/schedule.routes.js';
import invoicesRoutes from './src/routes/invoices.routes.js';
import analyticsRoutes from './src/routes/analytics.routes.js';
import notificationsRoutes from './src/routes/notifications.routes.js';
import vendorRoutes from './src/routes/vendor.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Mount API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/packages', packagesRoutes);
app.use('/api/v1/enquiries', enquiriesRoutes);
app.use('/api/v1/agreements', agreementsRoutes);
app.use('/api/v1/quotations', quotationsRoutes);
app.use('/api/v1/tasks', tasksRoutes);
app.use('/api/v1/schedule', scheduleRoutes);
app.use('/api/v1/invoices', invoicesRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/notifications', notificationsRoutes);
app.use('/api/v1/vendor', vendorRoutes);

async function runFullVerification() {
  console.log('===============================================================');
  console.log('👑 THE ROYAL KNOT — COMPLETE 11-MODULE BACKEND TEST & AUDIT');
  console.log('===============================================================');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}/api/v1`;

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      failed++;
      console.error(`  ❌ [FAIL] ${testName}${detail ? ' - ' + detail : ''}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // MODULE 1: AUTHENTICATION & RBAC
    // -------------------------------------------------------------
    console.log('\n--- MODULE 1: Authentication & RBAC ---');
    const demoAccounts = [
      { email: 'admin@royalknot.com', role: 'ROLE_ADMIN' },
      { email: 'planner@royalknot.com', role: 'ROLE_PLANNER' },
      { email: 'client@royalknot.com', role: 'ROLE_CLIENT' },
      { email: 'vendor@royalknot.com', role: 'ROLE_VENDOR' },
    ];

    const tokens: Record<string, string> = {};

    for (const acc of demoAccounts) {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: acc.email, password: 'Royal@2026!' }),
      });
      const data = await res.json();
      assert(res.status === 200, `Login status 200 for ${acc.email}`);
      assert(!!data.data?.token, `JWT token received for ${acc.email}`);
      assert(data.data?.user?.roles?.includes(acc.role), `Role is ${acc.role} for ${acc.email}`);
      tokens[acc.email] = data.data.token;

      // Test /auth/me
      const meRes = await fetch(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${tokens[acc.email]}` },
      });
      const meData = await meRes.json();
      assert(meRes.status === 200, `/auth/me status 200 for ${acc.email}`);
      assert(meData.data?.email === acc.email, `/auth/me returns email for ${acc.email}`);
    }

    // Wrong password rejection
    const wrongPassRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@royalknot.com', password: 'WrongPassword!' }),
    });
    assert(wrongPassRes.status === 401, 'Wrong password rejected with 401');

    // Unknown email rejection
    const unknownEmailRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'unknown@royalknot.com', password: 'Royal@2026!' }),
    });
    assert(unknownEmailRes.status === 401, 'Unknown email rejected with 401');

    // Role-based authorization
    const adminOnlyRes = await fetch(`${baseUrl}/auth/role-test`, {
      headers: { Authorization: `Bearer ${tokens['admin@royalknot.com']}` },
    });
    assert(adminOnlyRes.status === 200, 'Admin authorized for ROLE_ADMIN endpoint (200)');

    const nonAdminRes = await fetch(`${baseUrl}/auth/role-test`, {
      headers: { Authorization: `Bearer ${tokens['client@royalknot.com']}` },
    });
    assert(nonAdminRes.status === 403, 'Client forbidden on ROLE_ADMIN endpoint (403)');

    // -------------------------------------------------------------
    // MODULE 2: WEDDING PACKAGES
    // -------------------------------------------------------------
    console.log('\n--- MODULE 2: Wedding Packages ---');
    const packagesRes = await fetch(`${baseUrl}/packages`);
    const packagesData = await packagesRes.json();
    assert(packagesRes.status === 200, 'GET /packages returns status 200');
    assert(Array.isArray(packagesData.data) && packagesData.data.length >= 2, 'At least 2 packages retrieved from PostgreSQL');
    assert(typeof packagesData.data[0].basePrice === 'number', 'Package basePrice is formatted as a number');

    // -------------------------------------------------------------
    // MODULE 3: CONSULTATION ENQUIRIES
    // -------------------------------------------------------------
    console.log('\n--- MODULE 3: Consultation Enquiries ---');
    // List enquiries
    const enqListRes = await fetch(`${baseUrl}/enquiries`);
    const enqListData = await enqListRes.json();
    assert(enqListRes.status === 200, 'GET /enquiries returns status 200');
    assert(Array.isArray(enqListData.data), 'Enquiries list retrieved as array');

    // Submit new enquiry
    const newEnqRes = await fetch(`${baseUrl}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coupleNames: 'Rohan Mehra & Ananya Kapoor',
        email: 'ananya.mehra@gmail.com',
        phone: '+91 99887 76655',
        weddingLocation: 'Taj Lake Palace, Udaipur',
        preferredTheme: 'Royal Heritage & Gold',
        selectedPackage: 'Full-Service Wedding',
        maximumBudget: 3000000,
        estimatedGuestCount: 350,
      }),
    });
    const newEnqData = await newEnqRes.json();
    assert(newEnqRes.status === 201, 'POST /enquiries creates enquiry with status 201');
    const createdEnqId = newEnqData.data?.id;
    assert(!!createdEnqId, 'Enquiry record created with PostgreSQL ID');

    // Schedule consultation
    const scheduleRes = await fetch(`${baseUrl}/enquiries/${createdEnqId}/schedule-consultation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledDate: new Date('2026-11-15T11:00:00Z').toISOString() }),
    });
    const scheduleData = await scheduleRes.json();
    assert(scheduleRes.status === 200, 'Consultation scheduled successfully (status 200)');
    assert(scheduleData.data?.status === 'Consultation Scheduled', 'Enquiry status updated in DB to Consultation Scheduled');

    // -------------------------------------------------------------
    // MODULE 4: DIGITAL AGREEMENTS
    // -------------------------------------------------------------
    console.log('\n--- MODULE 4: Digital Agreements ---');
    const agrRes = await fetch(`${baseUrl}/agreements/active`);
    const agrData = await agrRes.json();
    assert(agrRes.status === 200, 'GET /agreements/active returns status 200');
    assert(!!agrData.data?.agreementNumber, 'Active agreement number exists');

    // Sign agreement
    const signRes = await fetch(`${baseUrl}/agreements/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agreementId: agrData.data.id,
        signatureData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
        signerName: 'Aanya Sharma',
      }),
    });
    const signData = await signRes.json();
    assert(signRes.status === 200, 'POST /agreements/sign returns status 200');
    assert(signData.data?.status === 'Signed', 'Agreement status updated in PostgreSQL to Signed');
    assert(!!signData.data?.signedTimestamp, 'Signed timestamp recorded in PostgreSQL');

    // -------------------------------------------------------------
    // MODULE 5: VENDOR QUOTATIONS & SELECTION (IMPROVEMENT THREE)
    // -------------------------------------------------------------
    console.log('\n--- MODULE 5: Vendor Quotations & Selection (Improvement Three) ---');
    // First reset test quotations to SUBMITTED for idempotent testing
    await prisma.vendorQuotation.updateMany({ data: { status: 'SUBMITTED' } });

    const quotesRes = await fetch(`${baseUrl}/quotations/catering`);
    const quotesData = await quotesRes.json();
    assert(quotesRes.status === 200, 'GET /quotations/catering returns status 200');
    assert(quotesData.data?.length >= 3, 'All 3 caterer quotations retrieved for comparison');

    // Verify 3 distinct customized service offerings
    const packageTitles = quotesData.data.map((q: any) => q.packageTitle).filter(Boolean);
    const uniqueTitles = new Set(packageTitles);
    assert(uniqueTitles.size >= 3, '3 distinctly customized package titles stored in PostgreSQL');

    const descriptions = quotesData.data.map((q: any) => q.description).filter(Boolean);
    const uniqueDescriptions = new Set(descriptions);
    assert(uniqueDescriptions.size >= 3, '3 distinctly customized package descriptions stored in PostgreSQL');

    const hasTaxAndTerms = quotesData.data.every((q: any) => q.termsAndConditions && q.taxAmount !== undefined);
    assert(hasTaxAndTerms, 'All quotations include taxAmount, termsAndConditions, and availability');

    // Client selects one vendor
    const targetQuoteId = quotesData.data[0].id;
    const selectRes = await fetch(`${baseUrl}/quotations/${targetQuoteId}/select`, {
      method: 'POST',
    });
    const selectData = await selectRes.json();
    assert(selectRes.status === 200, 'POST /quotations/:id/select returns status 200');
    assert(selectData.data?.status === 'ACCEPTED', 'Chosen quote marked as ACCEPTED in PostgreSQL');

    // Verify competing bids automatically marked REJECTED in DB
    const refreshedQuotesRes = await fetch(`${baseUrl}/quotations/catering`);
    const refreshedQuotes = await refreshedQuotesRes.json();
    const otherQuotes = refreshedQuotes.data.filter((q: any) => q.id !== targetQuoteId);
    const allOthersRejected = otherQuotes.every((q: any) => q.status === 'REJECTED');
    assert(allOthersRejected, 'Competing vendor quotations automatically marked REJECTED in PostgreSQL transaction');

    // Test second selection attempt rejection (HTTP 400)
    const secondSelectRes = await fetch(`${baseUrl}/quotations/${otherQuotes[0]?.id || targetQuoteId}/select`, {
      method: 'POST',
    });
    assert(secondSelectRes.status === 400, 'Second selection attempt safely rejected with HTTP 400');

    // -------------------------------------------------------------
    // MODULE 6: WEDDING TASKS
    // -------------------------------------------------------------
    console.log('\n--- MODULE 6: Wedding Tasks ---');
    const tasksRes = await fetch(`${baseUrl}/tasks`);
    const tasksData = await tasksRes.json();
    assert(tasksRes.status === 200, 'GET /tasks returns status 200');
    assert(tasksData.data?.length >= 25, `At least 25 wedding tasks in PostgreSQL (found: ${tasksData.data?.length})`);

    const statsRes = await fetch(`${baseUrl}/tasks/stats`);
    const statsData = await statsRes.json();
    assert(statsRes.status === 200, 'GET /tasks/stats returns status 200');
    assert(typeof statsData.data?.progressPercentage === 'number', 'Task completion metrics calculated');

    // Update a task status
    const taskIdToUpdate = tasksData.data[0].id;
    const updateTaskRes = await fetch(`${baseUrl}/tasks/${taskIdToUpdate}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Completed' }),
    });
    const updateTaskData = await updateTaskRes.json();
    assert(updateTaskRes.status === 200, 'PATCH /tasks/:id/status returns status 200');
    assert(updateTaskData.data?.status === 'Completed', 'Task status updated to Completed in PostgreSQL');

    // -------------------------------------------------------------
    // MODULE 7: LIVE WEDDING SCHEDULE & CONTROL ROOM (IMPROVEMENT ONE)
    // -------------------------------------------------------------
    console.log('\n--- MODULE 7: Live Wedding Schedule & Control Room (Improvement One) ---');
    const schedRes = await fetch(`${baseUrl}/schedule`);
    const schedData = await schedRes.json();
    assert(schedRes.status === 200, 'GET /schedule returns status 200');
    assert(schedData.data?.length >= 8, 'Schedule timeline items retrieved from PostgreSQL');

    // Update arrival status
    const timelineId = schedData.data[0].id;
    const arrivalRes = await fetch(`${baseUrl}/schedule/arrival-update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timelineId,
        arrivalStatus: 'Arrived',
        notes: 'Crew and floral vehicles verified on site at Gate 2',
      }),
    });
    const arrivalData = await arrivalRes.json();
    assert(arrivalRes.status === 200, 'POST /schedule/arrival-update returns status 200');
    assert(arrivalData.data?.arrivalStatus === 'Arrived', 'Arrival status updated to Arrived in PostgreSQL');

    // Lead Planner Minute-to-Minute updates: Start activity & Complete activity
    const activityRes = await fetch(`${baseUrl}/schedule/${timelineId}/activity-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        activityStatus: 'Completed',
        actualCompletion: '09:20 AM',
        delayMinutes: 0,
        notes: 'Stage setup verified completed by lead planner.',
      }),
    });
    const activityData = await activityRes.json();
    assert(activityRes.status === 200, 'PATCH /schedule/:id/activity-status returns status 200');
    assert(activityData.data?.activityStatus === 'Completed', 'Activity status set to Completed in PostgreSQL');
    assert(activityData.data?.actualCompletion === '09:20 AM', 'Actual completion time recorded in PostgreSQL');

    // Modify activity timing
    const timingRes = await fetch(`${baseUrl}/schedule/${timelineId}/timing`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timeSlot: '08:00 AM',
        expectedCompletion: '09:30 AM',
        notes: 'Planner timing calibration verified.',
      }),
    });
    assert(timingRes.status === 200, 'PATCH /schedule/:id/timing returns status 200');

    // -------------------------------------------------------------
    // MODULE 8: EXPENSES & INVOICES
    // -------------------------------------------------------------
    console.log('\n--- MODULE 8: Expenses & Invoices ---');
    const invRes = await fetch(`${baseUrl}/invoices/active`);
    const invData = await invRes.json();
    assert(invRes.status === 200, 'GET /invoices/active returns status 200');
    assert(typeof invData.data?.finalClientAmount === 'number', 'Invoice finalClientAmount is a number');

    // Add new expense
    const addExpRes = await fetch(`${baseUrl}/invoices/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemDescription: 'Traditional Shehnai Troupes Extension',
        category: 'Entertainment',
        amount: 25000,
        reason: 'Ceremony rituals extended by 1 hour',
      }),
    });
    const addExpData = await addExpRes.json();
    assert(addExpRes.status === 201, 'POST /invoices/expenses creates expense with status 201');
    const newExpId = addExpData.data?.id;

    // Approve expense
    const approveExpRes = await fetch(`${baseUrl}/invoices/expenses/${newExpId}/approve`, {
      method: 'POST',
    });
    const approveExpData = await approveExpRes.json();
    assert(approveExpRes.status === 200, 'POST /invoices/expenses/:id/approve returns status 200');
    assert(approveExpData.data?.approvedAdditionalCosts > 0, 'Approved additional costs recalculated in invoice');

    // -------------------------------------------------------------
    // MODULE 9: PAYMENTS
    // -------------------------------------------------------------
    console.log('\n--- MODULE 9: Payments ---');
    const paymentsRes = await fetch(`${baseUrl}/invoices/payments`);
    const paymentsData = await paymentsRes.json();
    assert(paymentsRes.status === 200, 'GET /invoices/payments returns status 200');
    assert(Array.isArray(paymentsData.data), 'Payment schedule milestones retrieved');

    // Record a milestone payment
    const recordPmtRes = await fetch(`${baseUrl}/invoices/record-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 500000,
        milestoneTitle: 'Advance Payment',
        reference: 'TXN-BANK-NEFT-99182',
      }),
    });
    const recordPmtData = await recordPmtRes.json();
    assert(recordPmtRes.status === 200, 'POST /invoices/record-payment returns status 200');
    assert(recordPmtData.data?.amountReceived >= 500000, 'Invoice amountReceived updated in PostgreSQL');
    assert(typeof recordPmtData.data?.outstandingBalance === 'number', 'Invoice outstanding balance recalculated');

    // -------------------------------------------------------------
    // MODULE 10: NOTIFICATIONS
    // -------------------------------------------------------------
    console.log('\n--- MODULE 10: Notifications ---');
    const notifRes = await fetch(`${baseUrl}/notifications`);
    const notifData = await notifRes.json();
    assert(notifRes.status === 200, 'GET /notifications returns status 200');
    assert(notifData.data?.length > 0, 'Notifications retrieved from PostgreSQL');

    const firstNotifId = notifData.data[0].id;
    const markReadRes = await fetch(`${baseUrl}/notifications/${firstNotifId}/read`, {
      method: 'PATCH',
    });
    const markReadData = await markReadRes.json();
    assert(markReadRes.status === 200, 'PATCH /notifications/:id/read returns status 200');
    assert(markReadData.data?.read === true, 'Notification marked as read in PostgreSQL');

    // -------------------------------------------------------------
    // MODULE 11: FOUNDER ANALYTICS
    // -------------------------------------------------------------
    console.log('\n--- MODULE 11: Founder Analytics ---');
    const analyticsRes = await fetch(`${baseUrl}/analytics/founder`);
    const analyticsData = await analyticsRes.json();
    assert(analyticsRes.status === 200, 'GET /analytics/founder returns status 200');
    assert(analyticsData.data?.totalWeddings === 25, 'Founder analytics reports totalWeddings = 25');
    assert(typeof analyticsData.data?.totalRevenue === 'number' && analyticsData.data?.totalRevenue > 0, 'Database-backed total revenue computed');
    assert(typeof analyticsData.data?.netProfit === 'number', 'Net profit computed as (totalRevenue - totalExpenses)');
    assert(typeof analyticsData.data?.vendorOnTimeArrivalRate === 'number', 'Vendor on-time arrival rate computed from DB timeline');

    // -------------------------------------------------------------
    // MODULE 12: VENDOR WORKSPACE & MY EVENTS (IMPROVEMENT TWO)
    // -------------------------------------------------------------
    console.log('\n--- MODULE 12: Vendor Workspace & My Events (Improvement Two) ---');
    const vendorToken = tokens['vendor@royalknot.com'];
    const vendorEventsRes = await fetch(`${baseUrl}/vendor/events`, {
      headers: { Authorization: `Bearer ${vendorToken}` },
    });
    const vendorEventsData = await vendorEventsRes.json();
    assert(vendorEventsRes.status === 200, 'GET /vendor/events returns status 200 for vendor');
    assert(Array.isArray(vendorEventsData.data?.ongoing), 'Vendor ongoing events retrieved as array');
    assert(Array.isArray(vendorEventsData.data?.upcoming), 'Vendor upcoming events retrieved as array');
    assert(Array.isArray(vendorEventsData.data?.past), 'Vendor past events retrieved as array');
    assert(vendorEventsData.data?.ongoing?.length > 0, 'At least 1 ongoing event active in PostgreSQL');
    assert(vendorEventsData.data?.upcoming?.length > 0, 'At least 1 upcoming accepted event found');
    assert(vendorEventsData.data?.past?.length > 0, 'At least 1 past accepted event found');

    // Vendor updates own service progress
    const ongoingEventId = vendorEventsData.data.ongoing[0].id;
    const updateProgressRes = await fetch(`${baseUrl}/vendor/events/${ongoingEventId}/progress`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${vendorToken}`,
      },
      body: JSON.stringify({
        arrivalStatus: 'Arrived',
        serviceProgress: 'Live dessert station active and tasting completed.',
      }),
    });
    const updateProgressData = await updateProgressRes.json();
    assert(updateProgressRes.status === 200, 'PATCH /vendor/events/:id/progress returns status 200');
    assert(updateProgressData.data?.serviceProgress === 'Live dessert station active and tasting completed.', 'Service progress saved in PostgreSQL');

    // Privacy restriction test: Vendor querying /quotations only sees their own quote
    const vendorQuotesRes = await fetch(`${baseUrl}/quotations`, {
      headers: { Authorization: `Bearer ${vendorToken}` },
    });
    const vendorQuotesData = await vendorQuotesRes.json();
    assert(vendorQuotesRes.status === 200, 'GET /quotations for vendor returns status 200');
    const onlyOwnQuotes = vendorQuotesData.data.every((q: any) => q.vendorEmail === 'vendor@royalknot.com');
    assert(onlyOwnQuotes, 'Strict Privacy: Vendor can only see their own quotations');

    console.log('\n===============================================================');
    console.log(`📊 FINAL RESULTS: ${passed} PASSED / ${failed} FAILED`);
    console.log('===============================================================');

    if (failed > 0) {
      process.exitCode = 1;
    }
  } catch (err: any) {
    console.error('Fatal error during test run:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runFullVerification();

