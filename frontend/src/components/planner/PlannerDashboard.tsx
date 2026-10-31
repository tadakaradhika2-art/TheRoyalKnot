import React, { useState, useEffect } from 'react';
import { royalKnotApi } from '../../services/api';
import {
  Enquiry,
  Agreement,
  VendorQuotation,
  WeddingTask,
  EventTimeline
} from '../../types';
import {
  ClipboardCheck,
  Calendar,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Utensils,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';

export const PlannerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'comparison' | 'tasks' | 'schedule'>('comparison');
  
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [quotes, setQuotes] = useState<VendorQuotation[]>([]);
  const [tasks, setTasks] = useState<WeddingTask[]>([]);
  const [taskStats, setTaskStats] = useState<any>({ total: 25, completed: 8, progressPercentage: 32 });
  const [schedule, setSchedule] = useState<EventTimeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlannerData();
  }, []);

  const loadPlannerData = async () => {
    try {
      const [enqs, agr, qts, tsks, stats, sch] = await Promise.all([
        royalKnotApi.getEnquiries(),
        royalKnotApi.getActiveAgreement(),
        royalKnotApi.getCateringQuotations(),
        royalKnotApi.getTasks(),
        royalKnotApi.getTaskStats(),
        royalKnotApi.getSchedule(),
      ]);
      setEnquiries(enqs);
      setAgreement(agr);
      setQuotes(qts);
      setTasks(tsks);
      setTaskStats(stats);
      setSchedule(sch);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusToggle = async (task: WeddingTask) => {
    const nextStatus = task.status === 'Completed' ? 'To Plan' : 'Completed';
    try {
      await royalKnotApi.updateTaskStatus(task.id, nextStatus);
      await loadPlannerData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleArrivalStatusUpdate = async (timelineId: number, status: string) => {
    try {
      await royalKnotApi.updateArrivalStatus(timelineId, status, "Updated by Planner Isabella Vance");
      await loadPlannerData();
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
        
        {/* Planner Header */}
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 text-white shadow-2xl border border-champagne-400/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-400/20 text-champagne-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Wedding Planner Operations Command
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-white">
              The Sharma Wedding Operational Cockpit
            </h1>
            <p className="text-xs sm:text-sm text-champagne-200/80 mt-1">
              Assigned Lead Planner: Isabella Vance &bull; 400 Guests &bull; City Palace, Udaipur
            </p>
          </div>

          <div className="flex gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Agreement Signed
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-champagne-500/20 text-champagne-300 border border-champagne-400/30 text-xs font-bold">
              25 Tasks Active ({taskStats.progressPercentage}%)
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-champagne-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'comparison'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Module 6: Catering Quote Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Module 8: 25+ Wedding Tasks</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'schedule'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Module 9: Live Schedule & Vendor Arrival</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'enquiries'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Enquiries & Agreements</span>
          </button>
        </div>

        {/* TAB 1: Catering Quote Comparison (Module 6) */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Vendor Quotation Comparison Engine
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                    Catering Requirement: 400 Guests (Royal Heritage Wedding)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Comparison Formula: <code>Total Estimated Cost = Price Per Plate × 400 Guests + Additional Charges</code>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Selection Authority:</span>
                  <span className="text-xs font-bold text-burgundy-900 bg-champagne-100 px-3 py-1 rounded-full border border-champagne-300">
                    Couple (Eleanor & Arjun)
                  </span>
                </div>
              </div>

              {/* 3-Caterer Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                      quote.status === 'SELECTED'
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xl ring-2 ring-emerald-400'
                        : quote.recommended
                        ? 'border-champagne-400 bg-white shadow-lg'
                        : 'border-slate-200 bg-white/80'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-3">
                        {quote.recommended && (
                          <span className="px-2.5 py-0.5 rounded-full bg-champagne-100 text-champagne-800 text-[10px] font-bold uppercase tracking-wider border border-champagne-300">
                            ★ Planner Recommended
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          quote.status === 'SELECTED' ? 'bg-emerald-600 text-white' :
                          quote.status === 'CLOSED' ? 'bg-slate-200 text-slate-600' :
                          'bg-blue-50 text-blue-700 border border-blue-200'
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
                      <p className="text-[11px] text-slate-500 mt-1">
                        Specialty: {quote.regionalSpecialization}
                      </p>

                      {/* Pricing Breakdown Formula */}
                      <div className="bg-champagne-50/80 rounded-xl p-3.5 my-4 border border-champagne-200/70 space-y-1.5 text-xs">
                        <div className="flex justify-between text-slate-600">
                          <span>Price Per Plate:</span>
                          <strong className="text-slate-900">{formatCurrency(quote.pricePerPlate)}</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Guest Count:</span>
                          <strong>400 Guests</strong>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Base Catering:</span>
                          <span>{formatCurrency(quote.pricePerPlate * 400)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>Additional Charges:</span>
                          <span>+{formatCurrency(quote.additionalCharges)}</span>
                        </div>
                        <div className="pt-2 border-t border-champagne-200 flex justify-between font-bold text-burgundy-900 text-sm">
                          <span>Total Estimated:</span>
                          <span className="font-serif font-extrabold">{formatCurrency(quote.totalEstimatedPrice)}</span>
                        </div>
                      </div>

                      {/* Menu Line-by-Line Details */}
                      <div className="space-y-2 text-xs text-slate-700">
                        <div className="font-semibold text-slate-800 text-[11px] uppercase tracking-wide">
                          Menu & Varieties ({quote.vegetarianOptionsCount} Veg / {quote.nonVegetarianOptionsCount} Non-Veg):
                        </div>
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          {quote.menuDetails}
                        </p>

                        <div className="pt-2 text-[11px]">
                          <strong className="text-slate-700">Inclusions: </strong>
                          <span className="text-slate-600">{quote.serviceInclusions}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                      {quote.status === 'SELECTED' ? (
                        <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Winning Vendor Linked to Wedding</span>
                        </div>
                      ) : quote.status === 'CLOSED' ? (
                        <div className="text-xs text-slate-400 font-medium">
                          Closed automatically upon client selection
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 font-medium">
                          Awaiting client final selection in Couple Portal
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 25+ Wedding Tasks (Module 8) */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Module 8: Automated Wedding Execution Plan
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                    25+ Wedding Tasks Tracker
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Auto-generated upon proposal confirmation and booking deposit recording.
                  </p>
                </div>

                {/* Progress Metric */}
                <div className="bg-champagne-50 rounded-2xl px-5 py-3 border border-champagne-200 text-right">
                  <div className="text-xs text-slate-500">Execution Progress</div>
                  <div className="font-serif text-2xl font-black text-burgundy-900">
                    {taskStats.completed} / {taskStats.total} Tasks Completed
                  </div>
                  <div className="w-36 h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${taskStats.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Task Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-champagne-50/70 text-slate-700 font-semibold border-b border-champagne-200">
                    <tr>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Task Title & Details</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Assigned Owner</th>
                      <th className="py-3 px-3">Priority</th>
                      <th className="py-3 px-3 text-right">Toggle Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-champagne-50/30 transition-colors">
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                            task.status === 'Delayed' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className={`font-semibold text-slate-900 ${task.status === 'Completed' ? 'line-through text-slate-400' : ''}`}>
                            {task.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{task.description}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {task.category}
                        </td>
                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {task.assignedOwner}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            task.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                            task.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleTaskStatusToggle(task)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-[10px] font-semibold text-slate-700 transition-colors"
                          >
                            {task.status === 'Completed' ? 'Reopen' : 'Mark Done'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Live Wedding-Day Schedule & Vendor Tracker (Module 9) */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs uppercase tracking-wider text-emerald-700 font-bold">
                      Live WebSocket Dispatch
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                    Minute-by-Minute Wedding Day Schedule & Arrival Tracker
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Real-time vendor check-in stream. Late vendors are automatically highlighted in amber/red.
                  </p>
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="space-y-3">
                {schedule.map((item) => {
                  const isLate = item.arrivalStatus === 'Running Late';
                  const isArrived = item.arrivalStatus === 'Arrived';

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isLate
                          ? 'border-rose-400 bg-rose-50/60 shadow-md ring-1 ring-rose-300'
                          : isArrived
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="w-20 text-center font-mono font-bold text-xs px-2.5 py-1.5 rounded-lg bg-burgundy-950 text-champagne-300 shrink-0">
                          {item.timeSlot}
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-slate-900 text-sm">
                            {item.activity}
                          </h4>
                          <div className="text-xs text-slate-600 mt-0.5 flex flex-wrap items-center gap-2">
                            <span className="font-medium text-burgundy-900">{item.assignedVendor}</span>
                            <span>&bull;</span>
                            <span className="text-slate-500">{item.notes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badges & Quick Action */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.arrivalStatus === 'Arrived' ? 'bg-emerald-600 text-white' :
                          item.arrivalStatus === 'Running Late' ? 'bg-rose-600 text-white animate-pulse' :
                          item.arrivalStatus === 'Service Completed' ? 'bg-blue-600 text-white' :
                          'bg-slate-200 text-slate-700'
                        }`}>
                          {item.arrivalStatus}
                        </span>

                        <select
                          value={item.arrivalStatus}
                          onChange={(e) => handleArrivalStatusUpdate(item.id, e.target.value)}
                          className="text-xs px-2 py-1 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="Not Arrived">Not Arrived</option>
                          <option value="Arrived">Arrived</option>
                          <option value="Running Late">Running Late</option>
                          <option value="Service Completed">Service Completed</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Enquiries & Agreements */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <h3 className="font-serif text-xl font-bold text-burgundy-950 mb-4">
                Client Enquiries Pipeline (Module 4)
              </h3>
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div key={enq.id} className="p-4 rounded-xl border border-slate-200 hover:border-champagne-400 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="font-serif font-bold text-slate-900">{enq.coupleNames}</div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-champagne-100 text-champagne-800">
                        {enq.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-4">
                      <span>Location: {enq.weddingLocation}</span>
                      <span>Guests: {enq.estimatedGuestCount}</span>
                      <span>Package: {enq.selectedPackage}</span>
                      <span>Budget: {formatCurrency(enq.maximumBudget)}</span>
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

