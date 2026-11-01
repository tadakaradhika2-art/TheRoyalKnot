import React, { useState, useEffect } from 'react';
import { royalKnotApi } from '../../services/api';
import {
  Agreement,
  VendorQuotation,
  WeddingTask,
  Invoice,
  AdditionalExpense,
  Payment,
  CategoryDefinition,
  ItemizedBillData,
  InvoiceLineItem
} from '../../types';
import {
  Heart,
  FileSignature,
  Utensils,
  CheckCircle2,
  Receipt,
  Sparkles,
  CreditCard,
  ShieldCheck,
  Clock,
  ArrowRight,
  AlertCircle,
  X,
  Check,
  Info,
  Search,
  Filter,
  ArrowLeft,
  Building,
  Flower2,
  Tent,
  Zap,
  Gift,
  Camera,
  Palette,
  Flame,
  Music,
  Disc,
  Car,
  Shield,
  Trash2,
  RotateCcw,
  Plus,
  Send,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClientDashboard: React.FC = () => {
  // Tab State: 'services' | 'bill' | 'agreement' | 'invoice'
  const [activeTab, setActiveTab] = useState<'services' | 'bill' | 'agreement' | 'invoice'>('services');

  // Core Data
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [tasks, setTasks] = useState<WeddingTask[]>([]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [expenses, setExpenses] = useState<AdditionalExpense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Category Marketplace State
  const [categories, setCategories] = useState<CategoryDefinition[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDefinition | null>(null);
  const [categoryQuotes, setCategoryQuotes] = useState<VendorQuotation[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('ALL');
  const [filterMode, setFilterMode] = useState<'ALL' | 'ESSENTIAL' | 'SELECTED'>('ALL');

  // Itemized Bill State
  const [itemizedBill, setItemizedBill] = useState<ItemizedBillData | null>(null);
  const [loadingBill, setLoadingBill] = useState(false);

  // Modals & Action States
  const [confirmModalQuote, setConfirmModalQuote] = useState<{ quote: VendorQuotation; isReplacing: boolean } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Request Quotation Modal State
  const [requestModalCategory, setRequestModalCategory] = useState<CategoryDefinition | null>(null);
  const [requestNotes, setRequestNotes] = useState('');
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);

  // Payment Recording Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(250000);
  const [paymentMilestone, setPaymentMilestone] = useState('Service Milestone Installment');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [approvingExpenseId, setApprovingExpenseId] = useState<number | null>(null);

  // Digital Signature State
  const [signatureName, setSignatureName] = useState('Aanya Sharma');
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [agr, tsks, inv, exps, pmts, cats, billData] = await Promise.all([
        royalKnotApi.getActiveAgreement(),
        royalKnotApi.getTasks(),
        royalKnotApi.getLatestInvoice(),
        royalKnotApi.getExpenses(),
        royalKnotApi.getPayments(),
        royalKnotApi.getCategories(),
        royalKnotApi.getItemizedBill(),
      ]);
      setAgreement(agr);
      setTasks(tsks);
      setInvoice(inv);
      setExpenses(exps);
      setPayments(pmts);
      setCategories(cats || []);
      setItemizedBill(billData || null);
    } catch (e) {
      console.error('Failed to load client workspace data', e);
    }
  };

  const refreshBillAndCategories = async () => {
    try {
      const [cats, billData, inv] = await Promise.all([
        royalKnotApi.getCategories(),
        royalKnotApi.getItemizedBill(),
        royalKnotApi.getLatestInvoice(),
      ]);
      setCategories(cats || []);
      setItemizedBill(billData || null);
      setInvoice(inv || null);
    } catch (e) {
      console.error(e);
    }
  };

  // When a category is clicked, load ONLY quotations for that category
  const handleSelectCategory = async (cat: CategoryDefinition) => {
    setSelectedCategory(cat);
    setLoadingQuotes(true);
    setSelectionError(null);
    try {
      const quotes = await royalKnotApi.getQuotationsByCategory(cat.name);
      setCategoryQuotes(quotes || []);
    } catch (err: any) {
      console.error('Failed to load category quotations', err);
      setCategoryQuotes([]);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleBackToCategories = async () => {
    setSelectedCategory(null);
    setCategoryQuotes([]);
    await refreshBillAndCategories();
  };

  // Handle Quotation Selection / Replacement
  const handleConfirmSelection = async () => {
    if (!confirmModalQuote) return;
    setIsSelecting(true);
    setSelectionError(null);

    try {
      await royalKnotApi.selectVendor(confirmModalQuote.quote.id, confirmModalQuote.isReplacing);
      setConfirmModalQuote(null);
      setToastMessage(`✓ ${confirmModalQuote.quote.vendorName} quotation added to your wedding bill!`);
      setTimeout(() => setToastMessage(null), 5000);

      // Reload category quotes and bill
      if (selectedCategory) {
        const updatedQuotes = await royalKnotApi.getQuotationsByCategory(selectedCategory.name);
        setCategoryQuotes(updatedQuotes || []);
      }
      await refreshBillAndCategories();

      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    } catch (err: any) {
      setSelectionError(err?.message || 'Failed to select vendor quotation. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  // Handle Removing a Selected Quotation from Bill
  const handleRemoveSelection = async (quoteId: number, categoryName: string) => {
    try {
      await royalKnotApi.unselectVendor(quoteId);
      setToastMessage(`✓ Selection for "${categoryName}" removed from your wedding bill.`);
      setTimeout(() => setToastMessage(null), 5000);

      if (selectedCategory) {
        const updatedQuotes = await royalKnotApi.getQuotationsByCategory(selectedCategory.name);
        setCategoryQuotes(updatedQuotes || []);
      }
      await refreshBillAndCategories();
    } catch (err: any) {
      alert(err?.message || 'Failed to remove selection');
    }
  };

  // Handle Quotation Request from Lead Planner
  const handleRequestQuotationSubmit = async () => {
    if (!requestModalCategory) return;
    setIsSubmittingRequest(true);
    try {
      await royalKnotApi.requestQuotation(
        requestModalCategory.name,
        requestNotes,
        'Aanya Sharma & Arjun Mehta'
      );
      setRequestSuccess(`Quotation request for "${requestModalCategory.name}" transmitted to Lead Planner Ishaani Sharma.`);
      setTimeout(() => {
        setRequestSuccess(null);
        setRequestModalCategory(null);
        setRequestNotes('');
      }, 3000);
    } catch (err: any) {
      alert(err?.message || 'Failed to transmit quotation request');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  // Handle Recording Milestone Payment
  const handleRecordMilestonePayment = async () => {
    setIsSubmittingPayment(true);
    try {
      await royalKnotApi.recordPayment(
        paymentAmount,
        paymentMilestone,
        `TXN-PAY-${Date.now()}`
      );
      setShowPaymentModal(false);
      setToastMessage(`✓ Payment of ₹${paymentAmount.toLocaleString('en-IN')} successfully recorded!`);
      setTimeout(() => setToastMessage(null), 5000);
      await refreshBillAndCategories();

      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch (e) {}
    } catch (err: any) {
      alert(err?.message || 'Failed to record payment');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleSignAgreement = async () => {
    if (!agreement) return;
    try {
      const mockSignatureData = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="35" font-family="cursive" font-size="28" fill="%23801428">${signatureName}</text></svg>`;
      const updated = await royalKnotApi.signAgreement(agreement.id, mockSignatureData, signatureName);
      setAgreement(updated);
      setSignatureConfirmed(true);
      try {
        confetti({ particleCount: 90, spread: 60 });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveExpense = async (expenseId: number) => {
    if (approvingExpenseId !== null) return;
    try {
      setApprovingExpenseId(expenseId);
      const updatedInvoice = await royalKnotApi.approveExpense(expenseId);
      setInvoice(updatedInvoice);
      await refreshBillAndCategories();
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setApprovingExpenseId(null);
    }
  };

  const formatCurrency = (amt: number | undefined | null) => {
    if (amt === undefined || amt === null) return '₹0';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Helper for Category Icons
  const getCategoryIcon = (categoryName: string) => {
    const n = categoryName.toLowerCase();
    if (n.includes('venue') || n.includes('resort')) return <Building className="w-5 h-5 text-amber-700" />;
    if (n.includes('mandap') || n.includes('stage')) return <Sparkles className="w-5 h-5 text-rose-700" />;
    if (n.includes('floral') || n.includes('garland')) return <Flower2 className="w-5 h-5 text-rose-600" />;
    if (n.includes('tent') || n.includes('shamiana')) return <Tent className="w-5 h-5 text-amber-800" />;
    if (n.includes('lighting') || n.includes('power')) return <Zap className="w-5 h-5 text-yellow-600" />;
    if (n.includes('catering') || n.includes('food')) return <Utensils className="w-5 h-5 text-orange-700" />;
    if (n.includes('sweet') || n.includes('mithai') || n.includes('cake')) return <Gift className="w-5 h-5 text-amber-600" />;
    if (n.includes('photography') || n.includes('photo')) return <Camera className="w-5 h-5 text-indigo-700" />;
    if (n.includes('mehendi')) return <Palette className="w-5 h-5 text-emerald-700" />;
    if (n.includes('pandit') || n.includes('purohit') || n.includes('puja') || n.includes('ritual') || n.includes('astrologer')) return <Flame className="w-5 h-5 text-rose-700" />;
    if (n.includes('music') || n.includes('band') || n.includes('dhol') || n.includes('sangeet')) return <Music className="w-5 h-5 text-purple-700" />;
    if (n.includes('dj') || n.includes('sound')) return <Disc className="w-5 h-5 text-indigo-800" />;
    if (n.includes('car') || n.includes('transport')) return <Car className="w-5 h-5 text-blue-700" />;
    if (n.includes('security') || n.includes('valet')) return <Shield className="w-5 h-5 text-slate-700" />;
    return <Sparkles className="w-5 h-5 text-champagne-700" />;
  };

  // Helper for Quotation Images
  const getQuotationImage = (quote: VendorQuotation) => {
    const cat = (quote.serviceCategory || '').toLowerCase();
    const pkg = (quote.packageTitle || '').toLowerCase();
    if (cat.includes('catering')) {
      if (pkg.includes('rajasthani') || pkg.includes('mewari')) {
        return 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80';
      }
      if (pkg.includes('nizami') || pkg.includes('fusion')) {
        return 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=600&q=80';
      }
      return 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('mandap') || cat.includes('decor')) {
      if (pkg.includes('temple') || pkg.includes('dakshin')) {
        return 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=600&q=80';
      }
      if (pkg.includes('pastel') || pkg.includes('dome')) {
        return 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80';
      }
      return 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('photography') || cat.includes('videography')) {
      if (pkg.includes('drone') || pkg.includes('candid')) {
        return 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80';
      }
      return 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('mehendi')) {
      return 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('pandit') || cat.includes('ritual') || cat.includes('ceremony')) {
      return 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('music') || cat.includes('entertainment') || cat.includes('shehnai')) {
      return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80';
  };

  // Filter Categories
  const filteredCategories = categories.filter((cat) => {
    // 1. Text Search
    const matchesSearch =
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.collectionName.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Collection filter
    const matchesCollection = selectedCollection === 'ALL' || cat.collectionCode === selectedCollection;

    // 3. Quick mode filter
    let matchesMode = true;
    if (filterMode === 'ESSENTIAL') matchesMode = cat.isEssential;
    if (filterMode === 'SELECTED') matchesMode = Boolean(cat.isSelected);

    return matchesSearch && matchesCollection && matchesMode;
  });

  // Calculate bill metrics dynamically
  const billSummary = itemizedBill?.summary || {
    subtotal: 0,
    totalAdditionalCharges: 0,
    totalTaxes: 0,
    totalDiscount: 0,
    totalLineItems: 0,
    approvedExpensesTotal: 0,
    totalWeddingServiceAmount: Number(invoice?.finalClientAmount || 0),
    amountAlreadyPaid: Number(invoice?.amountReceived || 0),
    outstandingBalance: Number(invoice?.outstandingBalance || 0),
  };

  const selectedCategoriesCount = categories.filter((c) => c.isSelected).length;

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-emerald-900 text-champagne-200 shadow-2xl border border-emerald-400/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-xs font-serif font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Couple Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 text-white shadow-2xl border border-champagne-400/40">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80')` }}
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-500/30">
                <Heart className="w-3.5 h-3.5 fill-current" />
                Couple Wedding Portal &bull; Royal Rajasthani Palace Celebration
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                The Sharma & Mehta Wedding &bull; City Palace, Udaipur
              </h1>
              <p className="text-xs sm:text-sm text-champagne-200/90 mt-1">
                Aanya Sharma & Arjun Mehta &bull; Royal Mewari Heritage &bull; 400 Royal Guests &bull; {selectedCategoriesCount} of 39 Services Configured
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <div className="text-[10px] text-champagne-300 uppercase tracking-widest">Confirmed Services</div>
                <div className="font-serif text-xl font-bold text-champagne-200">{selectedCategoriesCount} / 39</div>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
                <div className="text-[10px] text-champagne-300 uppercase tracking-widest">Muhurtham Countdown</div>
                <div className="font-serif text-xl font-bold text-white">92 Days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-champagne-200 pb-2 overflow-x-auto">
          {/* TAB 1: Wedding Services Marketplace */}
          <button
            onClick={() => {
              setActiveTab('services');
              setSelectedCategory(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'services'
                ? 'bg-burgundy-950 text-champagne-200 shadow-lg ring-2 ring-champagne-400/50'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <Layers className="w-4 h-4 text-champagne-400" />
            <span>WEDDING SERVICES DIRECTORY (39)</span>
          </button>

          {/* TAB 2: Dedicated MY WEDDING BILL (Itemized Billing) */}
          <button
            onClick={() => {
              setActiveTab('bill');
              refreshBillAndCategories();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 relative ${
              activeTab === 'bill'
                ? 'bg-burgundy-950 text-champagne-200 shadow-lg ring-2 ring-champagne-400/50'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span>MY WEDDING BILL</span>
            {selectedCategoriesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                {selectedCategoriesCount}
              </span>
            )}
          </button>

          {/* TAB 3: Digital Service Agreement */}
          <button
            onClick={() => setActiveTab('agreement')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'agreement'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            <span>Digital Service Agreement</span>
          </button>

          {/* TAB 4: Invoicing & Additions */}
          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'invoice'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments & Additional Expenses</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* VIEW 1: WEDDING SERVICES MARKETPLACE                           */}
        {/* ============================================================== */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-in fade-in">

            {/* If NO category selected: SHOW THE CATEGORY DIRECTORY FIRST */}
            {!selectedCategory ? (
              <div className="space-y-6">
                
                {/* Header Banner */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-lg space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                        Hindu Wedding Service Marketplace &bull; Client Selection Authority
                      </span>
                      <h2 className="font-serif text-2xl sm:text-3xl font-black text-burgundy-950 mt-0.5">
                        SELECT A WEDDING SERVICE CATEGORY
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                        Browse all 39 Hindu wedding vendor categories organized into 7 ceremonial collections. Click any category to compare tailored proposals, select a vendor, and add it directly to your live itemized wedding bill.
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab('bill')}
                        className="px-4 py-2.5 rounded-xl bg-champagne-100 hover:bg-champagne-200 text-burgundy-950 border border-champagne-300 font-serif font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
                      >
                        <Receipt className="w-4 h-4 text-emerald-700" />
                        <span>View My Wedding Bill ({selectedCategoriesCount} items) &rarr;</span>
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters Bar */}
                  <div className="pt-2 border-t border-champagne-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search 39 categories (e.g. Mandap, Catering, Mehendi, Pandit)..."
                        className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-champagne-300 bg-champagne-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Quick Mode Filters */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setFilterMode('ALL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          filterMode === 'ALL'
                            ? 'bg-burgundy-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All (39)
                      </button>
                      <button
                        onClick={() => setFilterMode('ESSENTIAL')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          filterMode === 'ESSENTIAL'
                            ? 'bg-burgundy-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        Essential Only
                      </button>
                      <button
                        onClick={() => setFilterMode('SELECTED')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          filterMode === 'SELECTED'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        <span>Configured in Bill ({selectedCategoriesCount})</span>
                      </button>
                    </div>
                  </div>

                  {/* Collection Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                    {[
                      { code: 'ALL', label: 'All Collections' },
                      { code: 'A', label: 'A. Venue & Decor' },
                      { code: 'B', label: 'B. Food & Hospitality' },
                      { code: 'C', label: 'C. Photography' },
                      { code: 'D', label: 'D. Bridal & Groom' },
                      { code: 'E', label: 'E. Hindu Rituals' },
                      { code: 'F', label: 'F. Entertainment' },
                      { code: 'G', label: 'G. Travel & Logistics' },
                    ].map((col) => (
                      <button
                        key={col.code}
                        onClick={() => setSelectedCollection(col.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold whitespace-nowrap transition-all ${
                          selectedCollection === col.code
                            ? 'bg-champagne-200 text-burgundy-950 shadow-xs border border-champagne-400'
                            : 'text-slate-600 hover:bg-champagne-50'
                        }`}
                      >
                        {col.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 39 Categories Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCategories.map((cat) => {
                    const isConfigured = Boolean(cat.isSelected);

                    return (
                      <div
                        key={cat.id}
                        onClick={() => handleSelectCategory(cat)}
                        className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 hover:shadow-xl ${
                          isConfigured
                            ? 'bg-emerald-50/40 border-emerald-400 ring-2 ring-emerald-300/60 shadow-md'
                            : 'bg-white border-champagne-200/90 hover:border-champagne-400 shadow-xs'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Card Top Pill */}
                          <div className="flex items-center justify-between">
                            <span className="px-2.5 py-0.5 rounded-full bg-champagne-100 text-champagne-800 text-[10px] font-bold uppercase tracking-wider border border-champagne-300 flex items-center gap-1.5">
                              {getCategoryIcon(cat.name)}
                              <span>Col {cat.collectionCode}</span>
                            </span>

                            {cat.isEssential ? (
                              <span className="text-[10px] font-bold text-burgundy-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                Core Essential
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                                Optional Service
                              </span>
                            )}
                          </div>

                          {/* Category Title */}
                          <div>
                            <h3 className="font-serif text-lg font-bold text-burgundy-950 group-hover:text-burgundy-800 transition-colors">
                              {cat.name}
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {cat.description}
                            </p>
                          </div>

                          {/* Selection Status or Quotation Availability Indicator */}
                          {isConfigured ? (
                            <div className="p-2.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs space-y-0.5">
                              <div className="flex items-center gap-1.5 font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Configured in Wedding Bill</span>
                              </div>
                              <div className="text-[11px] text-emerald-800 truncate">
                                Vendor: <strong>{cat.selectedVendor}</strong> &bull; {formatCurrency(cat.selectedAmount)}
                              </div>
                            </div>
                          ) : (
                            <div className="p-2 rounded-xl bg-champagne-50/60 border border-champagne-200/60 text-[11px] text-slate-600 flex items-center justify-between">
                              <span>Bids Available:</span>
                              <span className="font-bold text-burgundy-900">
                                {(cat.quotationCount || 0) > 0 ? `${cat.quotationCount} Custom Proposals` : 'Available on Request'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Bottom CTA */}
                        <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-serif font-bold">
                          <span className={isConfigured ? 'text-emerald-800' : 'text-burgundy-900 group-hover:text-burgundy-950'}>
                            {isConfigured ? 'Review or Modify Selection' : 'Browse Quotations'}
                          </span>
                          <span className="w-7 h-7 rounded-full bg-champagne-100 group-hover:bg-champagne-200 flex items-center justify-center text-burgundy-950 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filteredCategories.length === 0 && (
                  <div className="text-center p-12 bg-white rounded-3xl border border-champagne-200 text-slate-500 space-y-3">
                    <Search className="w-8 h-8 text-slate-400 mx-auto" />
                    <h3 className="font-serif text-lg font-bold text-slate-700">No categories matching your filter</h3>
                    <p className="text-xs text-slate-500">Try resetting your search query or collection filter to see all 39 Hindu wedding categories.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCollection('ALL');
                        setFilterMode('ALL');
                      }}
                      className="px-4 py-2 rounded-xl bg-burgundy-900 text-white text-xs font-serif font-bold"
                    >
                      Reset Category Filters
                    </button>
                  </div>
                )}

              </div>
            ) : (
              /* CATEGORY QUOTATION BROWSING (When a category is active) */
              <div className="space-y-6">
                
                {/* Top Breadcrumb & Return Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-champagne-300 shadow-md">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleBackToCategories}
                      className="px-3.5 py-2 rounded-xl bg-champagne-100 hover:bg-champagne-200 text-burgundy-950 border border-champagne-300 text-xs font-serif font-bold flex items-center gap-1.5 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to All Categories</span>
                    </button>
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-champagne-700 block">
                        Collection {selectedCategory.collectionCode} &bull; {selectedCategory.collectionName}
                      </span>
                      <h2 className="font-serif text-2xl font-bold text-burgundy-950">
                        {selectedCategory.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('bill')}
                      className="px-4 py-2 rounded-xl bg-burgundy-950 text-champagne-200 font-serif font-bold text-xs shadow-md hover:bg-burgundy-900 transition-all flex items-center gap-2"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                      <span>My Wedding Bill ({selectedCategoriesCount})</span>
                    </button>
                  </div>
                </div>

                {/* Category Context & Description Banner */}
                <div className="bg-gradient-to-r from-champagne-50 via-white to-champagne-50 p-6 rounded-2xl border border-champagne-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-burgundy-900 uppercase tracking-wider">
                      Ceremonial Service Scope
                    </span>
                    <p className="text-xs text-slate-700 max-w-3xl leading-relaxed">
                      {selectedCategory.description}
                    </p>
                  </div>

                  {selectedCategory.isSelected && (
                    <div className="bg-emerald-100/90 border border-emerald-400 px-4 py-2 rounded-xl text-emerald-900 text-xs shrink-0 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>
                        Active Selection: <strong>{selectedCategory.selectedVendor}</strong> ({formatCurrency(selectedCategory.selectedAmount)})
                      </span>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {selectionError && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{selectionError}</span>
                  </div>
                )}

                {/* Loading State */}
                {loadingQuotes ? (
                  <div className="p-12 text-center font-serif text-burgundy-900 font-bold animate-pulse text-sm">
                    Loading tailored vendor proposals for {selectedCategory.name}...
                  </div>
                ) : categoryQuotes.length > 0 ? (
                  /* Quotations Grid for this category */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif text-lg font-bold text-burgundy-950">
                        Available Vendor Proposals ({categoryQuotes.length})
                      </h3>
                      <span className="text-xs text-slate-500 font-medium">
                        Select exactly 1 quotation for your wedding bill
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {categoryQuotes.map((quote) => {
                        const isAccepted = quote.status === 'ACCEPTED' || quote.status === 'SELECTED';
                        const isRejectedOrClosed = quote.status === 'REJECTED' || quote.status === 'CLOSED';
                        const isFixed = quote.pricingModel === 'FIXED';

                        return (
                          <div
                            key={quote.id}
                            className={`rounded-2xl p-6 border flex flex-col justify-between transition-all overflow-hidden ${
                              isAccepted
                                ? 'border-emerald-500 bg-emerald-50/40 shadow-xl ring-2 ring-emerald-400'
                                : isRejectedOrClosed
                                ? 'border-slate-200 bg-slate-50/70 opacity-80'
                                : 'border-champagne-300 bg-white shadow-md hover:shadow-lg'
                            }`}
                          >
                            <div>
                              {/* Hero Image Header */}
                              <div className="relative h-32 -mx-6 -mt-6 mb-4 overflow-hidden">
                                <img
                                  src={getQuotationImage(quote)}
                                  alt={quote.packageTitle || quote.vendorName}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-burgundy-950/80 backdrop-blur-xs border border-champagne-400/40 text-champagne-300">
                                    {isFixed ? 'Fixed Package' : 'Per-Plate Service'}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                      isAccepted
                                        ? 'bg-emerald-600 text-white'
                                        : isRejectedOrClosed
                                        ? 'bg-slate-700 text-slate-300'
                                        : 'bg-burgundy-900/90 text-champagne-200 border border-champagne-400/40'
                                    }`}
                                  >
                                    {quote.status}
                                  </span>
                                </div>
                              </div>

                              {/* Vendor Name & Package Title */}
                              <span className="text-[11px] font-bold uppercase tracking-wider text-champagne-700 block">
                                {quote.vendorName}
                              </span>
                              <h4 className="font-serif text-xl font-bold text-burgundy-950 mt-0.5">
                                {quote.packageTitle || quote.vendorName}
                              </h4>
                              <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-3">
                                {quote.description}
                              </p>

                              {/* Specialization / Cuisine */}
                              {quote.regionalSpecialization && (
                                <div className="my-2.5 p-2 rounded-lg bg-champagne-50/60 border border-champagne-200/60 text-[11px] space-y-0.5">
                                  <div>
                                    <span className="text-slate-500">Specialization: </span>
                                    <strong className="text-burgundy-900">{quote.regionalSpecialization}</strong>
                                  </div>
                                </div>
                              )}

                              {/* Pricing Breakdown Formula */}
                              <div className="bg-champagne-50/80 rounded-xl p-3.5 my-3 border border-champagne-200/70 space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-600">
                                  <span>{isFixed ? 'Base Package Rate:' : 'Price Per Plate:'}</span>
                                  <strong className="text-slate-900">{formatCurrency(quote.pricePerPlate)}</strong>
                                </div>
                                {!isFixed && (
                                  <div className="flex justify-between text-slate-600">
                                    <span>Guaranteed Headcount:</span>
                                    <strong className="text-slate-900">{quote.guestCount} Guests</strong>
                                  </div>
                                )}
                                <div className="flex justify-between text-slate-600">
                                  <span>Base Amount:</span>
                                  <span>{formatCurrency(isFixed ? quote.pricePerPlate : quote.pricePerPlate * quote.guestCount)}</span>
                                </div>
                                {Number(quote.additionalCharges) > 0 && (
                                  <div className="flex justify-between text-slate-600">
                                    <span>Live Stations / Additions:</span>
                                    <span>+{formatCurrency(quote.additionalCharges)}</span>
                                  </div>
                                )}
                                {Number(quote.taxAmount) > 0 && (
                                  <div className="flex justify-between text-slate-500 text-[11px]">
                                    <span>Statutory Taxes (GST):</span>
                                    <span>+{formatCurrency(quote.taxAmount)}</span>
                                  </div>
                                )}
                                <div className="pt-2 border-t border-champagne-200 flex justify-between font-bold text-burgundy-900 text-sm">
                                  <span>Total Line Item:</span>
                                  <span className="font-serif font-extrabold text-base">
                                    {formatCurrency(quote.totalEstimatedPrice)}
                                  </span>
                                </div>
                              </div>

                              {/* Inclusions */}
                              <div className="text-[11px] space-y-1 text-slate-700">
                                <div>
                                  <strong className="text-slate-800">Inclusions: </strong>
                                  <span className="text-slate-600">{quote.serviceInclusions}</span>
                                </div>
                                {quote.exclusions && (
                                  <div>
                                    <strong className="text-slate-800">Exclusions: </strong>
                                    <span className="text-rose-700">{quote.exclusions}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Card Footer Selection Buttons */}
                            <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                              {isAccepted ? (
                                <div className="space-y-1.5">
                                  <div className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-serif font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                                    <Check className="w-4 h-4" />
                                    <span>Active in Your Wedding Bill</span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveSelection(quote.id, quote.serviceCategory)}
                                    className="w-full py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-[11px] font-semibold transition-all flex items-center justify-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>Remove from Wedding Bill</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    const hasOtherAccepted = categoryQuotes.some(
                                      (q) => q.status === 'ACCEPTED' || q.status === 'SELECTED'
                                    );
                                    setConfirmModalQuote({ quote, isReplacing: hasOtherAccepted });
                                  }}
                                  className="w-full py-2.5 rounded-xl bg-burgundy-900 hover:bg-burgundy-950 text-champagne-200 font-serif font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                                >
                                  <span>
                                    {categoryQuotes.some((q) => q.status === 'ACCEPTED' || q.status === 'SELECTED')
                                      ? 'Replace Active Selection'
                                      : 'Select This Quotation'}
                                  </span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Empty state for category with no quotations */
                  <div className="bg-white rounded-3xl p-12 border border-champagne-300 shadow-md text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-champagne-100 text-champagne-800 flex items-center justify-center mx-auto">
                      {getCategoryIcon(selectedCategory.name)}
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-burgundy-950">
                        No quotations currently available for {selectedCategory.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl mx-auto leading-relaxed">
                        THE ROYAL KNOT maintains a network of vetted Hindu wedding artisans across Rajasthan, Hyderabad, and South India. You can submit an immediate on-demand request to your Lead Planner (Ishaani Sharma) to source tailored quotations for this category.
                      </p>
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={() => setRequestModalCategory(selectedCategory)}
                        className="px-6 py-3 rounded-xl bg-burgundy-900 hover:bg-burgundy-950 text-champagne-200 font-serif font-bold text-xs shadow-md transition-all flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Request Custom Quotation from Lead Planner</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: DEDICATED "MY WEDDING BILL" (Itemized Billing)          */}
        {/* ============================================================== */}
        {activeTab === 'bill' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Bill Financial Summary Top Banner */}
            <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 text-white shadow-2xl border border-champagne-400/40">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-300 font-bold">
                    Official Wedding Statement &bull; Live Ledger Reconciled
                  </span>
                  <h2 className="font-serif text-3xl font-extrabold text-white mt-1">
                    MY WEDDING BILL
                  </h2>
                  <p className="text-xs sm:text-sm text-champagne-200/80 mt-1">
                    Itemized Hindu Wedding Services breakdown for Aanya Sharma & Arjun Mehta &bull; City Palace, Udaipur
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('services');
                      setSelectedCategory(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-champagne-400/20 hover:bg-champagne-400/30 text-champagne-200 border border-champagne-400/40 font-serif font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add More Services (39 Categories)</span>
                  </button>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="px-4 py-2.5 rounded-xl bg-champagne-300 hover:bg-champagne-200 text-burgundy-950 font-serif font-bold text-xs shadow-md transition-all flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Record Milestone Payment</span>
                  </button>
                </div>
              </div>

              {/* 5 Financial Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] text-champagne-300 uppercase tracking-widest block font-bold">Total Service Bill</span>
                  <div className="font-serif text-2xl font-black text-white mt-1">
                    {formatCurrency(billSummary.totalWeddingServiceAmount)}
                  </div>
                  <span className="text-[10px] text-champagne-200/70 block mt-0.5">Dynamic Grand Total</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] text-champagne-300 uppercase tracking-widest block font-bold">Base Services</span>
                  <div className="font-serif text-2xl font-bold text-white mt-1">
                    {formatCurrency(billSummary.subtotal)}
                  </div>
                  <span className="text-[10px] text-champagne-200/70 block mt-0.5">Quoted Base Packages</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] text-champagne-300 uppercase tracking-widest block font-bold">Statutory Taxes (GST)</span>
                  <div className="font-serif text-2xl font-bold text-white mt-1">
                    {formatCurrency(billSummary.totalTaxes)}
                  </div>
                  <span className="text-[10px] text-champagne-200/70 block mt-0.5">Stored Tax Details</span>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <span className="text-[10px] text-emerald-300 uppercase tracking-widest block font-bold">Amount Paid</span>
                  <div className="font-serif text-2xl font-bold text-emerald-300 mt-1">
                    {formatCurrency(billSummary.amountAlreadyPaid)}
                  </div>
                  <span className="text-[10px] text-emerald-200/70 block mt-0.5">Milestone Receipts</span>
                </div>

                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border-2 border-champagne-400/60 shadow-lg">
                  <span className="text-[10px] text-champagne-300 uppercase tracking-widest block font-bold">Outstanding Balance</span>
                  <div className="font-serif text-2xl font-black text-champagne-300 mt-1">
                    {formatCurrency(billSummary.outstandingBalance)}
                  </div>
                  <span className="text-[10px] text-champagne-200 block mt-0.5 font-semibold">Payable to Date</span>
                </div>
              </div>
            </div>

            {/* Itemized Line Items Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-champagne-100 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-burgundy-950">
                    Confirmed Service Line Items
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Every accepted quotation appears here as an official line item in your wedding billing ledger.
                  </p>
                </div>

                <span className="text-xs font-bold text-burgundy-900 bg-champagne-100 px-3 py-1 rounded-full border border-champagne-300">
                  {itemizedBill?.lineItems.length || 0} Line Items Active
                </span>
              </div>

              {(!itemizedBill?.lineItems || itemizedBill.lineItems.length === 0) ? (
                <div className="p-12 text-center bg-champagne-50/50 rounded-2xl border border-champagne-200 space-y-3">
                  <Receipt className="w-10 h-10 text-champagne-700 mx-auto" />
                  <h4 className="font-serif text-lg font-bold text-burgundy-950">No Services Configured in Bill Yet</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    You have not selected any category quotations yet. Open the Wedding Services directory to compare and select catering, mandap decor, photography, and rituals.
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab('services');
                      setSelectedCategory(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-burgundy-900 text-champagne-200 font-serif font-bold text-xs shadow-md"
                  >
                    Browse Wedding Services Directory &rarr;
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Service Category</th>
                        <th className="py-3 px-4">Selected Vendor & Package</th>
                        <th className="py-3 px-4">Pricing Model</th>
                        <th className="py-3 px-4">Unit Rate</th>
                        <th className="py-3 px-4">Quantity / Units</th>
                        <th className="py-3 px-4">Base Amount</th>
                        <th className="py-3 px-4">Extras & Taxes</th>
                        <th className="py-3 px-4 font-serif text-burgundy-950">Line Total</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {itemizedBill.lineItems.map((item) => (
                        <tr key={item.id} className="hover:bg-champagne-50/40 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-burgundy-950 flex items-center gap-1.5">
                            {getCategoryIcon(item.category)}
                            <span>{item.category}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <strong className="text-slate-900 block">{item.vendorName}</strong>
                            <span className="text-[11px] text-slate-500">{item.packageTitle}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {item.pricingModel === 'FIXED' ? 'Fixed Service' : 'Per-Plate'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-semibold">
                            {item.pricingModel === 'FIXED' ? '1 Flat Unit' : `${item.quantity} Guests`}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-900">
                            {formatCurrency(item.baseAmount)}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-slate-600">
                            <div>Extras: +{formatCurrency(item.additionalCharges)}</div>
                            <div>Tax: +{formatCurrency(item.taxAmount)}</div>
                          </td>
                          <td className="py-3.5 px-4 font-serif font-black text-burgundy-950 text-sm">
                            {formatCurrency(item.lineTotal)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => {
                                const matchingCategory = categories.find((c) => c.name.toLowerCase() === item.category.toLowerCase()) || {
                                  id: item.category.toLowerCase().replace(/\s+/g, '-'),
                                  name: item.category,
                                  collectionCode: 'A' as any,
                                  collectionName: 'Service',
                                  description: 'Wedding service',
                                  isEssential: true,
                                  defaultPricingModel: item.pricingModel,
                                };
                                setActiveTab('services');
                                handleSelectCategory(matchingCategory);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-champagne-100 hover:bg-champagne-200 text-burgundy-900 text-[11px] font-bold border border-champagne-300 mr-2 transition-all"
                            >
                              Change
                            </button>
                            <button
                              onClick={() => {
                                if (item.quotationId) {
                                  handleRemoveSelection(item.quotationId, item.category);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold border border-rose-200 transition-all"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Dynamic Mathematical Reconciliation Summary Box */}
              <div className="mt-6 pt-6 border-t border-champagne-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Approved Additional Expenses Table */}
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-serif font-bold text-xs uppercase tracking-wider text-slate-800">
                      Approved Additional Service Scope
                    </span>
                    <span className="text-[11px] text-slate-500">
                      +{formatCurrency(billSummary.approvedExpensesTotal)}
                    </span>
                  </div>

                  {expenses.filter((e) => e.clientApprovalStatus === 'Approved').length === 0 ? (
                    <p className="text-xs text-slate-500 italic">No extra expenses approved outside quotations.</p>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {expenses
                        .filter((e) => e.clientApprovalStatus === 'Approved')
                        .map((exp) => (
                          <div key={exp.id} className="flex justify-between items-center text-slate-700">
                            <div>
                              <strong className="block text-slate-900">{exp.itemDescription}</strong>
                              <span className="text-[10px] text-slate-500">{exp.category} &bull; {exp.reason}</span>
                            </div>
                            <span className="font-serif font-bold text-slate-900">+{formatCurrency(exp.amount)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Final Bill Reconciliation Calculation Box */}
                <div className="bg-champagne-50/90 p-5 rounded-2xl border border-champagne-300 space-y-2 text-xs">
                  <h4 className="font-serif font-bold text-sm text-burgundy-950 border-b border-champagne-200 pb-2">
                    Mathematical Ledger Reconciliation Formula
                  </h4>
                  
                  <div className="flex justify-between text-slate-600">
                    <span>Base Selected Services Subtotal:</span>
                    <strong className="text-slate-900">{formatCurrency(billSummary.subtotal)}</strong>
                  </div>
                  
                  <div className="flex justify-between text-slate-600">
                    <span>Live Stations & Additional Surcharges:</span>
                    <span>+{formatCurrency(billSummary.totalAdditionalCharges)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Statutory Taxes (GST from stored data):</span>
                    <span>+{formatCurrency(billSummary.totalTaxes)}</span>
                  </div>

                  {billSummary.approvedExpensesTotal > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Approved Additional Expenses:</span>
                      <span>+{formatCurrency(billSummary.approvedExpensesTotal)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-champagne-300 flex justify-between font-bold text-burgundy-900 text-sm">
                    <span>Total Confirmed Wedding Service Amount:</span>
                    <span className="font-serif font-extrabold text-base">
                      {formatCurrency(billSummary.totalWeddingServiceAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between text-emerald-800 text-xs">
                    <span>Less: Milestone Payments Received:</span>
                    <span>-{formatCurrency(billSummary.amountAlreadyPaid)}</span>
                  </div>

                  <div className="pt-2 border-t border-burgundy-900/20 flex justify-between font-extrabold text-burgundy-950 text-base">
                    <span>Outstanding Payable Balance:</span>
                    <span className="font-serif text-lg text-burgundy-950">
                      {formatCurrency(billSummary.outstandingBalance)}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: DIGITAL SERVICE AGREEMENT                             */}
        {/* ============================================================== */}
        {activeTab === 'agreement' && agreement && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-200 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Legally Binding Digital Contract &bull; Module 4
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                    Wedding Planning & Management Agreement
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Agreement No: <strong>{agreement.agreementNumber}</strong> &bull; Client: {agreement.clientNames}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    agreement.status === 'Signed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}
                >
                  Status: {agreement.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-champagne-50/60 p-4 rounded-xl border border-champagne-200">
                <div>
                  <span className="text-slate-500 block">Wedding Package:</span>
                  <strong className="text-slate-900 text-sm">{agreement.packageName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Fixed Planning Investment:</span>
                  <strong className="text-burgundy-900 text-sm font-serif">
                    {formatCurrency(agreement.agreedPrice)}
                  </strong>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <strong className="text-slate-800 uppercase tracking-wide block">Comprehensive Service Scope:</strong>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed text-slate-700">
                  {agreement.serviceScope}
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <strong className="text-slate-800 uppercase tracking-wide block">Terms & Milestone Clauses:</strong>
                <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 leading-relaxed text-slate-700 whitespace-pre-line">
                  {agreement.termsAndConditions}
                </p>
              </div>

              {agreement.status === 'Signed' ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-900 font-bold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>Agreement Digitally Signed & Locked</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Signed on {formatDate(agreement.signedTimestamp)} by {signatureName}
                    </p>
                  </div>
                  <div className="font-serif italic text-2xl text-burgundy-900 font-bold border-b-2 border-burgundy-900 px-4">
                    {signatureName}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-champagne-50 border border-champagne-300 space-y-4">
                  <div className="flex items-center gap-2 text-burgundy-950 font-serif font-bold text-sm">
                    <FileSignature className="w-4 h-4 text-burgundy-800" />
                    <span>Authorize with Digital Signature</span>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Signer Legal Name:</label>
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-champagne-300 bg-white"
                    />
                  </div>
                  <button
                    onClick={handleSignAgreement}
                    className="w-full py-2.5 rounded-xl bg-burgundy-900 hover:bg-burgundy-950 text-champagne-200 font-serif font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Affix Digital Signature & Confirm Agreement</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: PAYMENTS & ADDITIONAL EXPENSES                        */}
        {/* ============================================================== */}
        {activeTab === 'invoice' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-200 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Financial Auditing &bull; Module 8 & 9
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                    Payments & Expense Reconciliations
                  </h2>
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="px-4 py-2 rounded-xl bg-burgundy-900 text-champagne-200 font-serif font-bold text-xs shadow-md hover:bg-burgundy-950 transition-all flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Make Milestone Payment</span>
                </button>
              </div>

              {/* Additional Expenses Approval Section */}
              <div className="space-y-3">
                <h3 className="font-serif text-base font-bold text-burgundy-950">
                  Additional Scope Approvals
                </h3>
                <div className="space-y-2">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50"
                    >
                      <div>
                        <strong className="text-slate-900 text-xs block">{expense.itemDescription}</strong>
                        <span className="text-[11px] text-slate-500">
                          {expense.category} &bull; {expense.reason}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-serif font-bold text-sm text-burgundy-950">
                          {formatCurrency(expense.amount)}
                        </span>
                        {expense.clientApprovalStatus === 'Pending Approval' ? (
                          <button
                            disabled={approvingExpenseId === expense.id}
                            onClick={() => handleApproveExpense(expense.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs"
                          >
                            {approvingExpenseId === expense.id ? 'Approving...' : 'Approve Addition'}
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            Approved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Schedule Table */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="font-serif text-base font-bold text-burgundy-950">
                  Milestone Payment Schedule
                </h3>
                <div className="space-y-2">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-white text-xs"
                    >
                      <div>
                        <strong className="text-slate-900 block">{p.milestoneTitle}</strong>
                        <span className="text-[10px] text-slate-500">
                          Ref: {p.transactionReference || 'PENDING'} &bull; Date: {formatDate(p.paymentDate || p.dueDate)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-serif font-bold text-sm text-slate-900 block">
                          {formatCurrency(p.amountPaid || p.amountDue)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'PAID'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL 1: CONFIRM VENDOR SELECTION / REPLACEMENT                */}
      {/* ============================================================== */}
      {confirmModalQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-champagne-300 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-champagne-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-burgundy-900" />
                <h3 className="font-serif text-lg font-bold text-burgundy-950">
                  {confirmModalQuote.isReplacing ? 'Replace Quotation in Bill' : 'Confirm Vendor Selection'}
                </h3>
              </div>
              <button
                onClick={() => setConfirmModalQuote(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p>
                You are about to select <strong>{confirmModalQuote.quote.vendorName}</strong> for{' '}
                <strong>{confirmModalQuote.quote.serviceCategory}</strong>.
              </p>

              <div className="bg-champagne-50 p-4 rounded-xl border border-champagne-200 space-y-1">
                <div>Package: <strong>{confirmModalQuote.quote.packageTitle}</strong></div>
                <div>
                  Pricing: <strong>{formatCurrency(confirmModalQuote.quote.pricePerPlate)}</strong>{' '}
                  {confirmModalQuote.quote.pricingModel === 'FIXED' ? '(Fixed)' : `× ${confirmModalQuote.quote.guestCount} Guests`}
                </div>
                <div className="pt-1 border-t border-champagne-200 font-bold text-burgundy-900 flex justify-between">
                  <span>Line Item Total:</span>
                  <span>{formatCurrency(confirmModalQuote.quote.totalEstimatedPrice)}</span>
                </div>
              </div>

              {confirmModalQuote.isReplacing && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    This will replace your previous selection in <strong>{confirmModalQuote.quote.serviceCategory}</strong> and automatically recalculate your itemized wedding bill.
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setConfirmModalQuote(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={isSelecting}
                className="px-5 py-2.5 rounded-xl bg-burgundy-900 hover:bg-burgundy-950 text-champagne-200 text-xs font-serif font-bold shadow-md flex items-center gap-1.5"
              >
                {isSelecting ? 'Updating Bill...' : confirmModalQuote.isReplacing ? 'Confirm Replacement' : 'Confirm & Add to Bill'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: REQUEST CUSTOM QUOTATION FROM PLANNER                */}
      {/* ============================================================== */}
      {requestModalCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-champagne-300 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-champagne-100 pb-3">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-burgundy-900" />
                <h3 className="font-serif text-lg font-bold text-burgundy-950">
                  Request Quotations from Lead Planner
                </h3>
              </div>
              <button
                onClick={() => setRequestModalCategory(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p>
                Service Category: <strong>{requestModalCategory.name}</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                Your Lead Planner Ishaani Sharma will reach out to our royal artisan partners and submit verified proposals directly to your dashboard.
              </p>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Specific Requests or Cultural Preferences (Optional):
                </label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="e.g. Specific South Indian instruments, Marwari floral themes, organic ingredients..."
                  className="w-full text-xs p-3 rounded-xl border border-champagne-300 focus:outline-none focus:ring-2 focus:ring-burgundy-900"
                />
              </div>

              {requestSuccess && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{requestSuccess}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setRequestModalCategory(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleRequestQuotationSubmit}
                disabled={isSubmittingRequest}
                className="px-5 py-2.5 rounded-xl bg-burgundy-900 hover:bg-burgundy-950 text-champagne-200 text-xs font-serif font-bold shadow-md flex items-center gap-1.5"
              >
                {isSubmittingRequest ? 'Transmitting...' : 'Transmit Request to Planner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: RECORD MILESTONE PAYMENT                             */}
      {/* ============================================================== */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border-2 border-champagne-300 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-champagne-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-burgundy-900" />
                <h3 className="font-serif text-lg font-bold text-burgundy-950">
                  Record Milestone Payment
                </h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Milestone Description:
                </label>
                <input
                  type="text"
                  value={paymentMilestone}
                  onChange={(e) => setPaymentMilestone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Payment Amount (₹ INR):
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-serif font-bold text-burgundy-950"
                />
              </div>

              <div className="p-3 bg-champagne-50 rounded-xl border border-champagne-200 text-[11px] text-slate-600">
                Payment will be reconciled into your active invoice and reduce your outstanding balance immediately.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordMilestonePayment}
                disabled={isSubmittingPayment}
                className="px-5 py-2.5 rounded-xl bg-burgundy-900 hover:bg-burgundy-950 text-champagne-200 text-xs font-serif font-bold shadow-md flex items-center gap-1.5"
              >
                {isSubmittingPayment ? 'Processing...' : 'Record Payment Now'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
