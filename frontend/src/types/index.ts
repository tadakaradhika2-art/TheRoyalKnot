export type RoleType = 
  | 'ROLE_ADMIN'
  | 'ROLE_PLANNER'
  | 'ROLE_CLIENT'
  | 'ROLE_VENDOR';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  active: boolean;
  roles: RoleType[];
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  timestamp: string;
}

export interface WeddingPackage {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  inclusions: string;
}

export interface Enquiry {
  id: number;
  coupleNames: string;
  email: string;
  phone: string;
  preferredWeddingDate?: string;
  estimatedGuestCount: number;
  weddingLocation: string;
  preferredTheme: string;
  weddingType: string;
  selectedPackage: string;
  maximumBudget: number;
  additionalRequirements?: string;
  status: string;
  consultationScheduledDate?: string;
  assignedPlannerEmail?: string;
  createdAt: string;
}

export interface Agreement {
  id: number;
  agreementNumber: string;
  clientNames: string;
  clientEmail: string;
  packageName: string;
  serviceScope: string;
  agreedPrice: number;
  termsAndConditions: string;
  signatureData?: string;
  signedTimestamp?: string;
  status: string;
  createdAt: string;
}

export interface VendorQuotation {
  id: number;
  vendorName: string;
  vendorEmail: string;
  serviceCategory: string;
  pricingModel?: 'PER_PLATE' | 'FIXED';
  packageTitle?: string;
  description?: string;
  cuisineType: string;
  regionalSpecialization: string;
  menuDetails: string;
  vegetarianOptionsCount: number;
  nonVegetarianOptionsCount: number;
  pricePerPlate: number;
  guestCount: number;
  additionalCharges: number;
  taxAmount?: number;
  totalEstimatedPrice: number;
  serviceInclusions: string;
  exclusions: string;
  recommended: boolean;
  status: string; // SUBMITTED, ACCEPTED, CLOSED, REJECTED
  selectionTimestamp?: string;
  enquiryId?: number;
  availability?: string;
  validUntil?: string;
  termsAndConditions?: string;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  collectionCode: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  collectionName: string;
  description: string;
  isEssential: boolean;
  defaultPricingModel: 'PER_PLATE' | 'FIXED';
  quotationCount?: number;
  selectedVendor?: string | null;
  selectedPackage?: string | null;
  selectedAmount?: number | null;
  selectedQuotationId?: number | null;
  isSelected?: boolean;
}

export interface InvoiceLineItem {
  id: number;
  invoiceId?: number;
  enquiryId: number;
  category: string;
  quotationId?: number;
  vendorName: string;
  vendorEmail?: string;
  packageTitle: string;
  pricingModel: 'PER_PLATE' | 'FIXED';
  unitPrice: number;
  quantity: number;
  baseAmount: number;
  additionalCharges: number;
  taxAmount: number;
  discountAmount: number;
  lineTotal: number;
  status: string;
  selectedAt: string;
}

export interface ItemizedBillData {
  invoice: Invoice;
  lineItems: InvoiceLineItem[];
  additionalExpenses: AdditionalExpense[];
  payments: Payment[];
  summary: {
    subtotal: number;
    totalAdditionalCharges: number;
    totalTaxes: number;
    totalDiscount: number;
    totalLineItems: number;
    approvedExpensesTotal: number;
    totalWeddingServiceAmount: number;
    amountAlreadyPaid: number;
    outstandingBalance: number;
  };
}

export interface WeddingTask {
  id: number;
  title: string;
  description: string;
  category: string;
  assignedOwner: string;
  startDate?: string;
  deadline?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'To Plan' | 'In Progress' | 'Pending Approval' | 'Completed' | 'Delayed';
  completionTimestamp?: string;
}

export interface EventTimeline {
  id: number;
  timeSlot: string;
  activity: string;
  assignedVendor: string;
  activityStatus?: 'Upcoming' | 'In Progress' | 'Completed' | 'Delayed';
  expectedCompletion?: string;
  actualCompletion?: string;
  delayMinutes?: number;
  arrivalStatus: 'Not Arrived' | 'Arrived' | 'Running Late' | 'Service Completed';
  notes?: string;
  statusUpdatedAt?: string;
}

export interface VendorEvent {
  id: number;
  vendorEmail: string;
  vendorName: string;
  eventName: string;
  clientName: string;
  eventDate: string;
  venue: string;
  guestCount: number;
  serviceType: string;
  requirements?: string;
  acceptedQuotationAmount: number;
  category: 'ONGOING' | 'UPCOMING' | 'PAST';
  eventStatus: string;
  expectedServiceTime?: string;
  arrivalStatus: 'Not Arrived' | 'Arrived' | 'Running Late' | 'Service Completed';
  serviceProgress?: string;
  paymentStatus: string;
  completionNotes?: string;
  createdAt: string;
}

export interface VendorEventsResponse {
  all: VendorEvent[];
  ongoing: VendorEvent[];
  upcoming: VendorEvent[];
  past: VendorEvent[];
}

export interface AdditionalExpense {
  id: number;
  itemDescription: string;
  category: string;
  amount: number;
  clientApprovalStatus: 'Pending Approval' | 'Approved' | 'Rejected';
  reason?: string;
  requestedAt: string;
  resolvedAt?: string;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientNames: string;
  agreedPackageAmount: number;
  approvedAdditionalCosts: number;
  finalClientAmount: number;
  amountReceived: number;
  outstandingBalance: number;
  vendorPayableAmount: number;
  paymentStatus: 'PENDING' | 'PARTIALLY_PAID' | 'FULLY_PAID';
  dueDate?: string;
  generatedAt: string;
}

export interface Payment {
  id: number;
  milestoneTitle: string;
  amountDue: number;
  amountPaid?: number;
  dueDate?: string;
  paymentDate?: string;
  status: string;
  transactionReference?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  targetRole: string;
  read: boolean;
  timestamp: string;
}

export interface FounderAnalytics {
  totalWeddings: number;
  activeWeddings: number;
  completedWeddings: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  pendingClientPayments: number;
  upcomingVendorPayments: number;
  averageWeddingProfitability: number;
  vendorOnTimeArrivalRate: number;
  delayedArrivalsCount: number;
  completedAssignmentsCount: number;
  cancelledAssignmentsCount: number;
  monthlyRevenueTrend: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  weddingWiseProfitability: Array<{
    name: string;
    client: string;
    revenue: number;
    expenses: number;
    margin: string;
    status: string;
  }>;
}

