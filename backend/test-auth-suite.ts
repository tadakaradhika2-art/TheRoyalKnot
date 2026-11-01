import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import { prisma } from './src/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

async function runTestSuite() {
  console.log('====================================================');
  console.log('🧪 THE ROYAL KNOT — AUTHENTICATION TEST SUITE');
  console.log('====================================================');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as any;
  const baseUrl = `http://127.0.0.1:${address.port}/api/v1/auth`;

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ' - ' + detail : ''}`);
    }
  }

  try {
    // 1. Verify Seeded Demo Accounts in DB
    console.log('\n--- 1. Demo Accounts Verification ---');
    const demoAccounts = [
      { email: 'admin@royalknot.com', role: 'ROLE_ADMIN' },
      { email: 'planner@royalknot.com', role: 'ROLE_PLANNER' },
      { email: 'client@royalknot.com', role: 'ROLE_CLIENT' },
      { email: 'vendor@royalknot.com', role: 'ROLE_VENDOR' },
    ];

    const tokens: Record<string, string> = {};

    for (const demo of demoAccounts) {
      const dbUser = await prisma.user.findUnique({ where: { email: demo.email } });
      assert(!!dbUser, `Database record exists for ${demo.email}`);
      assert(dbUser?.role === demo.role, `Database role is ${demo.role} for ${demo.email}`);
      assert(dbUser?.active === true, `Database active flag is true for ${demo.email}`);

      // Verify bcrypt hash matches Royal@2026!
      const isPasswordValid = await bcrypt.compare('Royal@2026!', dbUser?.password || '');
      assert(isPasswordValid, `Password hash is valid bcrypt for ${demo.email}`);
    }

    // 2. Successful Login Tests for All 4 Demo Accounts
    console.log('\n--- 2. Successful Login for All 4 Demo Accounts ---');
    for (const demo of demoAccounts) {
      const res = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demo.email, password: 'Royal@2026!' }),
      });

      const body = await res.json();
      assert(res.status === 200, `Login status 200 for ${demo.email}`);
      assert(body.success === true, `Login success flag true for ${demo.email}`);
      assert(typeof body.data?.token === 'string' && body.data.token.length > 20, `Valid JWT token issued for ${demo.email}`);
      assert(body.data?.user?.email === demo.email, `User email matches in login response for ${demo.email}`);
      assert(body.data?.user?.roles?.includes(demo.role), `User role is ${demo.role} in login response for ${demo.email}`);

      tokens[demo.email] = body.data.token;
    }

    // 3. /auth/me JWT Validation
    console.log('\n--- 3. Protected /auth/me Profile Retrieval ---');
    for (const demo of demoAccounts) {
      const token = tokens[demo.email];
      const res = await fetch(`${baseUrl}/me`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const body = await res.json();
      assert(res.status === 200, `/auth/me status 200 for ${demo.email}`);
      assert(body.data?.email === demo.email, `/auth/me returns actual user email for ${demo.email}`);
      assert(body.data?.roles?.includes(demo.role), `/auth/me returns actual role ${demo.role} for ${demo.email}`);
    }

    // 4. Incorrect Password Rejection
    console.log('\n--- 4. Incorrect Password Rejection (HTTP 401) ---');
    const wrongPassRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@royalknot.com', password: 'WrongPassword999!' }),
    });
    const wrongPassBody = await wrongPassRes.json();
    assert(wrongPassRes.status === 401, 'Incorrect password rejected with HTTP 401');
    assert(wrongPassBody.success === false, 'Incorrect password returns success: false');
    assert(!wrongPassBody.data?.token, 'No token issued for incorrect password');

    // 5. Unknown Email Rejection
    console.log('\n--- 5. Unknown Email Rejection (HTTP 401) ---');
    const unknownEmailRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'intruder@nonexistent.com', password: 'Royal@2026!' }),
    });
    const unknownEmailBody = await unknownEmailRes.json();
    assert(unknownEmailRes.status === 401, 'Unknown email rejected with HTTP 401');
    assert(unknownEmailBody.success === false, 'Unknown email returns success: false');
    assert(!unknownEmailBody.data?.token, 'No token issued for unknown email');

    // 6. Inactive Account Rejection
    console.log('\n--- 6. Inactive Account Rejection (HTTP 401) ---');
    const inactiveEmail = 'inactive.tester@royalknot.com';
    const hashedPass = await bcrypt.hash('Royal@2026!', 10);
    await prisma.user.upsert({
      where: { email: inactiveEmail },
      update: { active: false },
      create: {
        email: inactiveEmail,
        password: hashedPass,
        firstName: 'Inactive',
        lastName: 'Tester',
        role: 'ROLE_CLIENT',
        active: false,
      },
    });

    const inactiveRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inactiveEmail, password: 'Royal@2026!' }),
    });
    const inactiveBody = await inactiveRes.json();
    assert(inactiveRes.status === 401, 'Inactive account rejected with HTTP 401');
    assert(inactiveBody.success === false, 'Inactive account returns success: false');
    assert(!inactiveBody.data?.token, 'No token issued for inactive account');

    // Clean up inactive test user
    await prisma.user.delete({ where: { email: inactiveEmail } });

    // 7. Missing JWT Rejection
    console.log('\n--- 7. Missing JWT Rejection (HTTP 401) ---');
    const missingTokenRes = await fetch(`${baseUrl}/me`, {
      method: 'GET',
    });
    const missingTokenBody = await missingTokenRes.json();
    assert(missingTokenRes.status === 401, 'Missing JWT rejected with HTTP 401');
    assert(missingTokenBody.success === false, 'Missing JWT returns success: false');

    // 8. Invalid JWT Rejection
    console.log('\n--- 8. Invalid JWT Rejection (HTTP 401) ---');
    const invalidTokenRes = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: { Authorization: 'Bearer totally-invalid-token-string' },
    });
    const invalidTokenBody = await invalidTokenRes.json();
    assert(invalidTokenRes.status === 401, 'Invalid JWT rejected with HTTP 401');
    assert(invalidTokenBody.success === false, 'Invalid JWT returns success: false');

    // 9. Expired JWT Rejection
    console.log('\n--- 9. Expired JWT Rejection (HTTP 401) ---');
    const jwtSecret = process.env.JWT_SECRET || 'test';
    const expiredToken = jwt.sign(
      { sub: 'admin@royalknot.com', email: 'admin@royalknot.com', role: 'ROLE_ADMIN' },
      jwtSecret,
      { expiresIn: '-1s' }
    );
    const expiredRes = await fetch(`${baseUrl}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${expiredToken}` },
    });
    const expiredBody = await expiredRes.json();
    assert(expiredRes.status === 401, 'Expired JWT rejected with HTTP 401');
    assert(expiredBody.success === false, 'Expired JWT returns success: false');

    // 10. Role-based Authorization Tests
    console.log('\n--- 10. Role-based Authorization Tests ---');
    // Admin accessing admin-only endpoint: 200 OK
    const adminRoleRes = await fetch(`${baseUrl}/role-test`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokens['admin@royalknot.com']}` },
    });
    assert(adminRoleRes.status === 200, 'Admin authorized for ROLE_ADMIN endpoint (HTTP 200)');

    // Planner accessing admin-only endpoint: 403 Forbidden
    const plannerRoleRes = await fetch(`${baseUrl}/role-test`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokens['planner@royalknot.com']}` },
    });
    assert(plannerRoleRes.status === 403, 'Planner rejected for ROLE_ADMIN endpoint (HTTP 403 Forbidden)');

    // Client accessing admin-only endpoint: 403 Forbidden
    const clientRoleRes = await fetch(`${baseUrl}/role-test`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokens['client@royalknot.com']}` },
    });
    assert(clientRoleRes.status === 403, 'Client rejected for ROLE_ADMIN endpoint (HTTP 403 Forbidden)');

    // Vendor accessing admin-only endpoint: 403 Forbidden
    const vendorRoleRes = await fetch(`${baseUrl}/role-test`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokens['vendor@royalknot.com']}` },
    });
    assert(vendorRoleRes.status === 403, 'Vendor rejected for ROLE_ADMIN endpoint (HTTP 403 Forbidden)');

    console.log('\n====================================================');
    console.log(`📊 TEST SUITE SUMMARY: ${passedTests}/${totalTests} tests passed`);
    console.log('====================================================');

    if (passedTests !== totalTests) {
      process.exitCode = 1;
    }
  } catch (err: any) {
    console.error('Fatal error during test suite execution:', err);
    process.exitCode = 1;
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTestSuite();

