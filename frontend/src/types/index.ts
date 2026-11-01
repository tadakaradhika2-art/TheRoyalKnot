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
  cuisineType: string;
  regionalSpecialization: string;
  menuDetails: string;
  vegetarianOptionsCount: number;
  nonVegetarianOptionsCount: number;
  pricePerPlate: number;
  guestCount: number;
  additionalCharges: number;
  totalEstimatedPrice: number;
  serviceInclusions: string;
  exclusions: string;
  recommended: boolean;
  status: string; // SUBMITTED, SELECTED, CLOSED, REJECTED
  selectionTimestamp?: string;
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
  arrivalStatus: 'Not Arrived' | 'Arrived' | 'Running Late' | 'Service Completed';
  notes?: string;
  statusUpdatedAt?: string;
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

