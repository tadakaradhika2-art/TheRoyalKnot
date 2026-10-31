import React, { useState, useEffect } from 'react';
import { royalKnotApi } from '../../services/api';
import { EventTimeline, VendorQuotation } from '../../types';
import {
  Store,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  MapPin,
  Utensils,
  Calendar,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VendorDashboard: React.FC = () => {
  const [schedule, setSchedule] = useState<EventTimeline[]>([]);
  const [quotes, setQuotes] = useState<VendorQuotation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('Arrived');
  const [statusNote, setStatusNote] = useState<string>('Kitchen crew checked in at South Gate Palace kitchens.');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      const [sch, qts] = await Promise.all([
        royalKnotApi.getSchedule(),
        royalKnotApi.getCateringQuotations(),
      ]);
      setSchedule(sch);
      setQuotes(qts);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckIn = async (timelineId: number) => {
    setIsUpdating(true);
    try {
      await royalKnotApi.updateArrivalStatus(timelineId, selectedStatus, statusNote);
      await loadVendorData();
      try {
        confetti({ particleCount: 70, spread: 50 });
      } catch (e) {}
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const myQuote = quotes.find(q => q.vendorName.includes('Royal Rasoi')) || quotes[0];
  const myTimelineItems = schedule.filter(s => s.assignedVendor.includes('Royal Rasoi') || s.assignedVendor.includes('Cater'));

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Vendor Header */}
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 text-white shadow-2xl border border-champagne-400/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Store className="w-3.5 h-3.5" />
              Vendor Partner Workspace
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-white">
              Royal Rasoi Caterers &bull; Partner Portal
            </h1>
            <p className="text-xs sm:text-sm text-champagne-200/80 mt-1">
              Lead Executive: Chef Raghavendra &bull; Service: Royal Awadhi & Mughlai Heritage
            </p>
          </div>

          <div className="flex gap-2">
            <span className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-champagne-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Assigned: The Sharma Wedding (Udaipur)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1 & 2: Day-of Event Check-in & Work Schedule */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Check-in Card (Module 9) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Module 9: Wedding-Day Arrival Reporting
                  </span>
                  <h3 className="font-serif text-xl font-bold text-burgundy-950 mt-0.5">
                    Live Event Arrival Check-in
                  </h3>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Palace Gate Beacon Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Report your physical arrival or delay status. Your update dispatches instantly to the Wedding Planner command center.
              </p>

              {myTimelineItems.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500">
                  No catering schedule assigned today.
                </div>
              ) : (
                <div className="space-y-4">
                  {myTimelineItems.map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl border border-champagne-200 bg-champagne-50/40 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-burgundy-950 text-champagne-200">
                              {item.timeSlot}
                            </span>
                            <span className="font-serif font-bold text-slate-900">{item.activity}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Current Status on Board: <strong className="text-burgundy-900">{item.arrivalStatus}</strong></p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-center ${
                          item.arrivalStatus === 'Arrived' ? 'bg-emerald-600 text-white' :
                          item.arrivalStatus === 'Running Late' ? 'bg-rose-600 text-white animate-pulse' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.arrivalStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Update Arrival Status</label>
                          <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white"
                          >
                            <option value="Arrived">Arrived (On-Site Check-in)</option>
                            <option value="Running Late">Running Late (Notify Delay)</option>
                            <option value="Service Completed">Service Completed</option>
                            <option value="Not Arrived">Not Arrived</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status Note / Reason</label>
                          <input
                            type="text"
                            value={statusNote}
                            onChange={(e) => setStatusNote(e.target.value)}
                            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                            placeholder="e.g. Traffic near South Gate"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleCheckIn(item.id)}
                        disabled={isUpdating}
                        className="w-full py-2.5 rounded-xl bg-burgundy-900 hover:bg-burgundy-950 text-champagne-200 font-serif font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmit Live Check-In to Planner</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Schedule View */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-burgundy-950 mb-3">
                Wedding Day Timeline (Full Run-of-Show)
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {schedule.map(s => (
                  <div key={s.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] font-bold text-slate-700">{s.timeSlot}</span>
                      <span className="font-semibold text-slate-900">{s.activity}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{s.assignedVendor}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Column 3: Quotation Details & Payment Invoices */}
          <div className="space-y-6">
            
            {/* Contract Summary */}
            {myQuote && (
              <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-lg space-y-4">
                <div className="flex items-center justify-between border-b border-champagne-100 pb-3">
                  <h3 className="font-serif font-bold text-burgundy-950 text-base">Catering Contract</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    myQuote.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {myQuote.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Agreed Price Per Plate:</span>
                    <strong className="text-slate-900">{formatCurrency(myQuote.pricePerPlate)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guaranteed Headcount:</span>
                    <strong className="text-slate-900">400 Guests</strong>
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
                  ✓ Advance Deposit (50%) Released: <strong>₹4,00,000</strong>
                </div>
                <div className="bg-champagne-50 rounded-xl p-3 border border-champagne-200 text-[11px] text-slate-700">
                  Final Settlement Payable: <strong>₹4,00,000 + Approved Extras</strong>
                </div>
              </div>
            )}

            {/* Invoicing Status */}
            <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="w-4 h-4 text-burgundy-800" />
                <h3 className="font-serif font-bold text-burgundy-950 text-base">Invoicing Status</h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Vendor Invoices are reconciled with planner check-ins and client approvals.
              </p>
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-200">
                Invoice #INV-RR-091 submitted for <strong>₹8,90,000</strong> (including extra 50 plate guarantee). Status: <span className="font-bold text-emerald-700">Approved for Release</span>.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

