import React from 'react';
import { Link } from 'react-router-dom';
import { RoyalKnotAnimation } from '../common/RoyalKnotAnimation';
import { Crown, Sparkles, Heart, ClipboardCheck, Store, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WelcomePage: React.FC = () => {
  const { loginAsRole } = useAuth();

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section with Signature Knot Animation */}
      <section className="relative pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-champagne-50/60 via-ivory to-ivory border-b border-champagne-200/50">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Signature Fabric-Knot & Interlocking Ring Animation */}
          <div className="mb-4">
            <RoyalKnotAnimation />
          </div>

          <p className="max-w-2xl mx-auto text-slate-700 text-base sm:text-lg leading-relaxed mt-4">
            The enterprise wedding orchestration platform connecting high-end couples, dedicated wedding planners, curated luxury vendors, and the agency founder into one synchronized, transparent experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/packages"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-burgundy-900 to-burgundy-700 text-champagne-200 font-serif font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-champagne-400/30"
            >
              <span>Explore Wedding Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/enquiry"
              className="px-8 py-3.5 rounded-full bg-white text-burgundy-900 font-serif font-bold text-sm shadow-md hover:shadow-lg hover:bg-champagne-50 transition-all border border-champagne-300"
            >
              Plan The Sharma Wedding
            </Link>
          </div>
        </div>
      </section>

      {/* Demonstration Scenario Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-2xl p-6 sm:p-8 shadow-2xl border border-champagne-400/40 text-champagne-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-champagne-400" />
                <span className="text-xs uppercase tracking-widest text-champagne-400 font-bold">
                  Interactive Prototype Showcase
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                The Sharma Wedding Live Simulation
              </h3>
              <p className="text-sm text-champagne-200/80 mt-1 max-w-2xl">
                Experience the 4 connected roles: Client signing digital agreements, Planner comparing 3 catering bids, 25+ automated tasks, and Founder reviewing seasonal profitability.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              <button
                onClick={() => loginAsRole('ROLE_ADMIN')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-champagne-400/30 text-left transition-all"
              >
                <div className="text-xs text-champagne-400">Founder</div>
                <div className="text-sm font-bold text-white">👑 Admin View</div>
              </button>

              <button
                onClick={() => loginAsRole('ROLE_PLANNER')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-champagne-400/30 text-left transition-all"
              >
                <div className="text-xs text-champagne-400">Planner</div>
                <div className="text-sm font-bold text-white">📋 Planner View</div>
              </button>

              <button
                onClick={() => loginAsRole('ROLE_CLIENT')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-champagne-400/30 text-left transition-all"
              >
                <div className="text-xs text-champagne-400">Couple</div>
                <div className="text-sm font-bold text-white">💍 Client View</div>
              </button>

              <button
                onClick={() => loginAsRole('ROLE_VENDOR')}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-champagne-400/30 text-left transition-all"
              >
                <div className="text-xs text-champagne-400">Vendor</div>
                <div className="text-sm font-bold text-white">🍽️ Vendor View</div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Architectural Portals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest text-champagne-700 font-bold">
            Four Synchronized Perspectives
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-burgundy-950 mt-1">
            End-to-End Orchestration Architecture
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* 1. Admin */}
          <div className="bg-white rounded-2xl p-6 border border-champagne-200/80 shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-burgundy-50 border border-burgundy-200 text-burgundy-800 flex items-center justify-center mb-4">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-burgundy-950">Founder & Admin</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Platform-wide performance, season-wide revenue & expense trends, wedding profitability analytics, and vendor reliability audit.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-burgundy-800 mt-4 hover:underline"
            >
              Open Admin Dashboard &rarr;
            </Link>
          </div>

          {/* 2. Planner */}
          <div className="bg-white rounded-2xl p-6 border border-champagne-200/80 shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-champagne-50 border border-champagne-200 text-champagne-800 flex items-center justify-center mb-4">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-burgundy-950">Wedding Planner</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Enquiry intake, consultation scheduling, agreement dispatch, 3-caterer quotation comparison, 25+ automated tasks, and live day-of tracker.
            </p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-burgundy-800 mt-4 hover:underline"
            >
              Open Planner Cockpit &rarr;
            </Link>
          </div>

          {/* 3. Client */}
          <div className="bg-white rounded-2xl p-6 border border-champagne-200/80 shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-burgundy-950">Client & Couple</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Digital agreement signing, interactive vendor selection (with auto-closing of competing quotes), 25+ checklist progress, and invoice transparency.
            </p>
            <Link
              to="/client"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-burgundy-800 mt-4 hover:underline"
            >
              Open Client Portal &rarr;
            </Link>
          </div>

          {/* 4. Vendor */}
          <div className="bg-white rounded-2xl p-6 border border-champagne-200/80 shadow-md hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-4">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-burgundy-950">Vendor Partner</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Catering bids submission, assigned wedding itinerary, day-of arrival check-in with delay notifications, and payment invoice monitoring.
            </p>
            <Link
              to="/vendor"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-burgundy-800 mt-4 hover:underline"
            >
              Open Vendor Workspace &rarr;
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
};

