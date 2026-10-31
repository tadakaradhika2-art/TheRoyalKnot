import React, { useState, useEffect, useRef } from 'react';
import { royalKnotApi } from '../../services/api';
import {
  Agreement,
  VendorQuotation,
  WeddingTask,
  Invoice,
  AdditionalExpense,
  Payment
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
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'selection' | 'agreement' | 'invoice' | 'checklist'>('selection');
  
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [quotes, setQuotes] = useState<VendorQuotation[]>([]);
  const [tasks, setTasks] = useState<WeddingTask[]>([]);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [expenses, setExpenses] = useState<AdditionalExpense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Signature pad states
  const [signatureName, setSignatureName] = useState('Eleanor Vance');
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);
  const [selectingQuoteId, setSelectingQuoteId] = useState<number | null>(null);

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      const [agr, qts, tsks, inv, exps, pmts] = await Promise.all([
        royalKnotApi.getActiveAgreement(),
        royalKnotApi.getCateringQuotations(),
        royalKnotApi.getTasks(),
        royalKnotApi.getLatestInvoice(),
        royalKnotApi.getExpenses(),
        royalKnotApi.getPayments(),
      ]);
      setAgreement(agr);
      setQuotes(qts);
      setTasks(tsks);
      setInvoice(inv);
      setExpenses(exps);
      setPayments(pmts);
    } catch (e) {
      console.error(e);
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

  const handleSelectVendor = async (quoteId: number) => {
    setSelectingQuoteId(quoteId);
    try {
      await royalKnotApi.selectVendor(quoteId);
      await loadClientData();
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setSelectingQuoteId(null);
    }
  };

  const handleApproveExpense = async (expenseId: number) => {
    try {
      const updatedInvoice = await royalKnotApi.approveExpense(expenseId);
      setInvoice(updatedInvoice);
      await loadClientData();
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Couple Hero Banner */}
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 text-white shadow-2xl border border-champagne-400/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Couple Wedding Hub
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              The Sharma Wedding &bull; City Palace, Udaipur
            </h1>
            <p className="text-xs sm:text-sm text-champagne-200/80 mt-1">
              Eleanor Vance & Arjun Sharma &bull; Royal Heritage Theme &bull; 400 Guests
            </p>
          </div>

          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-[10px] text-champagne-300 uppercase tracking-widest">Countdown</div>
              <div className="font-serif text-xl font-bold text-white">92 Days</div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border-b border-champagne-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('selection')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'selection'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Module 7: Compare & Select Vendor</span>
          </button>

          <button
            onClick={() => setActiveTab('agreement')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'agreement'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            <span>Module 5: Digital Service Agreement</span>
          </button>

          <button
            onClick={() => setActiveTab('invoice')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'invoice'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Module 10: Invoicing & Additions</span>
          </button>
        </div>

        {/* TAB 1: Vendor Selection & Closure (Module 7) */}
        {activeTab === 'selection' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <div className="mb-6">
                <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                  Module 7: Final Selection Authority
                </span>
                <h2 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                  Choose Your Royal Wedding Caterer (400 Guests)
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  You have final authority over vendor selection. When you select a caterer, the other quotation requests automatically close and the winning vendor is linked to your wedding.
                </p>
              </div>

              {/* 3 Quotation Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quotes.map((quote) => {
                  const isSelected = quote.status === 'SELECTED';
                  const isClosed = quote.status === 'CLOSED';

                  return (
                    <div
                      key={quote.id}
                      className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-xl ring-2 ring-emerald-400'
                          : isClosed
                          ? 'border-slate-200 bg-slate-50/70 opacity-75'
                          : 'border-champagne-300 bg-white hover:border-champagne-500 shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          {quote.recommended && (
                            <span className="px-2.5 py-0.5 rounded-full bg-champagne-100 text-champagne-800 text-[10px] font-bold uppercase tracking-wider border border-champagne-300">
                              ★ Planner Recommended
                            </span>
                          )}
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isSelected ? 'bg-emerald-600 text-white' :
                            isClosed ? 'bg-slate-200 text-slate-600' :
                            'bg-blue-50 text-blue-700'
                          }`}>
                            {quote.status}
                          </span>
                        </div>

                        <h3 className="font-serif text-xl font-bold text-burgundy-950">
                          {quote.vendorName}
                        </h3>
                        <p className="text-xs font-semibold text-champagne-700 mt-0.5">
                          {quote.cuisineType}
                        </p>

                        <div className="bg-champagne-50/80 rounded-xl p-3 my-4 border border-champagne-200/60 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Price Per Plate:</span>
                            <span className="font-bold text-slate-900">{formatCurrency(quote.pricePerPlate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Guest Count:</span>
                            <span>400 Guests</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Additions (Live Counters):</span>
                            <span>+{formatCurrency(quote.additionalCharges)}</span>
                          </div>
                          <div className="pt-2 border-t border-champagne-200 flex justify-between font-bold text-sm text-burgundy-900">
                            <span>Total Estimated:</span>
                            <span className="font-serif">{formatCurrency(quote.totalEstimatedPrice)}</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-600 space-y-2">
                          <p><strong>Menu Highlights:</strong> {quote.menuDetails}</p>
                          <p><strong>Inclusions:</strong> {quote.serviceInclusions}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        {isSelected ? (
                          <div className="py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirmed Selected Caterer</span>
                          </div>
                        ) : isClosed ? (
                          <div className="py-2.5 rounded-xl bg-slate-100 text-slate-400 font-medium text-xs text-center">
                            Closed (Another Caterer Selected)
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSelectVendor(quote.id)}
                            disabled={selectingQuoteId === quote.id}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-burgundy-900 to-burgundy-700 hover:from-burgundy-950 hover:to-burgundy-800 text-champagne-200 font-serif font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 border border-champagne-400/30"
                          >
                            <span>Select & Book Vendor</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Digital Service Agreement (Module 5) */}
        {activeTab === 'agreement' && agreement && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-champagne-300 shadow-2xl max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-champagne-200">
              <div>
                <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                  Module 5: Digital Service Agreement
                </span>
                <h2 className="font-serif text-2xl font-bold text-burgundy-950">
                  The Royal Knot Service Agreement #{agreement.agreementNumber}
                </h2>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                agreement.status === 'Signed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800'
              }`}>
                {agreement.status}
              </span>
            </div>

            <div className="my-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                This Wedding Planning Service Agreement is executed between <strong>The Royal Knot Luxury Planning Agency</strong> and <strong>{agreement.clientNames}</strong> ({agreement.clientEmail}) for the <strong>{agreement.packageName}</strong> package.
              </p>
              
              <div className="bg-champagne-50/70 rounded-2xl p-5 border border-champagne-200 space-y-2">
                <h4 className="font-serif font-bold text-burgundy-900">Agreed Scope of Luxury Services:</h4>
                <p className="text-xs text-slate-600">{agreement.serviceScope}</p>
                <div className="pt-2 text-xs font-bold text-slate-900 flex justify-between">
                  <span>Agreed Package Consideration:</span>
                  <span className="font-serif text-base text-burgundy-900">{formatCurrency(agreement.agreedPrice)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-burgundy-900 mb-1">Terms & Conditions:</h4>
                <pre className="font-sans text-xs text-slate-600 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {agreement.termsAndConditions}
                </pre>
              </div>
            </div>

            {/* Signature Capture Area */}
            <div className="mt-8 pt-6 border-t border-champagne-200">
              {agreement.status === 'Signed' ? (
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-serif font-bold text-emerald-900 text-lg">Digitally Signed & Persisted</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Signed by <strong>{agreement.clientNames}</strong> on {agreement.signedTimestamp || 'Record'}. Attached to wedding records.
                  </p>
                  {agreement.signatureData && (
                    <div className="mt-4 p-3 bg-white rounded-xl inline-block border border-emerald-200">
                      <img src={agreement.signatureData} alt="Client Signature" className="h-10 mx-auto" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-champagne-50/50 rounded-2xl p-6 border border-champagne-200">
                  <h4 className="font-serif font-bold text-burgundy-950 mb-2">Digital Signature Capture</h4>
                  <p className="text-xs text-slate-500 mb-4">
                    Please confirm your name to affix your digital legal authorization to this agreement.
                  </p>

                  <div className="max-w-md mx-auto space-y-4">
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="Type your full legal name"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-champagne-500"
                    />

                    <button
                      onClick={handleSignAgreement}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-burgundy-900 to-burgundy-700 text-champagne-200 font-serif font-bold text-sm shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-champagne-400/30"
                    >
                      <FileSignature className="w-4 h-4" />
                      <span>Digitally Sign Service Agreement</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Invoicing & Additional Costs (Module 10) */}
        {activeTab === 'invoice' && invoice && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Module 10: Financial Transparency
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                    Wedding Financial Ledger #{invoice.invoiceNumber}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Formula: <code>Final Client Amount = Agreed Package Amount + Approved Additional Costs</code>
                  </p>
                </div>

                <div className="bg-champagne-50 rounded-2xl p-4 border border-champagne-200 text-right">
                  <div className="text-xs text-slate-500">Outstanding Balance</div>
                  <div className="font-serif text-2xl font-black text-rose-700">
                    {formatCurrency(invoice.outstandingBalance)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">Due prior to final reception</div>
                </div>
              </div>

              {/* 4 Financial Figures Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block">Agreed Package</span>
                  <span className="font-serif text-xl font-bold text-slate-900 mt-1 block">
                    {formatCurrency(invoice.agreedPackageAmount)}
                  </span>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <span className="text-[11px] font-semibold text-amber-800 block">Approved Additions</span>
                  <span className="font-serif text-xl font-bold text-amber-900 mt-1 block">
                    +{formatCurrency(invoice.approvedAdditionalCosts)}
                  </span>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <span className="text-[11px] font-semibold text-emerald-800 block">Amount Paid (Deposit + Adv)</span>
                  <span className="font-serif text-xl font-bold text-emerald-900 mt-1 block">
                    {formatCurrency(invoice.amountReceived)}
                  </span>
                </div>

                <div className="bg-burgundy-50 rounded-xl p-4 border border-burgundy-200">
                  <span className="text-[11px] font-semibold text-burgundy-800 block">Total Client Amount</span>
                  <span className="font-serif text-xl font-bold text-burgundy-950 mt-1 block">
                    {formatCurrency(invoice.finalClientAmount)}
                  </span>
                </div>
              </div>

              {/* Chargeable Additions Approval Table */}
              <h3 className="font-serif text-lg font-bold text-burgundy-950 mb-3">
                Chargeable Additions & Client Approvals
              </h3>
              <div className="space-y-3 mb-8">
                {expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{exp.itemDescription}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          {exp.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{exp.reason}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className="font-serif font-bold text-sm text-slate-900">
                        {formatCurrency(exp.amount)}
                      </span>

                      {exp.clientApprovalStatus === 'Approved' ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved & Invoiced</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApproveExpense(exp.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
                        >
                          Approve Addition
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Milestones Table */}
              <h3 className="font-serif text-lg font-bold text-burgundy-950 mb-3">
                Payment Milestones
              </h3>
              <div className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{p.milestoneTitle}</div>
                      <div className="text-[11px] text-slate-400">Due: {p.dueDate || 'Upon Event'}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-slate-900">{formatCurrency(p.amountDue)}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

