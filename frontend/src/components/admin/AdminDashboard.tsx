import React, { useState, useEffect } from 'react';
import { royalKnotApi } from '../../services/api';
import { FounderAnalytics } from '../../types';
import {
  Crown,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  ShieldCheck,
  Building,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<FounderAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await royalKnotApi.getFounderAnalytics();
      setAnalytics(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-8">
        <div className="text-center font-serif text-burgundy-900 font-bold animate-pulse text-lg">
          Loading Founder Executive Cockpit...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="relative overflow-hidden bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 text-white shadow-2xl border border-champagne-400/40">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=80')` }}
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-400/20 text-champagne-300 text-xs font-bold uppercase tracking-wider mb-2 border border-champagne-400/30">
                <Crown className="w-3.5 h-3.5" />
                Founder & Executive Cockpit &bull; Indian Luxury Wedding Portfolio
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
                Executive Performance & Profitability
              </h1>
              <p className="text-xs sm:text-sm text-champagne-200/90 mt-1">
                Founder & CEO: Ranveer Singh Rathore &bull; Comprehensive 25-Palace Wedding Season Audit
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div>
                <div className="text-[10px] text-champagne-300 uppercase tracking-widest font-semibold">Net Profit (Recognized)</div>
                <div className="font-serif text-2xl font-black text-champagne-300">
                  {formatCurrency(analytics.netProfit)}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>22.4% Avg Profit Margin</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="bg-white rounded-2xl p-6 border border-champagne-200/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Season Portfolio</span>
              <div className="w-9 h-9 rounded-xl bg-champagne-50 text-champagne-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl font-extrabold text-burgundy-950 mt-3">
              {analytics.totalWeddings} Weddings
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
              <span className="font-semibold text-emerald-600">{analytics.completedWeddings} Completed</span>
              <span>&bull;</span>
              <span className="font-semibold text-blue-600">{analytics.activeWeddings} Active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-champagne-200/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-3">
              {formatCurrency(analytics.totalRevenue)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Pending Collections: <strong className="text-amber-700">{formatCurrency(analytics.pendingClientPayments)}</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-champagne-200/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Business Expenses</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-2xl sm:text-3xl font-extrabold text-rose-700 mt-3">
              {formatCurrency(analytics.totalExpenses)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Upcoming Vendor Payouts: <strong className="text-slate-700">{formatCurrency(analytics.upcomingVendorPayments)}</strong>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-champagne-200/80 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Vendor Reliability</span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="font-serif text-3xl font-extrabold text-indigo-900 mt-3">
              {analytics.vendorOnTimeArrivalRate}%
            </div>
            <div className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{analytics.completedAssignmentsCount} successful assignments (0 cancels)</span>
            </div>
          </div>

        </div>

        {/* Charts & Graphs (Recharts) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-champagne-200/80 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-burgundy-950">
                  Monthly Financial Performance (INR)
                </h3>
                <p className="text-xs text-slate-500">Recognized Revenue vs. Operational Expenses vs. Net Margin</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-champagne-50 border border-champagne-200 text-xs text-champagne-800 font-semibold">
                Recharts Analytics
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyRevenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1EAD9" />
                  <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={11}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                  />
                  <Tooltip
                    formatter={(val: any) => formatCurrency(Number(val))}
                    contentStyle={{ backgroundColor: '#FCFBF7', borderColor: '#E5D1A0', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#801428" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#D4B876" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Net Profit" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Vendor Reliability Health Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-200/80 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-burgundy-950">Vendor Reliability Index</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Grade A+
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Evaluated across 54 vendor service shifts across Udaipur, Jaipur, and Goa.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">On-Time Arrival Rate</span>
                    <span className="text-emerald-700">{analytics.vendorOnTimeArrivalRate}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analytics.vendorOnTimeArrivalRate}%` }} />
                  </div>
                </div>

                <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-amber-900 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Reported Delays (Season)</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    {analytics.delayedArrivalsCount} instances resolved via buffer schedules without impacting ceremonial run-of-show.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 text-center">
              <div className="text-xs text-slate-500">Average Profitability per Wedding</div>
              <div className="font-serif text-xl font-bold text-burgundy-900 mt-1">
                {formatCurrency(analytics.averageWeddingProfitability)}
              </div>
            </div>
          </div>

        </div>

        {/* Wedding-Wise Profitability Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-champagne-200/80 shadow-lg">
          <h3 className="font-serif text-xl font-bold text-burgundy-950 mb-4">
            Wedding-Wise Profitability Audit
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-champagne-50/70 text-slate-700 font-semibold border-b border-champagne-200">
                <tr>
                  <th className="py-3 px-4">Wedding / Couple</th>
                  <th className="py-3 px-4">Recognized Revenue</th>
                  <th className="py-3 px-4">Total Cost</th>
                  <th className="py-3 px-4">Profit Margin</th>
                  <th className="py-3 px-4">Execution Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.weddingWiseProfitability.map((w, i) => (
                  <tr key={w.name || i} className="hover:bg-champagne-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      <div>{w.name}</div>
                      <div className="text-[11px] text-slate-400">{w.client}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      {formatCurrency(w.revenue)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {formatCurrency(w.expenses)}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-burgundy-900">
                      {w.margin}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        w.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        w.status === 'LIVE_TODAY' ? 'bg-amber-50 text-amber-800 border border-amber-200 animate-pulse' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {w.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

