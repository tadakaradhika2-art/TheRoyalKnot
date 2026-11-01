import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Crown, Sparkles, Lock, Mail, ArrowRight } from 'lucide-react';
import { RoleType } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await login({ email, password });
      const userRole = loggedUser?.roles?.[0] || (loggedUser as any)?.role;
      if (userRole === 'ROLE_ADMIN') navigate('/admin');
      else if (userRole === 'ROLE_PLANNER') navigate('/planner');
      else if (userRole === 'ROLE_CLIENT') navigate('/client');
      else if (userRole === 'ROLE_VENDOR') navigate('/vendor');
      else navigate('/');
    } catch (err: any) {
      const message =
        err?.message && err.message !== 'Authentication failed'
          ? err.message
          : 'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = async (role: RoleType, targetPath: string) => {
    setLoading(true);
    setError(null);
    try {
      const loggedUser = await loginAsRole(role);
      const userRole = loggedUser?.roles?.[0] || (loggedUser as any)?.role;
      if (userRole === 'ROLE_ADMIN') navigate('/admin');
      else if (userRole === 'ROLE_PLANNER') navigate('/planner');
      else if (userRole === 'ROLE_CLIENT') navigate('/client');
      else if (userRole === 'ROLE_VENDOR') navigate('/vendor');
      else navigate(targetPath);
    } catch (err: any) {
      const message =
        err?.message && err.message !== 'Authentication failed'
          ? err.message
          : 'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl overflow-hidden border border-champagne-300 shadow-2xl grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Hero Brand Panel (Indian Palace Wedding Imagery) */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-8 text-white overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
            alt="Royal Indian Wedding Couple in Traditional Lehenga and Sherwani"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/70 to-burgundy-950/40" />

          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-champagne-300 mb-4">
              <Crown className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-champagne-300 font-bold block">
              Sovereign Matrimonial Atelier
            </span>
            <h2 className="font-serif text-2xl font-black text-white mt-1">
              THE ROYAL KNOT
            </h2>
            <p className="text-xs text-champagne-100/80 mt-2 leading-relaxed">
              India's premier wedding orchestration platform unifying Sacred Vedic Traditions, Heritage Palaces, and Real-Time Event Day Control.
            </p>
          </div>

          <div className="relative z-10 space-y-2.5 pt-6 border-t border-white/15 text-xs text-champagne-100/90">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
              <span>Rajasthan & Hyderabad Heritage Palaces</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
              <span>Awadhi, Mewari & South Indian Sadya Banquets</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
              <span>Minute-by-Minute Live Event Run-Sheets</span>
            </div>
          </div>
        </div>

        {/* Right Authentication Panel */}
        <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="text-center sm:text-left">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-burgundy-900 to-burgundy-700 text-champagne-300 flex items-center justify-center mb-3 shadow-md lg:hidden mx-auto">
                <Crown className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-champagne-700 font-bold block">
                Portal Authentication
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-burgundy-950 mt-1">
                Access Management Cockpit
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Authenticate with your credentials to access your designated role workspace.
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* 1-Click Quick Demo Login Switcher */}
            <div className="mt-5 bg-champagne-50/70 rounded-2xl p-4 border border-champagne-200">
              <div className="flex items-center justify-between text-xs font-bold text-burgundy-950 mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
                  <span>Instant Role Demonstration:</span>
                </div>
                <span className="text-[10px] text-champagne-800 font-semibold bg-champagne-200/60 px-2 py-0.5 rounded-full">1-Click</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickPersona('ROLE_ADMIN', '/admin')}
                  className="p-2.5 rounded-xl bg-white border border-champagne-200 hover:border-burgundy-600 text-left transition-all hover:shadow-sm"
                >
                  <div className="font-bold text-burgundy-950">👑 Admin</div>
                  <div className="text-[10px] text-slate-600 font-medium">Ranveer Rathore</div>
                  <div className="text-[9px] text-slate-400">Founder & CEO</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('ROLE_PLANNER', '/planner')}
                  className="p-2.5 rounded-xl bg-white border border-champagne-200 hover:border-burgundy-600 text-left transition-all hover:shadow-sm"
                >
                  <div className="font-bold text-burgundy-950">📋 Planner</div>
                  <div className="text-[10px] text-slate-600 font-medium">Ishaani Sharma</div>
                  <div className="text-[9px] text-slate-400">Lead Wedding Planner</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('ROLE_CLIENT', '/client')}
                  className="p-2.5 rounded-xl bg-white border border-champagne-200 hover:border-burgundy-600 text-left transition-all hover:shadow-sm"
                >
                  <div className="font-bold text-burgundy-950">💍 Couple</div>
                  <div className="text-[10px] text-slate-600 font-medium">Aanya & Arjun</div>
                  <div className="text-[9px] text-slate-400">Udaipur Palace Wedding</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickPersona('ROLE_VENDOR', '/vendor')}
                  className="p-2.5 rounded-xl bg-white border border-champagne-200 hover:border-burgundy-600 text-left transition-all hover:shadow-sm"
                >
                  <div className="font-bold text-burgundy-950">🍽️ Vendor</div>
                  <div className="text-[10px] text-slate-600 font-medium">Maharaja Catering</div>
                  <div className="text-[9px] text-slate-400">Chef Raghavendra Rao</div>
                </button>
              </div>
            </div>

            {/* Standard Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    placeholder="e.g. client@royalknot.com"
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-burgundy-900 to-burgundy-700 text-champagne-200 font-serif font-bold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 border border-champagne-400/30 disabled:opacity-50"
              >
                {loading ? <span>Signing In...</span> : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="hover:text-burgundy-900 font-medium flex items-center gap-1"
            >
              &larr; Return to Public Website
            </button>
            <span>Password: <code>Royal@2026!</code></span>
          </div>
        </div>

      </div>
    </div>
  );
};
