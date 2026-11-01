import React, { useState, useEffect } from 'react';
import { royalKnotApi } from '../../services/api';
import { VendorEvent, VendorQuotation } from '../../types';
import {
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  MapPin,
  Utensils,
  Calendar,
  Send,
  Users,
  ShieldCheck,
  Check,
  Briefcase,
  History
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VendorDashboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'ongoing' | 'upcoming' | 'past'>('ongoing');
  
  const [ongoingEvents, setOngoingEvents] = useState<VendorEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<VendorEvent[]>([]);
  const [pastEvents, setPastEvents] = useState<VendorEvent[]>([]);
  const [quotes, setQuotes] = useState<VendorQuotation[]>([]);
  const [loading, setLoading] = useState(true);

  // Ongoing Event Update Form State
  const [selectedStatus, setSelectedStatus] = useState<string>('Arrived');
  const [serviceProgressInput, setServiceProgressInput] = useState<string>(
    'Kitchen positioned in Palace Banquet Hall; lunch buffet live stations active.'
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadVendorWorkspace();
  }, []);

  const loadVendorWorkspace = async () => {
    try {
      const [eventsData, quotesData] = await Promise.all([
        royalKnotApi.getVendorEvents(),
        royalKnotApi.getCateringQuotations(),
      ]);

      if (eventsData) {
        setOngoingEvents(eventsData.ongoing || []);
        setUpcomingEvents(eventsData.upcoming || []);
        setPastEvents(eventsData.past || []);
      }
      setQuotes(quotesData || []);
    } catch (e) {
      console.error('Error loading vendor workspace', e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (eventId: number) => {
    setIsUpdating(true);
    setUpdateSuccess(null);
    try {
      await royalKnotApi.updateVendorProgress(eventId, {
        arrivalStatus: selectedStatus,
        serviceProgress: serviceProgressInput,
      });

      setUpdateSuccess('Service progress and arrival status updated! Transmitted to Lead Planner Control Room.');
      await loadVendorWorkspace();

      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch (e) {}
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  const formatDate = (dateStr: string) => {
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

  // Vendor's own primary quotation
  const myQuote = quotes[0];

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Vendor Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 text-white shadow-2xl border border-champagne-400/40">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80')` }}
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
                <Store className="w-3.5 h-3.5" />
                Vendor Partner Workspace &bull; Luxury Royal Catering
              </div>
              <h1 className="font-serif text-3xl font-extrabold text-white">
                Maharaja Catering & Events &bull; Partner Portal
              </h1>
              <p className="text-xs sm:text-sm text-champagne-200/90 mt-1">
                Lead Executive: Chef Raghavendra Rao &bull; Specialty: Royal Mewari, Awadhi & Mughlai Heritage &bull; Udaipur Atelier
              </p>
            </div>

            <div className="flex gap-2">
              <span className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-champagne-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Gold Vendor Partner</span>
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* IMPROVEMENT TWO: DEDICATED "MY EVENTS" SECTION */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Area: 2 Columns for MY EVENTS */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-lg space-y-6">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-200 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Vendor Partner Bookings
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                    MY EVENTS
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your accepted wedding assignments, update real-time service progress, and track past completions.
                  </p>
                </div>

                {/* Subcategory Pills: Ongoing, Upcoming, Past */}
                <div className="flex items-center gap-1.5 bg-champagne-50 p-1.5 rounded-2xl border border-champagne-200">
                  <button
                    onClick={() => setActiveCategory('ongoing')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                      activeCategory === 'ongoing'
                        ? 'bg-burgundy-900 text-champagne-200 shadow-sm'
                        : 'text-slate-600 hover:text-burgundy-900'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Ongoing ({ongoingEvents.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveCategory('upcoming')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                      activeCategory === 'upcoming'
                        ? 'bg-burgundy-900 text-champagne-200 shadow-sm'
                        : 'text-slate-600 hover:text-burgundy-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Upcoming ({upcomingEvents.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveCategory('past')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-serif font-bold transition-all flex items-center gap-1.5 ${
                      activeCategory === 'past'
                        ? 'bg-burgundy-900 text-champagne-200 shadow-sm'
                        : 'text-slate-600 hover:text-burgundy-900'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Past ({pastEvents.length})</span>
                  </button>
                </div>
              </div>

              {/* Sub-View A: ONGOING EVENTS */}
              {activeCategory === 'ongoing' && (
                <div className="space-y-6">
                  {ongoingEvents.length === 0 ? (
                    <div className="p-8 text-center bg-champagne-50/50 rounded-2xl border border-champagne-200 text-slate-500 text-xs">
                      No ongoing events currently in progress.
                    </div>
                  ) : (
                    ongoingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-6 rounded-2xl border-2 border-champagne-400/80 bg-white shadow-md space-y-5"
                      >
                        {/* Event Title & Metadata */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-champagne-100 pb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider border border-emerald-300">
                                Live In Progress
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                Date: {formatDate(event.eventDate)}
                              </span>
                            </div>
                            <h3 className="font-serif text-xl font-bold text-burgundy-950 mt-1">
                              {event.eventName}
                            </h3>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Client: <strong className="text-slate-800">{event.clientName}</strong>
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[11px] text-slate-500 block">Accepted Contract:</span>
                            <span className="font-serif font-bold text-base text-emerald-700">
                              {formatCurrency(event.acceptedQuotationAmount)}
                            </span>
                          </div>
                        </div>

                        {/* Event Specifications Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-champagne-50/60 p-4 rounded-xl border border-champagne-200/80">
                          <div>
                            <span className="text-slate-500 block text-[11px]">Venue & Location:</span>
                            <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              {event.venue}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Expected Service Window:</span>
                            <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3.5 h-3.5 text-indigo-500" />
                              {event.expectedServiceTime || '09:00 AM - 04:00 PM'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Guaranteed Headcount:</span>
                            <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                              <Users className="w-3.5 h-3.5 text-amber-500" />
                              {event.guestCount} Guests
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[11px]">Service Scope:</span>
                            <span className="font-semibold text-slate-900 mt-0.5 block">
                              {event.serviceType}
                            </span>
                          </div>
                        </div>

                        {/* Assigned Requirements */}
                        <div className="text-xs text-slate-700 space-y-1">
                          <strong className="text-slate-900 text-[11px] uppercase tracking-wide block">
                            Assigned Requirements:
                          </strong>
                          <p className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 leading-relaxed text-[11px]">
                            {event.requirements || 'Full banquet live station setup.'}
                          </p>
                        </div>

                        {/* Interactive Vendor Updates: Service Progress & Arrival */}
                        <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/80 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-xs uppercase tracking-wider text-amber-900">
                              Update Your Service Status (Transmits to Planner)
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                event.arrivalStatus === 'Arrived'
                                  ? 'bg-emerald-600 text-white'
                                  : event.arrivalStatus === 'Running Late'
                                  ? 'bg-rose-600 text-white animate-pulse'
                                  : 'bg-amber-600 text-white'
                              }`}
                            >
                              Current: {event.arrivalStatus}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Physical Arrival Status
                              </label>
                              <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                              >
                                <option value="Arrived">Arrived (On-Site Check-in)</option>
                                <option value="Running Late">Running Late (Notify Buffer Delay)</option>
                                <option value="Service Completed">Service Completed</option>
                                <option value="Not Arrived">Not Arrived</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                Current Service Progress Note
                              </label>
                              <input
                                type="text"
                                value={serviceProgressInput}
                                onChange={(e) => setServiceProgressInput(e.target.value)}
                                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                                placeholder="e.g. Live tandoor counter firing, buffet line ready"
                              />
                            </div>
                          </div>

                          {updateSuccess && (
                            <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                              ✓ {updateSuccess}
                            </p>
                          )}

                          <button
                            onClick={() => handleUpdateProgress(event.id)}
                            disabled={isUpdating}
                            className="w-full py-2.5 rounded-xl bg-burgundy-900 hover:bg-burgundy-950 text-champagne-200 font-serif font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isUpdating ? 'Transmitting...' : 'Transmit Live Status & Progress'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Sub-View B: UPCOMING ACCEPTED EVENTS */}
              {activeCategory === 'upcoming' && (
                <div className="space-y-4">
                  {upcomingEvents.length === 0 ? (
                    <div className="p-8 text-center bg-champagne-50/50 rounded-2xl border border-champagne-200 text-slate-500 text-xs">
                      No upcoming accepted events found.
                    </div>
                  ) : (
                    upcomingEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-6 rounded-2xl border border-champagne-200 bg-white shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] uppercase tracking-wider">
                              Upcoming Confirmed
                            </span>
                            <h3 className="font-serif text-lg font-bold text-burgundy-950 mt-1">
                              {event.eventName}
                            </h3>
                            <p className="text-xs text-slate-500">Client: {event.clientName}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">Accepted Quotation:</span>
                            <span className="font-serif font-bold text-base text-burgundy-900">
                              {formatCurrency(event.acceptedQuotationAmount)}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Event Date:</span>
                            <strong className="text-slate-800">{formatDate(event.eventDate)}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Venue:</span>
                            <strong className="text-slate-800">{event.venue}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Guest Count:</span>
                            <strong className="text-slate-800">{event.guestCount} Guests</strong>
                          </div>
                        </div>

                        <div className="text-xs space-y-1">
                          <strong className="text-slate-700 text-[11px]">Service Requirements:</strong>
                          <p className="text-slate-600 text-[11px]">{event.requirements}</p>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                          <span className="text-slate-500">Payment Status:</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {event.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Sub-View C: PAST ACCEPTED EVENTS */}
              {activeCategory === 'past' && (
                <div className="space-y-4">
                  {pastEvents.length === 0 ? (
                    <div className="p-8 text-center bg-champagne-50/50 rounded-2xl border border-champagne-200 text-slate-500 text-xs">
                      No past accepted events recorded.
                    </div>
                  ) : (
                    pastEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 shadow-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                          <div>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase tracking-wider">
                              Completed & Closed
                            </span>
                            <h3 className="font-serif text-lg font-bold text-slate-800 mt-1">
                              {event.eventName}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Date: {formatDate(event.eventDate)} &bull; Venue: {event.venue}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">Accepted Quotation:</span>
                            <span className="font-serif font-bold text-base text-slate-900">
                              {formatCurrency(event.acceptedQuotationAmount)}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs space-y-1">
                          <strong className="text-slate-700 text-[11px]">Service Provided:</strong>
                          <p className="text-slate-600 text-[11px]">{event.serviceType}</p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                          <strong className="text-slate-700 text-[11px]">Completion Information:</strong>
                          <p className="text-slate-600 text-[11px]">{event.completionNotes || 'Delivered with 100% adherence to schedule.'}</p>
                        </div>

                        <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-200">
                          <span className="text-slate-500">Final Settlement:</span>
                          <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {event.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Vendor Contract & Payment Records */}
          <div className="space-y-6">
            
            {/* Vendor Contract Card */}
            {myQuote && (
              <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-champagne-100 pb-3">
                  <h3 className="font-serif font-bold text-burgundy-950 text-base">
                    Accepted Contract
                  </h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      myQuote.status === 'ACCEPTED' || myQuote.status === 'SELECTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {myQuote.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Price Per Plate:</span>
                    <strong className="text-slate-900">{formatCurrency(myQuote.pricePerPlate)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guaranteed Headcount:</span>
                    <strong className="text-slate-900">{myQuote.guestCount} Guests</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Live Counters Setup:</span>
                    <span>{formatCurrency(myQuote.additionalCharges)}</span>
                  </div>
                  <div className="pt-2 border-t border-champagne-100 flex justify-between text-sm font-bold text-burgundy-900">
                    <span>Total Agreed Contract:</span>
                    <span className="font-serif">{formatCurrency(myQuote.totalEstimatedPrice)}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-[11px] text-emerald-900">
                  ✓ Advance Deposit (50%) Released: <strong>₹5,25,000</strong>
                </div>
                <div className="bg-champagne-50 rounded-xl p-3 border border-champagne-200 text-[11px] text-slate-700">
                  Final Settlement Payable: <strong>₹5,25,000 + Approved Extras</strong>
                </div>
              </div>
            )}

            {/* Invoicing Status */}
            <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-burgundy-800" />
                <h3 className="font-serif font-bold text-burgundy-950 text-base">
                  Vendor Payment Records
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vendor disbursements are reconciled with planner check-ins and client digital agreements.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-200 space-y-1">
                <div>Invoice #INV-MC-091 submitted for <strong>₹10,50,000</strong>.</div>
                <div>Status: <span className="font-bold text-emerald-700">Approved for Release</span></div>
              </div>
            </div>

            {/* Strict Vendor Privacy & Compliance Note */}
            <div className="p-4 bg-champagne-50/70 rounded-2xl border border-champagne-200 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-burgundy-950 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-champagne-700" />
                <span>Vendor Data Privacy</span>
              </div>
              <p>
                You are authenticated as <strong>vendor@royalknot.com</strong>. Your workspace is strictly limited to your accepted event services and confidential proposals.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
