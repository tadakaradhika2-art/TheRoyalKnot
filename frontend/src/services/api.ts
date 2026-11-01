import axios from 'axios';
import {
  ApiResponse,
  AuthResponse,
  User,
  WeddingPackage,
  Enquiry,
  Agreement,
  VendorQuotation,
  CategoryDefinition,
  InvoiceLineItem,
  ItemizedBillData,
  WeddingTask,
  EventTimeline,
  AdditionalExpense,
  Invoice,
  Payment,
  NotificationItem,
  FounderAnalytics,
  VendorEvent,
  VendorEventsResponse,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Automatic JWT inclusion for authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function handleApiError(err: any, fallbackMessage: string): never {
  const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    fallbackMessage;
  throw new Error(message);
}

export const royalKnotApi = {
  // Auth (Module 1)
  async login(credentials: { email: string; password: string }): Promise<AuthResponse> {
    try {
      const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
      if (!res.data || !res.data.data) {
        throw new Error(res.data?.message || 'Invalid email or password');
      }
      return res.data.data;
    } catch (err: any) {
      if (err.response?.status === 401) {
        throw new Error(err.response?.data?.message || 'Invalid email or password');
      }
      handleApiError(err, 'Authentication failed');
    }
  },

  async getMe(): Promise<User> {
    try {
      const res = await api.get<ApiResponse<User>>('/auth/me');
      if (!res.data || !res.data.data) {
        throw new Error(res.data?.message || 'Failed to retrieve authenticated user');
      }
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Session validation failed');
    }
  },

  // Packages (Module 2)
  async getPackages(): Promise<WeddingPackage[]> {
    try {
      const res = await api.get<ApiResponse<WeddingPackage[]>>('/packages');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to fetch wedding packages from database');
    }
  },

  // Enquiries & Consultations (Module 3)
  async getEnquiries(): Promise<Enquiry[]> {
    try {
      const res = await api.get<ApiResponse<Enquiry[]>>('/enquiries');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to retrieve consultation enquiries');
    }
  },

  async createEnquiry(enquiry: Partial<Enquiry>): Promise<Enquiry> {
    try {
      const res = await api.post<ApiResponse<Enquiry>>('/enquiries', enquiry);
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to submit wedding consultation enquiry');
    }
  },

  async scheduleConsultation(id: number, scheduledDate: string): Promise<Enquiry> {
    try {
      const res = await api.post<ApiResponse<Enquiry>>(`/enquiries/${id}/schedule-consultation`, {
        scheduledDate,
      });
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to schedule consultation');
    }
  },

  async updateEnquiryStatus(id: number, status: string): Promise<Enquiry> {
    try {
      const res = await api.patch<ApiResponse<Enquiry>>(`/enquiries/${id}/status`, { status });
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to update enquiry status');
    }
  },

  // Digital Agreement (Module 4)
  async getActiveAgreement(): Promise<Agreement> {
    try {
      const res = await api.get<ApiResponse<Agreement>>('/agreements/active');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to retrieve active agreement');
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
    } catch (err: any) {
      handleApiError(err, 'Failed to submit digital signature');
    }
  },

  // Vendor Quotations & Selection (Module 5 & Marketplace)
  async getCategories(): Promise<CategoryDefinition[]> {
    try {
      const res = await api.get<ApiResponse<CategoryDefinition[]>>('/quotations/categories');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to retrieve Hindu wedding categories');
    }
  },

  async getQuotationsByCategory(category?: string): Promise<VendorQuotation[]> {
    try {
      const url = category ? `/quotations?category=${encodeURIComponent(category)}` : '/quotations';
      const res = await api.get<ApiResponse<VendorQuotation[]>>(url);
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to retrieve vendor quotations');
    }
  },

  async getCateringQuotations(): Promise<VendorQuotation[]> {
    try {
      const res = await api.get<ApiResponse<VendorQuotation[]>>('/quotations/catering');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to retrieve vendor quotations');
    }
  },

  async selectVendor(quoteId: number, replace: boolean = false): Promise<VendorQuotation> {
    try {
      const res = await api.post<ApiResponse<VendorQuotation>>(`/quotations/${quoteId}/select`, { replace });
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to confirm vendor selection');
    }
  },

  async unselectVendor(quoteId: number): Promise<VendorQuotation> {
    try {
      const res = await api.post<ApiResponse<VendorQuotation>>(`/quotations/${quoteId}/unselect`);
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to remove vendor selection');
    }
  },

  async requestQuotation(category: string, notes?: string, clientName?: string): Promise<any> {
    try {
      const res = await api.post<ApiResponse<any>>('/quotations/request', {
        category,
        notes,
        clientName,
      });
      return res.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to transmit quotation request to planner');
    }
  },

  async getItemizedBill(): Promise<ItemizedBillData> {
    try {
      const res = await api.get<ApiResponse<ItemizedBillData>>('/invoices/bill');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to load itemized wedding bill');
    }
  },

  async createQuotation(quotation: Partial<VendorQuotation>): Promise<VendorQuotation> {
    try {
      const res = await api.post<ApiResponse<VendorQuotation>>('/quotations', quotation);
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to submit customized vendor quotation');
    }
  },

  // 25+ Wedding Tasks (Module 6)
  async getTasks(): Promise<WeddingTask[]> {
    try {
      const res = await api.get<ApiResponse<WeddingTask[]>>('/tasks');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to fetch planning tasks');
    }
  },

  async getTaskStats(): Promise<any> {
    try {
      const res = await api.get<ApiResponse<any>>('/tasks/stats');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to fetch task metrics');
    }
  },

  async autoGenerateTasks(): Promise<WeddingTask[]> {
    try {
      const res = await api.post<ApiResponse<WeddingTask[]>>('/tasks/auto-generate');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to auto-generate master tasks');
    }
  },

  async updateTaskStatus(taskId: number, status: string): Promise<WeddingTask> {
    try {
      const res = await api.patch<ApiResponse<WeddingTask>>(`/tasks/${taskId}/status`, { status });
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to update task status');
    }
  },

  // Live Wedding Schedule (Module 7)
  async getSchedule(): Promise<EventTimeline[]> {
    try {
      const res = await api.get<ApiResponse<EventTimeline[]>>('/schedule');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to retrieve event timeline');
    }
  },

  async updateArrivalStatus(timelineId: number, arrivalStatus: string, notes?: string, delayMinutes?: number): Promise<EventTimeline> {
    try {
      const res = await api.post<ApiResponse<EventTimeline>>('/schedule/arrival-update', {
        timelineId,
        arrivalStatus,
        notes,
        delayMinutes,
      });
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to update vendor arrival status');
    }
  },

  async updateActivityStatus(
    timelineId: number,
    data: {
      activityStatus?: string;
      actualCompletion?: string;
      expectedCompletion?: string;
      delayMinutes?: number;
      notes?: string;
    }
  ): Promise<EventTimeline> {
    try {
      const res = await api.patch<ApiResponse<EventTimeline>>(`/schedule/${timelineId}/activity-status`, data);
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to update activity status in control room');
    }
  },

  async updateTimelineTiming(
    timelineId: number,
    data: {
      timeSlot?: string;
      expectedCompletion?: string;
      delayMinutes?: number;
      notes?: string;
    }
  ): Promise<EventTimeline> {
    try {
      const res = await api.patch<ApiResponse<EventTimeline>>(`/schedule/${timelineId}/timing`, data);
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to update timeline timing in control room');
    }
  },

  // Vendor Workspace: My Events & Service Progress
  async getVendorEvents(): Promise<VendorEventsResponse> {
    try {
      const res = await api.get<ApiResponse<VendorEventsResponse>>('/vendor/events');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to fetch vendor events');
    }
  },

  async updateVendorProgress(
    eventId: number,
    data: {
      arrivalStatus?: string;
      serviceProgress?: string;
    }
  ): Promise<VendorEvent> {
    try {
      const res = await api.patch<ApiResponse<VendorEvent>>(`/vendor/events/${eventId}/progress`, data);
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to update vendor service progress');
    }
  },

  // Invoicing & Additional Expenses (Module 8)
  async getLatestInvoice(): Promise<Invoice> {
    try {
      const res = await api.get<ApiResponse<Invoice>>('/invoices/active');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to load active invoice');
    }
  },

  async getExpenses(): Promise<AdditionalExpense[]> {
    try {
      const res = await api.get<ApiResponse<AdditionalExpense[]>>('/invoices/expenses');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to load additional expenses');
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
    } catch (err: any) {
      handleApiError(err, 'Failed to record additional expense');
    }
  },

  async approveExpense(expenseId: number): Promise<Invoice> {
    try {
      const res = await api.post<ApiResponse<Invoice>>(`/invoices/expenses/${expenseId}/approve`);
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to approve expense');
    }
  },

  // Payments (Module 9)
  async getPayments(): Promise<Payment[]> {
    try {
      const res = await api.get<ApiResponse<Payment[]>>('/invoices/payments');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to load payments schedule');
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
    } catch (err: any) {
      handleApiError(err, 'Failed to record payment');
    }
  },

  // Notifications (Module 10)
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const res = await api.get<ApiResponse<NotificationItem[]>>('/notifications');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to load notifications');
    }
  },

  async markNotificationRead(id: number): Promise<void> {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err: any) {
      handleApiError(err, 'Failed to mark notification as read');
    }
  },

  // Founder Analytics (Module 11)
  async getFounderAnalytics(): Promise<FounderAnalytics> {
    try {
      const res = await api.get<ApiResponse<FounderAnalytics>>('/analytics/founder');
      return res.data.data;
    } catch (err: any) {
      handleApiError(err, 'Failed to compute founder analytics');
    }
  },
};

export default api;
