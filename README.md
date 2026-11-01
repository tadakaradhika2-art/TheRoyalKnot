# THE ROYAL KNOT 💍✨
> **A Luxury Wedding Planning & Event Management Platform**

The Royal Knot is an enterprise-grade wedding orchestration web application designed to digitize and centralize the complete wedding planning and execution lifecycle for couples, wedding planners, vendors, and the agency founder.

---

## 🏛️ System Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide React, Recharts.
- **Backend**: Node.js, Express.js REST API with TypeScript (ESM).
- **Database Layer**: Prisma ORM with PostgreSQL support and resilient in-memory domain state fallback.
- **Security & RBAC**: JWT Bearer Authentication and Role-Based Access Control for 4 user roles.

---

## 👥 Four Role-Based Portals & Demo Accounts

The application features 1-click demo login buttons directly on the login page:

| Role | Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin / Founder** | `admin@royalknot.com` | `Royal@2026!` | Season audit (25 weddings), revenue vs expenses, net profit formula, vendor reliability ranking |
| **Wedding Planner** | `planner@royalknot.com` | `Royal@2026!` | Enquiry pipeline, consultation scheduler, agreement dispatch, 3-way quote matrix, 25+ automated task board, minute-by-minute schedule |
| **Client / Couple** | `client@royalknot.com` | `Royal@2026!` | Package explorer, digital agreement signing with canvas capture, vendor selection (auto-closing competing bids), task progress, invoice ledger |
| **Vendor** | `vendor@royalknot.com` | `Royal@2026!` | Service profile, quotation submission, day-of arrival check-in transmitter (`Arrived`, `Running Late`, `Service Completed`), contract payout tracking |

---

## 🚀 Quick Start Guide (Simple Local Development)

### Option A: One-Click Launcher (Windows)
Double-click `start.bat` in the project root to start both backend and frontend automatically.

### Option B: Two Independent Terminals

#### 1. Start the Express Backend API
```bash
cd backend
npm run dev
```
> The backend runs on `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`).

#### 2. Start the React Frontend Application
```bash
cd frontend
npm run dev
```
> The frontend runs on `http://localhost:5173`.

---

## 📋 11 Core Functional Modules Implemented

1. **Brand Identity & Luxury Landing**: Champagne Gold & Deep Burgundy aesthetic, Cinzel typography, and signature animated saree-kanduva fabric knot with interlocking wedding rings.
2. **Public Packages Showcase**: Full-Service Royal Luxury (₹25,00,000) vs Partial Coordination Elegance (₹10,00,000).
3. **Wedding Consultation Enquiry Flow**: Captures couple details, date, guest count (400), budget (₹25 Lakhs), and custom requirements.
4. **Digital Service Agreement**: Auto-generated agreement (AGR-2026-001) with interactive signature pad and timestamp capture.
5. **3-Caterer Quotation Comparison Matrix**: Itemized breakdown with formula `(Price Per Plate × Guests) + Extras = Total` across Royal Rasoi, Shahi Dawat, and Grand Royal Foods.
6. **Client Vendor Final Selection**: Single-click selection that marks the chosen caterer and automatically closes all competing bids.
7. **25+ Automated Wedding Task Board**: Pre-seeded across 8 operational categories (Venue, Logistics, Decor, Catering, Photo, Music, Attire, Legal).
8. **Minute-by-Minute Live Event Schedule**: Day-of run-sheet tracking wedding day milestones from 09:00 AM to 11:30 PM.
9. **Vendor Live Arrival Check-in Transmitter**: Real-time broadcast for on-site arrival, running late alert, and task completion.
10. **Invoice Ledger & Additional Costs Tracker**: Transparent ledger with client approvals for additional charges and payment milestones.
11. **Founder Executive Analytics**: Season-wide review (18 completed, 5 in progress, 2 upcoming), revenue (₹4.20 Cr), expenses (₹2.95 Cr), and Net Profit (₹1.25 Cr / 29.76% margin).
