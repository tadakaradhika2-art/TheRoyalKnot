# THE ROYAL KNOT
## Product Requirements Document (PRD)

**Product:** The Royal Knot – Wedding Planning & Management System  
**Product Type:** Web-based Wedding Management Platform  
**Version:** 1.0  
**Primary Objective:** Digitize and centralize the complete wedding planning and execution lifecycle.

---

# 1. PROJECT OVERVIEW

The Royal Knot is a centralized wedding planning and management platform designed to simplify the operations of a wedding planning agency.

The system connects couples, wedding planners, vendors, and the agency founder through a single platform.

It manages the complete wedding lifecycle, starting from initial enquiries and consultations to vendor selection, wedding preparation, live event coordination, invoicing, and financial analysis.

The platform aims to eliminate scattered communication, manual quotation comparisons, unorganized task assignments, delayed vendor updates, and financial tracking difficulties.

# 2. PROJECT OBJECTIVES

1. Provide a centralized wedding management system.
2. Simplify wedding service selection and booking.
3. Digitize consultation and agreement processes.
4. Enable transparent vendor quotation comparisons.
5. Automate wedding task creation and assignment.
6. Track payment milestones and outstanding balances.
7. Monitor wedding-day activities and vendor arrivals.
8. Generate accurate invoices and track additional costs.
9. Provide business performance analytics to the founder.

# 3. TARGET USERS AND ROLES

## 3.1 Admin / Founder

The founder has organization-wide access.

Responsibilities:
- Monitor all active weddings.
- Review business revenue and expenditure.
- Analyze wedding profitability.
- Monitor vendor reliability.
- Track pending payments.
- Review season-wide performance.

## 3.2 Wedding Planner

The planner manages the operational lifecycle of individual weddings.

Responsibilities:
- Manage client enquiries.
- Schedule consultations.
- Prepare agreements.
- Request vendor quotations.
- Compare quotations.
- Coordinate wedding tasks.
- Manage payment milestones.
- Track wedding-day activities.

## 3.3 Client / Couple

The couple manages their wedding requirements and makes important decisions.

Responsibilities:
- Explore packages.
- Submit consultation forms.
- Review and sign agreements.
- Compare vendor proposals.
- Select preferred vendors.
- Track wedding progress.
- View payments and invoices.

The couple has final authority over vendor selection.

## 3.4 Vendor

Vendors provide services for weddings.

Responsibilities:
- Maintain vendor information.
- Receive quotation requests.
- Submit proposals.
- Accept assigned work.
- Update service progress.
- Report arrival on the wedding day.
- View payment status.

# 4. FUNCTIONAL REQUIREMENTS

## MODULE 1: USER LOGIN AND DASHBOARD

**Purpose:** Provide secure access to the application.

Features:
- Login and logout.
- Role-based authentication.
- Password protection.
- Role-specific dashboard redirects.
- Session management.
- Permission-based navigation.

Expected behavior:

After authentication, users should be redirected to their respective dashboards.

The Admin, Planner, Client, and Vendor must not access unauthorized records or operations.

## MODULE 2: SERVICES AND PACKAGES

**Purpose:** Allow couples to explore available wedding services.

Two primary packages:

**A. Full-Service Wedding**
- Complete wedding planning.
- Venue coordination.
- Theme and decoration.
- Catering.
- Photography.
- Entertainment.
- Vendor management.
- Event-day coordination.

**B. Partial / Day-of Service**
- Assistance with selected planning activities.
- Vendor coordination.
- Event schedule management.
- Wedding-day execution.
- On-site coordination.

Features:
- Service descriptions.
- Package pricing.
- Package comparison.
- Service selection.
- Enquiry initiation.

## MODULE 3: CONSULTATION FORM AND ENQUIRY

**Purpose:** Collect wedding requirements from prospective clients.

Form fields:
- Couple names.
- Contact details.
- Preferred wedding date.
- Estimated guest count.
- Wedding location.
- Preferred theme.
- Wedding type and traditions.
- Selected package.
- Maximum budget.
- Additional requirements.

Example demonstration values:
- Guest count: 400.
- Theme: Royal Heritage.
- Alternative theme: Beach Chic.

Enquiry statuses:
- New.
- Under Review.
- Consultation Scheduled.
- Proposal Sent.
- Converted to Booking.
- Rejected / Closed.

The system must validate submitted information and create a persistent enquiry record.

## MODULE 4: OWNER / PLANNER NOTIFICATIONS

**Purpose:** Ensure no enquiry is missed.

Features:
- Immediate notification when an enquiry is submitted.
- Enquiry details visible in the planner dashboard.
- Notification timestamp.
- Enquiry assignment.
- Consultation scheduling.
- Enquiry status updates.

Expected behavior:

A new enquiry must appear automatically in the assigned planner's workspace and be visible to authorized administrators.

## MODULE 5: DIGITAL SERVICE AGREEMENT

**Purpose:** Digitize the booking agreement process.

Features:
- Agreement generation.
- Client and agency information.
- Selected package details.
- Service scope.
- Pricing and payment terms.
- Terms and conditions.
- Digital signature capture.
- Signing timestamp.
- Signed agreement storage.

Agreement statuses:
- Draft.
- Sent.
- Viewed.
- Signed.
- Cancelled.

Expected behavior:

Once signed, the agreement must be attached to the corresponding wedding/client record.

For the prototype, implement a signature-capture experience and persist the signed agreement. Production-grade electronic-signature compliance can be added separately.

## MODULE 6: VENDOR QUOTATION COMPARISON

**Purpose:** Help planners compare three catering proposals.

Workflow:
1. Planner selects the catering requirement.
2. Planner sends quotation requests to three caterers.
3. Each vendor submits a quotation.
4. Planner views the quotations in a comparison interface.
5. Client reviews the shortlisted options.

Quotation information:
- Vendor name.
- Cuisine type.
- Regional food specialization.
- Menu details.
- Vegetarian options.
- Non-vegetarian options.
- Price per plate.
- Guest count.
- Total estimated price.
- Additional charges.
- Service inclusions.
- Terms and conditions.

Comparison formula:

Total Estimated Catering Cost = Price Per Plate × Number of Guests + Additional Charges.

The comparison screen must support:
- Side-by-side comparison.
- Line-by-line menu comparison.
- Price comparison.
- Inclusion and exclusion comparison.
- Recommendation indicators.

The planner manages the comparison, but the client makes the final selection.

## MODULE 7: VENDOR SELECTION AND CLOSURE

**Purpose:** Finalize the selected vendor.

Features:
- Client vendor selection.
- Selection confirmation.
- Automatic closure of other pending quotation requests.
- Selected vendor assignment.
- Wedding record linkage.
- Selection timestamp.
- Notification to selected and unsuccessful vendors.

Business rule:

For a particular catering requirement, only one vendor can be selected as the final vendor.

Other quotation requests must automatically change to Closed / Not Selected.

The selected vendor must be associated with the wedding record.

## MODULE 8: AUTOMATIC WEDDING PLAN GENERATION

**Purpose:** Automatically generate the wedding execution plan after booking confirmation.

Trigger conditions:
- Proposal confirmed.
- Booking deposit successfully recorded.

The system must generate at least 25 wedding tasks.

Example task categories:

**Venue and Logistics**
1. Venue confirmation.
2. Accommodation arrangements.
3. Guest transportation.
4. Seating arrangements.

**Design and Decoration**
5. Theme finalization.
6. Stage design.
7. Floral arrangements.
8. Lighting arrangements.

**Vendor Coordination**
9. Caterer confirmation.
10. Photography confirmation.
11. Videography confirmation.
12. Entertainment arrangements.

**Wedding Ceremonies**
13. Mehendi arrangements.
14. Haldi arrangements.
15. Sangeet arrangements.
16. Wedding ceremony preparation.

**Reception**
17. Reception stage preparation.
18. Reception catering.
19. Guest welcome arrangements.

**Additional Planning**
20. Invitation design.
21. Guest list finalization.
22. Return gifts.
23. Makeup coordination.
24. Final vendor confirmation.
25. Final event checklist.

Each task must contain:
- Task title.
- Description.
- Category.
- Assigned owner.
- Start date.
- Deadline.
- Priority.
- Status.
- Completion timestamp.

Task statuses:
- To Plan.
- In Progress.
- Pending Approval.
- Completed.
- Delayed.

Payment milestones:
1. Booking deposit.
2. Advance payment one month before the wedding.
3. Final payment after the event.

Track:
- Amount due.
- Amount paid.
- Payment date.
- Due date.
- Payment status.

## MODULE 9: LIVE WEDDING-DAY SCHEDULE AND VENDOR TRACKER

**Purpose:** Coordinate the wedding event in real time.

Features:
- Minute-by-minute wedding schedule.
- Live event status.
- Vendor arrival tracking.
- Delay notifications.
- Timeline management.
- Planner monitoring dashboard.

Example wedding-day timeline:

| Time | Activity |
|---|---|
| 08:00 AM | Venue preparation |
| 09:00 AM | Vendor setup |
| 10:00 AM | Groom arrival |
| 11:00 AM | Garland exchange |
| 12:00 PM | Wedding rituals and vows |
| 02:00 PM | Lunch |
| 06:00 PM | Reception preparation |
| 07:00 PM | Reception begins |

Vendor arrival statuses:
- Not Arrived.
- Arrived.
- Running Late.
- Service Completed.

Expected behavior:

When a vendor updates their arrival status, the planner dashboard should receive the update in real time using WebSocket communication.

Late vendors must be clearly highlighted.

The planner should be able to identify delays and take corrective action.

## MODULE 10: INVOICING AND ADDITIONAL COSTS

**Purpose:** Manage final wedding expenses transparently.

Features:
- Initial agreed budget.
- Additional expense recording.
- Extra catering plates.
- Extended DJ hours.
- Additional decoration requirements.
- Client approval of chargeable additions.
- Final invoice generation.
- Vendor payment tracking.

Invoice calculation:

Final Client Amount = Agreed Package Amount + Approved Additional Costs.

The system must maintain:
- Original quotation.
- Additional charges.
- Approved expenses.
- Total client amount.
- Amount received.
- Outstanding balance.
- Vendor payable amount.
- Vendor payment status.

Avoid duplicate charges and maintain an audit trail of financial changes.

## MODULE 11: FOUNDER'S SEASON REVIEW DASHBOARD

**Purpose:** Give the founder a complete view of business performance.

Dashboard KPIs:
- Total weddings.
- Active weddings.
- Completed weddings.
- Total revenue.
- Total expenses.
- Net profit.
- Pending client payments.
- Upcoming vendor payments.
- Average wedding profitability.

Features:
- Wedding-wise profitability.
- Season-wide performance.
- Revenue and expense charts.
- Vendor reliability analysis.
- Outstanding payment tracker.
- Upcoming payment calendar.
- Completed versus active wedding comparison.

Example:

The founder should be able to monitor 25 weddings across an entire wedding season.

Vendor reliability metrics should include:
- On-time arrival percentage.
- Delayed arrivals.
- Completed assignments.
- Cancelled assignments.

Profit calculation:

Net Profit = Recognized Revenue − Total Business Expenses.

The system must distinguish unpaid invoices from actual received payments.

# 5. NON-FUNCTIONAL REQUIREMENTS

## Security
- Secure authentication.
- Role-based authorization.
- Backend permission validation.
- Password hashing.
- Protected APIs.
- Secure document access.
- Audit logging for important actions.

## Performance
- Efficient database queries.
- Pagination for large datasets.
- Optimized images.
- Responsive interactions.
- Efficient WebSocket updates.

## Reliability
- Database persistence.
- Input validation.
- Error handling.
- Transaction management.
- Prevention of duplicate vendor selections.
- Prevention of duplicate task generation.

## Usability
- Responsive design.
- Clear navigation.
- Consistent design system.
- Accessible forms.
- Helpful status indicators.
- Meaningful loading and error states.

# 6. UI/UX REQUIREMENTS

Brand identity: THE ROYAL KNOT.

Visual direction:
- Luxury Indian wedding aesthetic.
- Ivory and champagne-gold palette.
- Deep burgundy accents.
- Elegant serif typography.
- Refined layouts.
- Premium photography.
- Subtle animations.
- Clean information hierarchy.

Distinct dashboards:

**Admin:** Executive luxury dashboard.

**Planner:** Operational command center.

**Client:** Personalized wedding portal.

**Vendor:** Professional vendor workspace.

The public welcome page must include the signature fabric-knot and wedding-ring animation.

# 7. SYSTEM ARCHITECTURE

Frontend:
React + TypeScript + Tailwind CSS + Framer Motion.

Backend:
Java 17 + Spring Boot + Spring Security.

Data Access:
Spring Data JPA + Hibernate.

Database:
PostgreSQL.

Communication:
REST APIs using JSON.

Real-time updates:
WebSocket.

Analytics:
Recharts.

The application must use a single Spring Boot backend and a centralized PostgreSQL database.

# 8. CORE DATA ENTITIES

The database should support the following entities:

1. User
2. Role
3. Client
4. Planner
5. Vendor
6. Wedding
7. Package
8. Service
9. Enquiry
10. Consultation
11. Agreement
12. Signature
13. VendorQuotationRequest
14. VendorQuotation
15. VendorSelection
16. WeddingTask
17. Payment
18. PaymentMilestone
19. WeddingEvent
20. EventTimeline
21. VendorAttendance
22. Invoice
23. AdditionalExpense
24. Notification
25. AuditLog

Use appropriate relationships, primary keys, foreign keys, constraints, and timestamps.

# 9. ACCEPTANCE CRITERIA

The prototype will be considered successful when:

1. All four roles can log in and access the correct dashboard.
2. A couple can submit a consultation enquiry.
3. The planner can receive and manage the enquiry.
4. The planner can generate and send a digital agreement.
5. The client can sign the agreement.
6. Three vendors can submit quotations.
7. The planner can compare all three quotations.
8. The client can select one vendor.
9. Other quotation requests close automatically.
10. A confirmed booking generates at least 25 tasks.
11. Payment milestones are visible and trackable.
12. Vendors can update their arrival status.
13. The planner receives live arrival updates.
14. Additional expenses can be recorded and approved.
15. Final invoices reflect approved charges.
16. The founder can view wedding profitability and season analytics.
17. Data persists in PostgreSQL.
18. Unauthorized role access is blocked.
19. The interface works on desktop and mobile.
20. The main business workflow can be demonstrated without manually editing the database.

# 10. PROTOTYPE DEMONSTRATION SCENARIO

Use one realistic example wedding to demonstrate the complete application.

**Wedding:** The Sharma Wedding  
**Guest Count:** 400  
**Theme:** Royal Heritage  
**Package:** Full-Service Wedding

Demonstration sequence:

1. Couple logs in.
2. Couple selects the Full-Service package.
3. Couple submits the enquiry.
4. Planner receives the enquiry.
5. Planner schedules consultation.
6. Planner sends the agreement.
7. Couple signs the agreement.
8. Three caterers submit quotations.
9. Planner compares all three quotations.
10. Couple selects one caterer.
11. Booking deposit is recorded.
12. System generates 25+ wedding tasks.
13. Planner assigns task owners.
14. Vendors update their service and arrival statuses.
15. Planner monitors the live wedding schedule.
16. Extra charges are approved and added.
17. Final invoice is generated.
18. Founder reviews the wedding's financial performance.

# 11. DEVELOPMENT PRIORITIES

**Priority 1:** Authentication, roles, dashboard structure.

**Priority 2:** Services, packages, enquiries, and consultations.

**Priority 3:** Agreements and digital signatures.

**Priority 4:** Vendor quotations, comparison, and selection.

**Priority 5:** Automatic task generation and payments.

**Priority 6:** Wedding-day schedule and live vendor tracker.

**Priority 7:** Invoicing and additional expenses.

**Priority 8:** Founder analytics and season review.

# 12. FINAL PRODUCT VISION

THE ROYAL KNOT must function as a centralized wedding agency management platform rather than simply a wedding information website.

Every major workflow should be connected.

An enquiry should lead to a consultation. A consultation should lead to an agreement. An agreement and booking deposit should lead to an organized wedding plan. Vendor selection should influence wedding operations. Live event information should update planner dashboards. Final expenses should influence profitability.

The ultimate objective is to give couples a transparent wedding experience, planners a powerful operational workspace, vendors a clear coordination platform, and founders complete business visibility.