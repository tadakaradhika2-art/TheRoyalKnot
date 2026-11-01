import React, { useState, useEffect } from 'react';
import { royalKnotApi } from '../../services/api';
import {
  Enquiry,
  Agreement,
  VendorQuotation,
  WeddingTask,
  EventTimeline,
  NotificationItem
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
  Check,
  AlertTriangle,
  RotateCw,
  Radio,
  Edit3,
  X,
  Send,
  ShieldCheck,
  BellRing
} from 'lucide-react';

export const PlannerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'control-room' | 'comparison' | 'tasks' | 'enquiries'>('control-room');

  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [quotes, setQuotes] = useState<VendorQuotation[]>([]);
  const [tasks, setTasks] = useState<WeddingTask[]>([]);
  const [taskStats, setTaskStats] = useState<any>({ total: 25, completed: 8, progressPercentage: 32 });
  const [schedule, setSchedule] = useState<EventTimeline[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Operational Control Modal States
  const [delayModalItem, setDelayModalItem] = useState<EventTimeline | null>(null);
  const [delayMinutes, setDelayMinutes] = useState<number>(15);
  const [delayNote, setDelayNote] = useState<string>('Buffer timeline extended to accommodate guest procession.');

  const [timingModalItem, setTimingModalItem] = useState<EventTimeline | null>(null);
  const [editTimeSlot, setEditTimeSlot] = useState<string>('');
  const [editExpectedCompletion, setEditExpectedCompletion] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Initial load
  useEffect(() => {
    loadPlannerData();
  }, []);

  // Lightweight polling: refresh live schedule & alerts every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshLiveFeed();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPlannerData = async () => {
    try {
      const [enqs, agr, qts, tsks, stats, sch, notifs] = await Promise.all([
        royalKnotApi.getEnquiries(),
        royalKnotApi.getActiveAgreement(),
        royalKnotApi.getCateringQuotations(),
        royalKnotApi.getTasks(),
        royalKnotApi.getTaskStats(),
        royalKnotApi.getSchedule(),
        royalKnotApi.getNotifications().catch(() => []),
      ]);
      setEnquiries(enqs);
      setAgreement(agr);
      setQuotes(qts);
      setTasks(tsks);
      setTaskStats(stats);
      setSchedule(sch);
      setNotifications(notifs || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load planner data', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshLiveFeed = async () => {
    setIsRefreshing(true);
    try {
      const [sch, notifs] = await Promise.all([
        royalKnotApi.getSchedule(),
        royalKnotApi.getNotifications().catch(() => []),
      ]);
      setSchedule(sch);
      setNotifications(notifs || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Live feed refresh error', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Activity Status Actions: Start, Complete
  const handleStartActivity = async (item: EventTimeline) => {
    try {
      await royalKnotApi.updateActivityStatus(item.id, {
        activityStatus: 'In Progress',
        notes: item.notes || 'Activity commenced under planner oversight.',
      });
      await refreshLiveFeed();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteActivity = async (item: EventTimeline) => {
    try {
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      await royalKnotApi.updateActivityStatus(item.id, {
        activityStatus: 'Completed',
        actualCompletion: now,
        notes: `${item.notes || ''} [Completed at ${now}]`.trim(),
      });
      await refreshLiveFeed();
    } catch (err) {
      console.error(err);
    }
  };

  // Record Delay Action
  const submitRecordDelay = async () => {
    if (!delayModalItem) return;
    try {
      await royalKnotApi.updateActivityStatus(delayModalItem.id, {
        activityStatus: 'Delayed',
        delayMinutes: Number(delayMinutes),
        notes: delayNote,
      });
      setDelayModalItem(null);
      await refreshLiveFeed();
    } catch (err) {
      console.error(err);
    }
  };

  // Modify Timing Action
  const submitModifyTiming = async () => {
    if (!timingModalItem) return;
    try {
      await royalKnotApi.updateTimelineTiming(timingModalItem.id, {
        timeSlot: editTimeSlot,
        expectedCompletion: editExpectedCompletion,
        notes: editNotes,
      });
      setTimingModalItem(null);
      await refreshLiveFeed();
    } catch (err) {
      console.error(err);
    }
  };

  // Update Arrival Status
  const handleArrivalStatusUpdate = async (timelineId: number, status: string) => {
    try {
      await royalKnotApi.updateArrivalStatus(timelineId, status, 'Updated by Lead Planner Ishaani Sharma');
      await refreshLiveFeed();
    } catch (e) {
      console.error(e);
    }
  };

  const handleTaskStatusToggle = async (task: WeddingTask) => {
    const nextStatus = task.status === 'Completed' ? 'To Plan' : 'Completed';
    try {
      await royalKnotApi.updateTaskStatus(task.id, nextStatus);
      const [tsks, stats] = await Promise.all([
        royalKnotApi.getTasks(),
        royalKnotApi.getTaskStats(),
      ]);
      setTasks(tsks);
      setTaskStats(stats);
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt);
  };

  // Filter operational alerts
  const operationalAlerts = notifications
    .filter(
      (n) =>
        n.type === 'ARRIVAL_ALERT' ||
        n.type === 'ACTIVITY_DELAYED' ||
        n.type === 'SCHEDULE_UPDATE' ||
        n.type === 'ACTIVITY_COMPLETED' ||
        n.type === 'VENDOR_ARRIVED' ||
        n.type === 'VENDOR_UPDATE' ||
        n.type === 'VENDOR_ACCEPTED'
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Planner Header */}
        <div className="relative rounded-3xl p-8 text-white shadow-2xl border border-champagne-400/40 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"
            alt="Udaipur Royal Palace"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy-950/95 via-burgundy-900/90 to-burgundy-950/95" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-400/20 text-champagne-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ClipboardCheck className="w-3.5 h-3.5" />
              Lead Wedding Planner Operations
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-white">
              The Sharma & Mehta Wedding Operational Cockpit
            </h1>
            <p className="text-xs sm:text-sm text-champagne-200/80 mt-1">
              Lead Planner: Ishaani Sharma &bull; City Palace, Udaipur &bull; 400 Guests
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full-Service Contract</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-full bg-champagne-500/20 text-champagne-300 border border-champagne-400/30 text-xs font-bold">
              25 Tasks Active ({taskStats.progressPercentage}%)
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-champagne-200 pb-2 overflow-x-auto">
          {/* Dedicated Section 1: LIVE WEDDING CONTROL ROOM */}
          <button
            onClick={() => setActiveTab('control-room')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'control-room'
                ? 'bg-burgundy-950 text-champagne-200 shadow-lg ring-2 ring-champagne-400/50'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>LIVE WEDDING CONTROL ROOM</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-serif font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'comparison'
                ? 'bg-burgundy-900 text-champagne-200 shadow-md'
                : 'text-slate-600 hover:bg-champagne-100'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Catering Quotations</span>
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
            <span>25+ Wedding Tasks</span>
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

        {/* ============================================================== */}
        {/* IMPROVEMENT ONE: LIVE WEDDING CONTROL ROOM */}
        {/* ============================================================== */}
        {activeTab === 'control-room' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Control Room Top Toolbar */}
            <div className="bg-white rounded-3xl p-6 border border-champagne-300 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-burgundy-950 text-champagne-300 flex items-center justify-center shadow-md">
                  <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl font-black text-burgundy-950">
                      LIVE WEDDING CONTROL ROOM
                    </h2>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Lead Planner Command Center &bull; Real-time Minute-to-Minute Wedding Timeline & Vendor Monitoring
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-center">
                <span className="text-[11px] text-slate-500 font-mono">
                  Auto-sync: 30s &bull; Refreshed {lastRefreshed.toLocaleTimeString()}
                </span>
                <button
                  onClick={refreshLiveFeed}
                  disabled={isRefreshing}
                  className="px-3.5 py-1.5 rounded-xl bg-champagne-100 hover:bg-champagne-200 text-burgundy-950 font-serif font-bold text-xs flex items-center gap-1.5 transition-colors border border-champagne-300"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
              </div>
            </div>

            {/* Section D: Operational Alerts Feed */}
            <div className="bg-gradient-to-r from-amber-500/10 via-champagne-50 to-amber-500/5 rounded-3xl p-6 border border-amber-300/80 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-amber-700 animate-bounce" />
                  <h3 className="font-serif text-base font-bold text-burgundy-950">
                    Live Operational Alerts & Dispatch Log
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Active Monitoring
                </span>
              </div>

              {operationalAlerts.length === 0 ? (
                <p className="text-xs text-slate-500">All vendors and timeline items are currently on schedule.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {operationalAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3.5 rounded-2xl bg-white border border-amber-200/90 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-xs text-slate-900 leading-snug">
                            {alert.title}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                              alert.type === 'ARRIVAL_ALERT' || alert.type === 'ACTIVITY_DELAYED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {alert.type === 'ARRIVAL_ALERT' ? 'Late Vendor' : alert.type === 'ACTIVITY_DELAYED' ? 'Delayed' : 'Update'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {alert.message}
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-2 block">
                        Just now &bull; Dispatch to Lead Planner
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section C: Dedicated Vendor Arrival Monitoring Tracker */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-champagne-200 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Vendor Logistics Tracker
                  </span>
                  <h3 className="font-serif text-xl font-bold text-burgundy-950 mt-0.5">
                    Vendor Arrival & Service Deployment Status
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {schedule.filter((s) => s.assignedVendor).length} Assigned Vendor Partners
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-champagne-50/70 text-slate-700 font-semibold border-b border-champagne-200">
                    <tr>
                      <th className="py-3 px-3">Vendor Name</th>
                      <th className="py-3 px-3">Assigned Service</th>
                      <th className="py-3 px-3">Expected Arrival</th>
                      <th className="py-3 px-3">Actual Arrival</th>
                      <th className="py-3 px-3">Arrival Status</th>
                      <th className="py-3 px-3">Delay Duration</th>
                      <th className="py-3 px-3 text-right">Planner Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedule.map((item) => {
                      const isLate = item.arrivalStatus === 'Running Late';
                      const isArrived = item.arrivalStatus === 'Arrived';
                      const isDone = item.arrivalStatus === 'Service Completed';

                      return (
                        <tr key={item.id} className="hover:bg-champagne-50/30 transition-colors">
                          <td className="py-3.5 px-3 font-bold text-burgundy-950">
                            {item.assignedVendor || 'Internal Coordination Team'}
                          </td>
                          <td className="py-3.5 px-3 text-slate-700 font-medium">
                            {item.activity}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-slate-600">
                            {item.timeSlot}
                          </td>
                          <td className="py-3.5 px-3 font-mono">
                            {isArrived || isDone ? (
                              <span className="text-emerald-700 font-semibold">{item.timeSlot}</span>
                            ) : (
                              <span className="text-slate-400">Awaiting Check-in</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                isLate
                                  ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                                  : isArrived
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : isDone
                                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.arrivalStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            {item.delayMinutes && item.delayMinutes > 0 ? (
                              <span className="text-rose-700 font-bold font-mono">+{item.delayMinutes} min</span>
                            ) : isArrived ? (
                              <span className="text-emerald-700 font-medium">On Schedule</span>
                            ) : (
                              <span className="text-slate-400">0 min</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <select
                              value={item.arrivalStatus}
                              onChange={(e) => handleArrivalStatusUpdate(item.id, e.target.value)}
                              className="text-[11px] px-2 py-1 rounded-lg border border-slate-300 bg-white font-medium text-slate-700"
                            >
                              <option value="Not Arrived">Not Arrived</option>
                              <option value="Arrived">Arrived</option>
                              <option value="Running Late">Running Late</option>
                              <option value="Service Completed">Service Completed</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section A & B: Live Event Timeline with Minute-to-Minute Updates */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300 shadow-lg space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-200 pb-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Master Run-of-Show Timeline
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-burgundy-950 mt-0.5">
                    Minute-to-Minute Ceremonial Schedule & Operations
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Control activity commencement, mark completions, record delays, or modify timings on the fly.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-champagne-100 text-champagne-900 font-serif font-bold text-xs">
                    {schedule.filter((s) => s.activityStatus === 'Completed').length} / {schedule.length} Milestones Completed
                  </span>
                </div>
              </div>

              {/* Timeline Cards Grid */}
              <div className="space-y-4">
                {schedule.map((item) => {
                  const isCompleted = item.activityStatus === 'Completed';
                  const isInProgress = item.activityStatus === 'In Progress';
                  const isDelayed = item.activityStatus === 'Delayed';

                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isCompleted
                          ? 'border-emerald-200 bg-emerald-50/20'
                          : isInProgress
                          ? 'border-indigo-400 bg-indigo-50/30 shadow-md ring-1 ring-indigo-300'
                          : isDelayed
                          ? 'border-rose-400 bg-rose-50/50 shadow-md ring-1 ring-rose-300'
                          : 'border-champagne-200/90 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Time & Activity info */}
                        <div className="flex items-start gap-4">
                          <div className="w-24 text-center font-mono font-bold text-xs px-2.5 py-2 rounded-xl bg-burgundy-950 text-champagne-300 shrink-0 shadow-xs">
                            {item.timeSlot}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-serif font-bold text-slate-900 text-base">
                                {item.activity}
                              </h4>
                              {/* Current Activity Status Badge */}
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  isCompleted
                                    ? 'bg-emerald-600 text-white'
                                    : isInProgress
                                    ? 'bg-indigo-600 text-white animate-pulse'
                                    : isDelayed
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {item.activityStatus || 'Upcoming'}
                              </span>
                            </div>

                            <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                              <span className="font-medium text-burgundy-900">
                                Vendor: {item.assignedVendor || 'Event Coordination Team'}
                              </span>
                              <span>&bull;</span>
                              <span>
                                Expected End:{' '}
                                <strong className="text-slate-800">
                                  {item.expectedCompletion || 'Not specified'}
                                </strong>
                              </span>
                              {item.actualCompletion && (
                                <>
                                  <span>&bull;</span>
                                  <span className="text-emerald-700 font-semibold">
                                    Actual End: {item.actualCompletion}
                                  </span>
                                </>
                              )}
                              {item.delayMinutes && item.delayMinutes > 0 ? (
                                <>
                                  <span>&bull;</span>
                                  <span className="text-rose-700 font-bold">
                                    Delay: {item.delayMinutes} min
                                  </span>
                                </>
                              ) : null}
                            </div>

                            {item.notes && (
                              <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2">
                                <strong>Operational Note:</strong> {item.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Operational Minute-to-Minute Actions */}
                        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
                          {/* Start Activity Button */}
                          {!isCompleted && !isInProgress && (
                            <button
                              onClick={() => handleStartActivity(item)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-semibold flex items-center gap-1.5 border border-indigo-200 transition-colors"
                            >
                              <Play className="w-3.5 h-3.5 text-indigo-600 fill-current" />
                              <span>Start Activity</span>
                            </button>
                          )}

                          {/* Complete Activity Button */}
                          {!isCompleted && (
                            <button
                              onClick={() => handleCompleteActivity(item)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Complete</span>
                            </button>
                          )}

                          {/* Record Delay Button */}
                          <button
                            onClick={() => {
                              setDelayModalItem(item);
                              setDelayMinutes(item.delayMinutes || 15);
                              setDelayNote(item.notes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 border border-amber-200 transition-colors"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Record Delay</span>
                          </button>

                          {/* Modify Timing / Notes Button */}
                          <button
                            onClick={() => {
                              setTimingModalItem(item);
                              setEditTimeSlot(item.timeSlot);
                              setEditExpectedCompletion(item.expectedCompletion || '');
                              setEditNotes(item.notes || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Edit Timing</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delay Modal Dialog */}
            {delayModalItem && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-champagne-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-rose-700 font-serif font-bold text-lg">
                      <AlertTriangle className="w-5 h-5 text-rose-600" />
                      <span>Record Activity Delay</span>
                    </div>
                    <button
                      onClick={() => setDelayModalItem(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-slate-900">{delayModalItem.activity}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Scheduled at {delayModalItem.timeSlot}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Delay Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={delayMinutes}
                      onChange={(e) => setDelayMinutes(Number(e.target.value))}
                      className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 font-mono"
                      min="5"
                      step="5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Operational Note & Reason
                    </label>
                    <textarea
                      value={delayNote}
                      onChange={(e) => setDelayNote(e.target.value)}
                      rows={3}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      placeholder="e.g. VIP guest convoy delay near palace courtyard"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setDelayModalItem(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitRecordDelay}
                      className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors"
                    >
                      Transmit Delay Alert
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timing / Notes Modal Dialog */}
            {timingModalItem && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-champagne-300 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-burgundy-950 font-serif font-bold text-lg">
                      <Edit3 className="w-5 h-5 text-champagne-600" />
                      <span>Modify Timing & Operational Notes</span>
                    </div>
                    <button
                      onClick={() => setTimingModalItem(null)}
                      className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-serif font-bold text-slate-900">{timingModalItem.activity}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Vendor: {timingModalItem.assignedVendor}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Slot</label>
                      <input
                        type="text"
                        value={editTimeSlot}
                        onChange={(e) => setEditTimeSlot(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                        placeholder="e.g. 02:15 PM"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Expected End</label>
                      <input
                        type="text"
                        value={editExpectedCompletion}
                        onChange={(e) => setEditExpectedCompletion(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 font-mono"
                        placeholder="e.g. 03:45 PM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lead Planner Operational Notes
                    </label>
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={3}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300"
                      placeholder="Add instructions, buffer details, or briefing notes..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setTimingModalItem(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitModifyTiming}
                      className="flex-1 py-2.5 rounded-xl bg-burgundy-950 hover:bg-burgundy-900 text-champagne-300 text-xs font-bold shadow-md transition-colors"
                    >
                      Save Schedule Update
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Catering Quote Comparison */}
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
                    Couple (Aanya & Arjun)
                  </span>
                </div>
              </div>

              {/* 3-Caterer Side-by-Side Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quotes.map((quote) => (
                  <div
                    key={quote.id}
                    className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                      quote.status === 'ACCEPTED' || quote.status === 'SELECTED'
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
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            quote.status === 'ACCEPTED' || quote.status === 'SELECTED'
                              ? 'bg-emerald-600 text-white'
                              : quote.status === 'CLOSED' || quote.status === 'REJECTED'
                              ? 'bg-slate-200 text-slate-600'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {quote.status}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-champagne-700 block">
                        {quote.vendorName}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-burgundy-950 mt-0.5">
                        {quote.packageTitle || quote.vendorName}
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
                        {quote.taxAmount !== undefined && quote.taxAmount > 0 && (
                          <div className="flex justify-between text-slate-500 text-[11px]">
                            <span>Statutory Taxes (5%):</span>
                            <span>+{formatCurrency(quote.taxAmount)}</span>
                          </div>
                        )}
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

                        {quote.termsAndConditions && (
                          <div className="pt-1.5 text-[11px]">
                            <strong className="text-slate-700 block">Terms: </strong>
                            <p className="text-slate-500 text-[10px] bg-slate-50 p-2 rounded border border-slate-100">
                              {quote.termsAndConditions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                      {quote.status === 'ACCEPTED' || quote.status === 'SELECTED' ? (
                        <div className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Winning Vendor Linked to Wedding</span>
                        </div>
                      ) : quote.status === 'CLOSED' || quote.status === 'REJECTED' ? (
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

        {/* TAB 3: 25+ Wedding Tasks */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-champagne-700 font-bold">
                    Automated Wedding Execution Plan
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
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              task.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : task.status === 'In Progress'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : task.status === 'Delayed'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div
                            className={`font-semibold text-slate-900 ${
                              task.status === 'Completed' ? 'line-through text-slate-400' : ''
                            }`}
                          >
                            {task.title}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{task.description}</div>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">{task.category}</td>
                        <td className="py-3 px-3 text-slate-600 font-medium">{task.assignedOwner}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              task.priority === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800'
                                : task.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
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

        {/* TAB 4: Enquiries & Agreements */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-lg">
              <h3 className="font-serif text-xl font-bold text-burgundy-950 mb-4">
                Client Enquiries Pipeline
              </h3>
              <div className="space-y-3">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-champagne-400 transition-colors"
                  >
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
