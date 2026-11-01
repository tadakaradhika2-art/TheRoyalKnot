import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Crown, Sparkles, Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { RoleType } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, loginAsRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('client@royalknot.com');
  const [password, setPassword] = useState('Client@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      if (email.includes('admin')) navigate('/admin');
      else if (email.includes('planner')) navigate('/planner');
      else if (email.includes('vendor')) navigate('/vendor');
      else navigate('/client');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = async (role: RoleType, targetPath: string) => {
    setLoading(true);
    await loginAsRole(role);
    setLoading(false);
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-champagne-300 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-burgundy-900 to-burgundy-700 text-champagne-300 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Crown className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-champagne-700 font-bold block">
            The Royal Knot Access
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-burgundy-950 mt-1">
            Portal Authentication
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your designated wedding management cockpit.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* 1-Click Quick Demo Login Switcher */}
        <div className="bg-champagne-50/70 rounded-2xl p-4 border border-champagne-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-burgundy-950 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
            <span>Instant Role Demonstration:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickPersona('ROLE_ADMIN', '/admin')}
              className="p-2.5 rounded-xl bg-white border border-champagne-200 hover:border-burgundy-600 text-left transition-all hover:shadow-sm"
            >
              <div className="font-bold text-burgundy-950">👑 Admin</div>
              <div className="text-[10px] text-slate-400">Alexander Sterling</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('ROLE_PLANNER', '/planner')}
              className="p-2.5 rounded-xl bg-white border border-champagne-200 hover:border-burgundy-600 text-left transition-all hover:shadow-sm"
            >
              <div className="font-bold text-burgundy-950">📋 Planner</div>
              <div className="text-[10px] text-slate-400">Isabella Vance</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('ROLE_CLIENT', '/client')}
              className="p-2.5 rounded-xl bg-white border border-champagne-200 hover:border-burgundy-600 text-left transition-all hover:shadow-sm"
            >
              <div className="font-bold text-burgundy-950">💍 Couple</div>
              <div className="text-[10px] text-slate-400">The Sharmas</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPersona('ROLE_VENDOR', '/vendor')}
              className="p-2.5 rounded-xl bg-white border border-champagne-200 hover:border-burgundy-600 text-left transition-all hover:shadow-sm"
            >
              <div className="font-bold text-burgundy-950">🍽️ Vendor</div>
              <div className="text-[10px] text-slate-400">Royal Rasoi</div>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
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
    </div>
  );
};

