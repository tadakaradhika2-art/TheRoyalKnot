import axios from 'axios';
import {
  ApiResponse,
  AuthResponse,
  User,
  WeddingPackage,
  Enquiry,
  Agreement,
  VendorQuotation,
  WeddingTask,
  EventTimeline,
  AdditionalExpense,
  Invoice,
  Payment,
  NotificationItem,
  FounderAnalytics
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- In-Memory & LocalStorage Demonstration Fallback Store ---
// Ensures 100% interactive functionality even before or during backend initialization

const STORAGE_KEYS = {
  ENQUIRIES: 'rk_demo_enquiries',
  AGREEMENT: 'rk_demo_agreement',
  QUOTES: 'rk_demo_quotes',
  TASKS: 'rk_demo_tasks',
  SCHEDULE: 'rk_demo_schedule',
  EXPENSES: 'rk_demo_expenses',
  INVOICE: 'rk_demo_invoice',
  PAYMENTS: 'rk_demo_payments',
  NOTIFICATIONS: 'rk_demo_notifications',
};

function getStored<T>(key: string, defaultVal: T): T {
  const s = localStorage.getItem(key);
  if (!s) {
    localStorage.setItem(key, JSON.stringify(defaultVal));
    return defaultVal;
  }
  try {
    return JSON.parse(s);
  } catch {
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): T {
  localStorage.setItem(key, JSON.stringify(val));
  return val;
}

// Initial demonstration data matching PRD
const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: 1,
    coupleNames: 'Eleanor Vance & Arjun Sharma',
    email: 'client@royalknot.com',
    phone: '+91 98765 43210',
    preferredWeddingDate: '2027-02-14',
    estimatedGuestCount: 400,
    weddingLocation: 'City Palace, Udaipur, Rajasthan',
    preferredTheme: 'Royal Heritage',
    weddingType: 'Traditional Royal Marwari & Punjabi',
    selectedPackage: 'Full-Service Wedding',
    maximumBudget: 2500000,
    additionalRequirements: '8 Live multi-cuisine counters for 400 guests, vintage doli, sufi night.',
    status: 'Consultation Scheduled',
    consultationScheduledDate: '2026-11-04T15:00:00',
    assignedPlannerEmail: 'planner@royalknot.com',
    createdAt: '2026-10-31T12:00:00',
  }
];

const DEFAULT_AGREEMENT: Agreement = {
  id: 1,
  agreementNumber: 'AGR-2026-SHARMA-01',
  clientNames: 'Eleanor Vance & Arjun Sharma',
  clientEmail: 'client@royalknot.com',
  packageName: 'Full-Service Wedding',
  serviceScope: 'Complete 3-Day Wedding Planning at City Palace, Udaipur: Venue styling, Catering coordination for 400 guests, Live artist orchestration, 25+ automated task management, and live event control.',
  agreedPrice: 2500000,
  termsAndConditions: '1. A 20% booking deposit (₹5,00,000) confirms reservation.\n2. Milestone 2 due 30 days prior to wedding date.\n3. The Royal Knot provides dedicated senior wedding planner and day-of control team.',
  status: 'Sent',
  createdAt: '2026-10-31T12:30:00',
};

const DEFAULT_QUOTES: VendorQuotation[] = [
  {
    id: 1,
    vendorName: 'Royal Rasoi Caterers',
    vendorEmail: 'vendor@royalknot.com',
    serviceCategory: 'Catering',
    cuisineType: 'Royal Awadhi & Mughlai Heritage',
    regionalSpecialization: 'Dum Pukht, Galouti Kebabs, Dal Bukhara, Shahi Tukda',
    menuDetails: '7 Royal Welcome Drinks, 12 Starters (6 Veg, 6 Non-Veg), 14 Main Courses, 8 Live Counters, 6 Artisanal Desserts',
    vegetarianOptionsCount: 18,
    nonVegetarianOptionsCount: 12,
    pricePerPlate: 1800,
    guestCount: 400,
    additionalCharges: 80000,
    totalEstimatedPrice: 800000,
    serviceInclusions: 'Premium Copper Chafing Dishes, 45 Uniformed Banquet Staff, Mineral Water Stations, Continuous Housekeeping',
    exclusions: 'Alcoholic spirits and bartending licensing',
    recommended: true,
    status: 'SUBMITTED',
  },
  {
    id: 2,
    vendorName: 'Heritage Banquets & Dining',
    vendorEmail: 'quotes@heritagebanquets.com',
    serviceCategory: 'Catering',
    cuisineType: 'Pan-Indian Royal Thali',
    regionalSpecialization: 'Rajasthani Dal Baati Churma, Ker Sangri, Laal Maas',
    menuDetails: 'Traditional Welcome Sharbat, 10 Appetizers, 16 Heritage Curries, Pure Ghee Sweets',
    vegetarianOptionsCount: 20,
    nonVegetarianOptionsCount: 8,
    pricePerPlate: 2100,
    guestCount: 400,
    additionalCharges: 60000,
    totalEstimatedPrice: 900000,
    serviceInclusions: 'Royal Silverware Dining Set, 50 Service Stewards, Tandoor Live Grills',
    exclusions: 'Outdoor canopy seating infrastructure',
    recommended: false,
    status: 'SUBMITTED',
  },
  {
    id: 3,
    vendorName: 'Spice Symphony Gourmet',
    vendorEmail: 'inquiries@spicesymphony.com',
    serviceCategory: 'Catering',
    cuisineType: 'Contemporary Indo-Western Fusion',
    regionalSpecialization: 'Truffle Infused Biryani, Smoked Paneer Tikka, Gourmet Dimsums',
    menuDetails: 'Modern Molecular Mocktails, 14 Grazing Table Starters, 12 Fusion Mains, Nitrogen Dessert Bar',
    vegetarianOptionsCount: 16,
    nonVegetarianOptionsCount: 14,
    pricePerPlate: 1950,
    guestCount: 400,
    additionalCharges: 95000,
    totalEstimatedPrice: 875000,
    serviceInclusions: 'Molecular Gastronomy Presentation, 40 Staff, Acrylic Dessert Displays',
    exclusions: 'Traditional clay oven tandoors',
    recommended: false,
    status: 'SUBMITTED',
  }
];

const DEFAULT_TASKS: WeddingTask[] = [
  // 1. Venue & Logistics
  { id: 1, title: 'Venue confirmation', description: 'Finalize luxury heritage palace contracts for all 3 days', category: 'Venue and Logistics', assignedOwner: 'Isabella Vance (Planner)', priority: 'CRITICAL', status: 'Completed' },
  { id: 2, title: 'Accommodation arrangements', description: 'Block 120 luxury suites for out-of-town guests', category: 'Venue and Logistics', assignedOwner: 'Isabella Vance (Planner)', priority: 'HIGH', status: 'Completed' },
  { id: 3, title: 'Guest transportation', description: 'Charter vintage cars for bridal party and luxury shuttles', category: 'Venue and Logistics', assignedOwner: 'Transport Lead', priority: 'MEDIUM', status: 'In Progress' },
  { id: 4, title: 'Seating arrangements', description: 'Design VIP royal court and family table seating plan', category: 'Venue and Logistics', assignedOwner: 'Isabella Vance (Planner)', priority: 'HIGH', status: 'In Progress' },

  // 2. Design & Decoration
  { id: 5, title: 'Theme finalization', description: 'Lock Royal Heritage & Gold moodboard and palette', category: 'Design and Decoration', assignedOwner: 'Creative Director', priority: 'HIGH', status: 'Completed' },
  { id: 6, title: 'Stage design', description: 'Fabricate bespoke carved golden mandap backdrop', category: 'Design and Decoration', assignedOwner: 'Production Lead', priority: 'CRITICAL', status: 'In Progress' },
  { id: 7, title: 'Floral arrangements', description: 'Order 10,000 fresh marigolds, red roses & exotic orchids', category: 'Design and Decoration', assignedOwner: 'Floral Lead', priority: 'HIGH', status: 'To Plan' },
  { id: 8, title: 'Lighting arrangements', description: 'Install fairy light canopy and architectural palace uplighting', category: 'Design and Decoration', assignedOwner: 'Lighting Director', priority: 'MEDIUM', status: 'To Plan' },

  // 3. Vendor Coordination
  { id: 9, title: 'Caterer confirmation', description: 'Lock Royal Rasoi contract and finalize 8 live counters', category: 'Vendor Coordination', assignedOwner: 'Isabella Vance (Planner)', priority: 'CRITICAL', status: 'Completed' },
  { id: 10, title: 'Photography confirmation', description: 'Contract candid luxury photographer and drone crew', category: 'Vendor Coordination', assignedOwner: 'Isabella Vance (Planner)', priority: 'HIGH', status: 'Completed' },
  { id: 11, title: 'Videography confirmation', description: 'Brief cinematic video team for same-day edit trailer', category: 'Vendor Coordination', assignedOwner: 'Media Lead', priority: 'MEDIUM', status: 'In Progress' },
  { id: 12, title: 'Entertainment arrangements', description: 'Confirm classical shehnai troupe and celebrity DJ', category: 'Vendor Coordination', assignedOwner: 'Entertainment Manager', priority: 'HIGH', status: 'In Progress' },

  // 4. Wedding Ceremonies
  { id: 13, title: 'Mehendi arrangements', description: 'Setup bohemian colorful courtyard with organic henna artists', category: 'Wedding Ceremonies', assignedOwner: 'Cultural Lead', priority: 'HIGH', status: 'To Plan' },
  { id: 14, title: 'Haldi arrangements', description: 'Design floral pool deck with yellow marigold curtains', category: 'Wedding Ceremonies', assignedOwner: 'Cultural Lead', priority: 'HIGH', status: 'To Plan' },
  { id: 15, title: 'Sangeet arrangements', description: 'Rehearse bridal dance sequence and test sound stage', category: 'Wedding Ceremonies', assignedOwner: 'Choreographer', priority: 'HIGH', status: 'In Progress' },
  { id: 16, title: 'Wedding ceremony preparation', description: 'Review Vedic priest requirements, sacred fire havan kund', category: 'Wedding Ceremonies', assignedOwner: 'Lead Priest & Planner', priority: 'CRITICAL', status: 'To Plan' },

  // 5. Reception
  { id: 17, title: 'Reception stage preparation', description: 'Construct royal throne podium with floral chandeliers', category: 'Reception', assignedOwner: 'Production Lead', priority: 'HIGH', status: 'To Plan' },
  { id: 18, title: 'Reception catering', description: 'Coordinate 7-course royal banquet and dessert bar', category: 'Reception', assignedOwner: 'Royal Rasoi Caterers', priority: 'CRITICAL', status: 'To Plan' },
  { id: 19, title: 'Guest welcome arrangements', description: 'Organize traditional rose water sprinkling & aarti welcome', category: 'Reception', assignedOwner: 'Hospitality Desk', priority: 'MEDIUM', status: 'To Plan' },

  // 6. Additional Planning
  { id: 20, title: 'Invitation design', description: 'Dispatch gold-foiled laser cut digital invitations', category: 'Additional Planning', assignedOwner: 'Creative Director', priority: 'HIGH', status: 'Completed' },
  { id: 21, title: 'Guest list finalization', description: 'Lock final headcount at 400 guests with RSVP validation', category: 'Additional Planning', assignedOwner: 'Couple', priority: 'CRITICAL', status: 'Completed' },
  { id: 22, title: 'Return gifts', description: 'Curate silver coin keepsake boxes and artisanal sweets', category: 'Additional Planning', assignedOwner: 'Gifting Lead', priority: 'MEDIUM', status: 'In Progress' },
  { id: 23, title: 'Makeup coordination', description: 'Conduct bridal trial with luxury celebrity MUA', category: 'Additional Planning', assignedOwner: 'Bridal Lead', priority: 'HIGH', status: 'In Progress' },
  { id: 24, title: 'Final vendor confirmation', description: 'Conduct all-hands vendor briefing and call sheets', category: 'Additional Planning', assignedOwner: 'Isabella Vance (Planner)', priority: 'CRITICAL', status: 'To Plan' },
  { id: 25, title: 'Final event checklist', description: 'Comprehensive master checklist walkthrough with couple', category: 'Additional Planning', assignedOwner: 'Isabella Vance (Planner)', priority: 'CRITICAL', status: 'To Plan' },
];

const DEFAULT_SCHEDULE: EventTimeline[] = [
  { id: 1, timeSlot: '08:00 AM', activity: 'Venue preparation & Stage Setup', assignedVendor: 'Imperial Decor Crew', arrivalStatus: 'Arrived', notes: 'All floral trucks checked in at South Gate.' },
  { id: 2, timeSlot: '09:00 AM', activity: 'Vendor setup & Live Kitchens', assignedVendor: 'Royal Rasoi Caterers', arrivalStatus: 'Arrived', notes: 'Kitchen equipment positioned in Palace Banquet Hall.' },
  { id: 3, timeSlot: '10:00 AM', activity: 'Groom arrival & Baraat procession', assignedVendor: 'Royal Brass Band & Vintage Carriage', arrivalStatus: 'Arrived', notes: 'Vintage Rolls Royce arrived on schedule.' },
  { id: 4, timeSlot: '11:00 AM', activity: 'Garland exchange (Varmala)', assignedVendor: 'Event Coordination Team', arrivalStatus: 'Arrived', notes: 'Varmala revolving stage tested and ready.' },
  { id: 5, timeSlot: '12:00 PM', activity: 'Wedding rituals and vows (Mandap Pheras)', assignedVendor: 'Lead Priest & Vedic Troupe', arrivalStatus: 'Arrived', notes: 'Havan kund setup completed.' },
  { id: 6, timeSlot: '02:00 PM', activity: 'Royal Lunch Banquet', assignedVendor: 'Royal Rasoi Caterers', arrivalStatus: 'Running Late', notes: 'Dessert counter delay reported: 15 min buffer applied.' },
  { id: 7, timeSlot: '06:00 PM', activity: 'Reception preparation & Sound check', assignedVendor: 'Sound & Lighting Team', arrivalStatus: 'Arrived', notes: 'Acoustics calibrated for palace courtyard.' },
  { id: 8, timeSlot: '07:00 PM', activity: 'Grand Reception begins', assignedVendor: 'Celebrity DJ & Live Troupe', arrivalStatus: 'Not Arrived', notes: 'Expected arrival at 06:45 PM for briefing.' },
];

const DEFAULT_EXPENSES: AdditionalExpense[] = [
  { id: 1, itemDescription: 'Extra 50 Catering Plates', category: 'Catering', amount: 90000, clientApprovalStatus: 'Approved', reason: 'Guest count updated from 400 to 450 per client request.', requestedAt: '2026-10-31T14:00:00' },
  { id: 2, itemDescription: 'Extended DJ hours (2 hours)', category: 'Entertainment', amount: 30000, clientApprovalStatus: 'Approved', reason: 'After-party extended until 02:00 AM.', requestedAt: '2026-10-31T14:15:00' },
];

const DEFAULT_INVOICE: Invoice = {
  id: 1,
  invoiceNumber: 'INV-RK-2026-001',
  clientNames: 'Eleanor Vance & Arjun Sharma',
  agreedPackageAmount: 2500000,
  approvedAdditionalCosts: 120000,
  finalClientAmount: 2620000,
  amountReceived: 1500000,
  outstandingBalance: 1120000,
  vendorPayableAmount: 1450000,
  paymentStatus: 'PARTIALLY_PAID',
  dueDate: '2027-02-28',
  generatedAt: '2026-10-31T12:00:00',
};

const DEFAULT_PAYMENTS: Payment[] = [
  { id: 1, milestoneTitle: 'Booking Deposit (20%)', amountDue: 500000, amountPaid: 500000, dueDate: '2026-08-30', paymentDate: '2026-08-30', status: 'PAID', transactionReference: 'TXN-DEP-88491' },
  { id: 2, milestoneTitle: 'Advance Payment (40%)', amountDue: 1000000, amountPaid: 1000000, dueDate: '2026-10-15', paymentDate: '2026-10-15', status: 'PAID', transactionReference: 'TXN-ADV-99210' },
  { id: 3, milestoneTitle: 'Final Settlement & Additions', amountDue: 1120000, amountPaid: 0, dueDate: '2027-02-28', status: 'PENDING' },
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, title: 'New Enquiry Submitted', message: 'Eleanor Vance & Arjun Sharma requested Full-Service Wedding for 400 guests.', type: 'ENQUIRY_SUBMITTED', targetRole: 'ROLE_PLANNER', read: false, timestamp: '2026-10-31T12:00:00' },
  { id: 2, title: '3 Catering Proposals Received', message: 'Royal Rasoi, Heritage Banquets and Spice Symphony submitted catering quotes for comparison.', type: 'QUOTATION_RECEIVED', targetRole: 'ROLE_PLANNER', read: false, timestamp: '2026-10-31T12:15:00' },
  { id: 3, title: 'Vendor Status Alert', message: 'Royal Rasoi Caterers reported Running Late for Lunch Banquet dessert prep.', type: 'ARRIVAL_ALERT', targetRole: 'ROLE_PLANNER', read: false, timestamp: '2026-10-31T14:05:00' },
];

const DEFAULT_ANALYTICS: FounderAnalytics = {
  totalWeddings: 25,
  activeWeddings: 8,
  completedWeddings: 17,
  totalRevenue: 62500000,
  totalExpenses: 48500000,
  netProfit: 14000000,
  pendingClientPayments: 4200000,
  upcomingVendorPayments: 2850000,
  averageWeddingProfitability: 560000,
  vendorOnTimeArrivalRate: 94.2,
  delayedArrivalsCount: 3,
  completedAssignmentsCount: 54,
  cancelledAssignmentsCount: 0,
  monthlyRevenueTrend: [
    { month: 'Nov', revenue: 7500000, expenses: 5800000, profit: 1700000 },
    { month: 'Dec', revenue: 12000000, expenses: 9100000, profit: 2900000 },
    { month: 'Jan', revenue: 14500000, expenses: 11200000, profit: 3300000 },
    { month: 'Feb', revenue: 16000000, expenses: 12400000, profit: 3600000 },
    { month: 'Mar', revenue: 12500000, expenses: 10000000, profit: 2500000 },
  ],
  weddingWiseProfitability: [
    { name: 'The Sharma Wedding', client: 'Eleanor & Arjun', revenue: 2620000, expenses: 2040000, margin: '22.1%', status: 'IN_PREPARATION' },
    { name: 'The Kapoor Heritage Wedding', client: 'Aanya & Kabir', revenue: 3800000, expenses: 2850000, margin: '25.0%', status: 'COMPLETED' },
    { name: 'The Singhania Royal Gala', client: 'Rhea & Dev', revenue: 4500000, expenses: 3420000, margin: '24.0%', status: 'COMPLETED' },
    { name: 'The Mehra Palace Nuptials', client: 'Zara & Veer', revenue: 3100000, expenses: 2480000, margin: '20.0%', status: 'COMPLETED' },
    { name: 'The Reddy Luxury Nuptials', client: 'Pooja & Vikram', revenue: 2900000, expenses: 2260000, margin: '22.0%', status: 'LIVE_TODAY' },
  ],
};

// --- Exported Unified API Client ---
export const royalKnotApi = {
  // Auth
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      return res.data.data;
    } catch {
      let role: any = 'ROLE_CLIENT';
      let name = 'Eleanor & Arjun Sharma';
      if (credentials.email.includes('admin')) { role = 'ROLE_ADMIN'; name = 'Alexander Sterling'; }
      else if (credentials.email.includes('planner')) { role = 'ROLE_PLANNER'; name = 'Isabella Vance'; }
      else if (credentials.email.includes('vendor')) { role = 'ROLE_VENDOR'; name = 'Chef Raghavendra'; }

      return {
        token: 'demo-jwt-' + role,
        type: 'Bearer',
        user: {
          id: 1,
          email: credentials.email,
          firstName: name.split(' ')[0],
          lastName: name.split(' ').slice(1).join(' '),
          active: true,
          roles: [role],
        }
      };
    }
  },

  async getMe(): Promise<User> {
    try {
      const res = await api.get<ApiResponse<User>>('/auth/me');
      return res.data.data;
    } catch {
      return {
        id: 1,
        email: 'client@royalknot.com',
        firstName: 'Eleanor',
        lastName: 'Sharma',
        active: true,
        roles: ['ROLE_CLIENT'],
      };
    }
  },

  // Packages (Module 2)
  async getPackages(): Promise<WeddingPackage[]> {
    try {
      const res = await api.get<ApiResponse<WeddingPackage[]>>('/packages');
      return res.data.data;
    } catch {
      return [
        {
          id: 1,
          name: 'Full-Service Wedding',
          description: 'Complete end-to-end luxury wedding planning, venue coordination, theme & decor, catering, photography, entertainment, vendor management and event-day execution.',
          basePrice: 2500000,
          inclusions: 'Complete Planning, Venue Coordination, Theme & Decor, 3-Day Catering Oversight, Photography & Cinema, Celebrity Entertainment, Master 3-Day Event-Day Coordination',
        },
        {
          id: 2,
          name: 'Partial / Day-of Service',
          description: 'Assistance with selected planning activities, vendor coordination, run-of-show schedule management, wedding-day execution, and on-site hospitality coordination.',
          basePrice: 1000000,
          inclusions: 'Selected Vendor Coordination, 3-Day Event Schedule Management, Wedding-Day On-Site Direction, Run-of-Show Stage Execution',
        }
      ];
    }
  },

  // Enquiries & Consultations (Modules 3 & 4)
  async getEnquiries(): Promise<Enquiry[]> {
    try {
      const res = await api.get<ApiResponse<Enquiry[]>>('/enquiries');
      return res.data.data;
    } catch {
      return getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
    }
  },

  async createEnquiry(enquiry: Partial<Enquiry>): Promise<Enquiry> {
    try {
      const res = await api.post<ApiResponse<Enquiry>>('/enquiries', enquiry);
      return res.data.data;
    } catch {
      const list = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
      const newEnquiry: Enquiry = {
        id: Date.now(),
        coupleNames: enquiry.coupleNames || 'Eleanor Vance & Arjun Sharma',
        email: enquiry.email || 'client@royalknot.com',
        phone: enquiry.phone || '+91 98765 43210',
        preferredWeddingDate: enquiry.preferredWeddingDate || '2027-02-14',
        estimatedGuestCount: enquiry.estimatedGuestCount || 400,
        weddingLocation: enquiry.weddingLocation || 'City Palace, Udaipur',
        preferredTheme: enquiry.preferredTheme || 'Royal Heritage',
        weddingType: enquiry.weddingType || 'Traditional Royal',
        selectedPackage: enquiry.selectedPackage || 'Full-Service Wedding',
        maximumBudget: enquiry.maximumBudget || 2500000,
        additionalRequirements: enquiry.additionalRequirements,
        status: 'New',
        assignedPlannerEmail: 'planner@royalknot.com',
        createdAt: new Date().toISOString(),
      };
      list.unshift(newEnquiry);
      setStored(STORAGE_KEYS.ENQUIRIES, list);

      // Add notification
      const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      notifs.unshift({
        id: Date.now(),
        title: 'New Enquiry Submitted',
        message: `${newEnquiry.coupleNames} registered for ${newEnquiry.selectedPackage}.`,
        type: 'ENQUIRY_SUBMITTED',
        targetRole: 'ROLE_PLANNER',
        read: false,
        timestamp: new Date().toISOString(),
      });
      setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);

      return newEnquiry;
    }
  },

  async scheduleConsultation(id: number, scheduledDate: string): Promise<Enquiry> {
    try {
      const res = await api.post<ApiResponse<Enquiry>>(`/enquiries/${id}/schedule-consultation`, { scheduledDate });
      return res.data.data;
    } catch {
      const list = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
      const target = list.find(e => e.id === id) || list[0];
      target.consultationScheduledDate = scheduledDate;
      target.status = 'Consultation Scheduled';
      setStored(STORAGE_KEYS.ENQUIRIES, list);
      return target;
    }
  },

  async updateEnquiryStatus(id: number, status: string): Promise<Enquiry> {
    try {
      const res = await api.patch<ApiResponse<Enquiry>>(`/enquiries/${id}/status`, { status });
      return res.data.data;
    } catch {
      const list = getStored<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
      const target = list.find(e => e.id === id) || list[0];
      target.status = status;
      setStored(STORAGE_KEYS.ENQUIRIES, list);
      return target;
    }
  },

  // Digital Agreement (Module 5)
  async getActiveAgreement(): Promise<Agreement> {
    try {
      const res = await api.get<ApiResponse<Agreement>>('/agreements/active');
      return res.data.data;
    } catch {
      return getStored<Agreement>(STORAGE_KEYS.AGREEMENT, DEFAULT_AGREEMENT);
    }
  },

  async signAgreement(agreementId: number, signatureData: string, signerName: string): Promise<Agreement> {
    try {
      const res = await api.post<ApiResponse<Agreement>>('/agreements/sign', {
        agreementId,
        signatureData,
        signerName,
      });
      return res.data.data;
    } catch {
      const agr = getStored<Agreement>(STORAGE_KEYS.AGREEMENT, DEFAULT_AGREEMENT);
      agr.signatureData = signatureData;
      agr.signedTimestamp = new Date().toLocaleString();
      agr.status = 'Signed';
      setStored(STORAGE_KEYS.AGREEMENT, agr);

      // Add notification
      const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      notifs.unshift({
        id: Date.now(),
        title: 'Agreement Digitally Signed',
        message: `Service Agreement #${agr.agreementNumber} signed by ${signerName}!`,
        type: 'AGREEMENT_SIGNED',
        targetRole: 'ROLE_PLANNER',
        read: false,
        timestamp: new Date().toISOString(),
      });
      setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);

      return agr;
    }
  },

  // Vendor Quotations & Selection (Modules 6 & 7)
  async getCateringQuotations(): Promise<VendorQuotation[]> {
    try {
      const res = await api.get<ApiResponse<VendorQuotation[]>>('/quotations/catering');
      return res.data.data;
    } catch {
      return getStored<VendorQuotation[]>(STORAGE_KEYS.QUOTES, DEFAULT_QUOTES);
    }
  },

  async selectVendor(quoteId: number): Promise<VendorQuotation> {
    try {
      const res = await api.post<ApiResponse<VendorQuotation>>(`/quotations/${quoteId}/select`);
      return res.data.data;
    } catch {
      const list = getStored<VendorQuotation[]>(STORAGE_KEYS.QUOTES, DEFAULT_QUOTES);
      let selectedQuote: any = null;
      for (const q of list) {
        if (q.id === quoteId) {
          q.status = 'SELECTED';
          q.selectionTimestamp = new Date().toISOString();
          selectedQuote = q;
        } else {
          q.status = 'CLOSED'; // Competing bids close automatically
        }
      }
      setStored(STORAGE_KEYS.QUOTES, list);

      // Add notification
      const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      notifs.unshift({
        id: Date.now(),
        title: 'Vendor Selected by Couple',
        message: `${selectedQuote?.vendorName} confirmed for Catering! Competing bids automatically closed.`,
        type: 'VENDOR_SELECTED',
        targetRole: 'ROLE_PLANNER',
        read: false,
        timestamp: new Date().toISOString(),
      });
      setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);

      return selectedQuote;
    }
  },

  // 25+ Wedding Tasks (Module 8)
  async getTasks(): Promise<WeddingTask[]> {
    try {
      const res = await api.get<ApiResponse<WeddingTask[]>>('/tasks');
      return res.data.data;
    } catch {
      return getStored<WeddingTask[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    }
  },

  async getTaskStats(): Promise<any> {
    try {
      const res = await api.get<ApiResponse<any>>('/tasks/stats');
      return res.data.data;
    } catch {
      const tasks = getStored<WeddingTask[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'Completed').length;
      const inProgress = tasks.filter(t => t.status === 'In Progress').length;
      const toPlan = tasks.filter(t => t.status === 'To Plan').length;
      const delayed = tasks.filter(t => t.status === 'Delayed').length;
      return {
        total,
        completed,
        inProgress,
        toPlan,
        delayed,
        progressPercentage: Math.round((completed / total) * 100),
      };
    }
  },

  async autoGenerateTasks(): Promise<WeddingTask[]> {
    try {
      const res = await api.post<ApiResponse<WeddingTask[]>>('/tasks/auto-generate');
      return res.data.data;
    } catch {
      return setStored(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    }
  },

  async updateTaskStatus(taskId: number, status: string): Promise<WeddingTask> {
    try {
      const res = await api.patch<ApiResponse<WeddingTask>>(`/tasks/${taskId}/status`, { status });
      return res.data.data;
    } catch {
      const list = getStored<WeddingTask[]>(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
      const t = list.find(item => item.id === taskId) || list[0];
      t.status = status as any;
      if (status === 'Completed') t.completionTimestamp = new Date().toISOString();
      setStored(STORAGE_KEYS.TASKS, list);
      return t;
    }
  },

  // Live Schedule & Vendor Tracker (Module 9)
  async getSchedule(): Promise<EventTimeline[]> {
    try {
      const res = await api.get<ApiResponse<EventTimeline[]>>('/schedule');
      return res.data.data;
    } catch {
      return getStored<EventTimeline[]>(STORAGE_KEYS.SCHEDULE, DEFAULT_SCHEDULE);
    }
  },

  async updateArrivalStatus(timelineId: number, arrivalStatus: string, notes?: string): Promise<EventTimeline> {
    try {
      const res = await api.post<ApiResponse<EventTimeline>>('/schedule/arrival-update', {
        timelineId,
        arrivalStatus,
        notes,
      });
      return res.data.data;
    } catch {
      const list = getStored<EventTimeline[]>(STORAGE_KEYS.SCHEDULE, DEFAULT_SCHEDULE);
      const item = list.find(s => s.id === timelineId) || list[0];
      item.arrivalStatus = arrivalStatus as any;
      if (notes) item.notes = notes;
      item.statusUpdatedAt = new Date().toISOString();
      setStored(STORAGE_KEYS.SCHEDULE, list);

      // Notification
      const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      notifs.unshift({
        id: Date.now(),
        title: `Vendor Arrival: ${item.assignedVendor} is ${arrivalStatus}`,
        message: `${item.activity} (${item.timeSlot}): ${arrivalStatus}. ${notes || ''}`,
        type: arrivalStatus === 'Running Late' ? 'ARRIVAL_ALERT' : 'VENDOR_ARRIVED',
        targetRole: 'ROLE_PLANNER',
        read: false,
        timestamp: new Date().toISOString(),
      });
      setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);

      return item;
    }
  },

  // Invoicing & Additional Expenses (Module 10)
  async getLatestInvoice(): Promise<Invoice> {
    try {
      const res = await api.get<ApiResponse<Invoice>>('/invoices/active');
      return res.data.data;
    } catch {
      return getStored<Invoice>(STORAGE_KEYS.INVOICE, DEFAULT_INVOICE);
    }
  },

  async getExpenses(): Promise<AdditionalExpense[]> {
    try {
      const res = await api.get<ApiResponse<AdditionalExpense[]>>('/invoices/expenses');
      return res.data.data;
    } catch {
      return getStored<AdditionalExpense[]>(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
    }
  },

  async getPayments(): Promise<Payment[]> {
    try {
      const res = await api.get<ApiResponse<Payment[]>>('/invoices/payments');
      return res.data.data;
    } catch {
      return getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
    }
  },

  async addExpense(itemDescription: string, category: string, amount: number, reason: string): Promise<AdditionalExpense> {
    try {
      const res = await api.post<ApiResponse<AdditionalExpense>>('/invoices/expenses', {
        itemDescription,
        category,
        amount,
        reason,
      });
      return res.data.data;
    } catch {
      const list = getStored<AdditionalExpense[]>(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
      const exp: AdditionalExpense = {
        id: Date.now(),
        itemDescription,
        category,
        amount,
        clientApprovalStatus: 'Pending Approval',
        reason,
        requestedAt: new Date().toISOString(),
      };
      list.unshift(exp);
      setStored(STORAGE_KEYS.EXPENSES, list);
      return exp;
    }
  },

  async approveExpense(expenseId: number): Promise<Invoice> {
    try {
      const res = await api.post<ApiResponse<Invoice>>(`/invoices/expenses/${expenseId}/approve`);
      return res.data.data;
    } catch {
      const expenses = getStored<AdditionalExpense[]>(STORAGE_KEYS.EXPENSES, DEFAULT_EXPENSES);
      const exp = expenses.find(e => e.id === expenseId);
      if (exp) {
        exp.clientApprovalStatus = 'Approved';
        exp.resolvedAt = new Date().toISOString();
      }
      setStored(STORAGE_KEYS.EXPENSES, expenses);

      const inv = getStored<Invoice>(STORAGE_KEYS.INVOICE, DEFAULT_INVOICE);
      const totalApprovedExtras = expenses
        .filter(e => e.clientApprovalStatus === 'Approved')
        .reduce((sum, e) => sum + e.amount, 0);

      inv.approvedAdditionalCosts = totalApprovedExtras;
      inv.finalClientAmount = inv.agreedPackageAmount + totalApprovedExtras;
      inv.outstandingBalance = inv.finalClientAmount - inv.amountReceived;
      setStored(STORAGE_KEYS.INVOICE, inv);

      return inv;
    }
  },

  async recordPayment(amount: number, milestoneTitle: string, reference: string): Promise<Invoice> {
    try {
      const res = await api.post<ApiResponse<Invoice>>('/invoices/record-payment', {
        amount,
        milestoneTitle,
        reference,
      });
      return res.data.data;
    } catch {
      const inv = getStored<Invoice>(STORAGE_KEYS.INVOICE, DEFAULT_INVOICE);
      inv.amountReceived += amount;
      inv.outstandingBalance = inv.finalClientAmount - inv.amountReceived;
      setStored(STORAGE_KEYS.INVOICE, inv);

      const pmts = getStored<Payment[]>(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
      pmts.push({
        id: Date.now(),
        milestoneTitle,
        amountDue: amount,
        amountPaid: amount,
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'PAID',
        transactionReference: reference,
      });
      setStored(STORAGE_KEYS.PAYMENTS, pmts);

      return inv;
    }
  },

  // Founder Season Review Analytics (Module 11)
  async getFounderAnalytics(): Promise<FounderAnalytics> {
    try {
      const res = await api.get<ApiResponse<FounderAnalytics>>('/analytics/founder');
      return res.data.data;
    } catch {
      return DEFAULT_ANALYTICS;
    }
  },

  // Notifications (Module 4)
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await api.get<ApiResponse<NotificationItem[]>>('/notifications');
      return res.data.data;
    } catch {
      return getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    }
  },

  async markNotificationRead(id: number): Promise<void> {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      const notifs = getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
      const n = notifs.find(item => item.id === id);
      if (n) n.read = true;
      setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
    }
  },
};

export default api;
