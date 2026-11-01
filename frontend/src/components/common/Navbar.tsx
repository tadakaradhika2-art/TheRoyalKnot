import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Crown, Bell, User, LogOut, CheckCircle, Sparkles, ChevronDown } from 'lucide-react';
import { royalKnotApi } from '../../services/api';
import { NotificationItem, RoleType } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, logout, loginAsRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await royalKnotApi.getNotifications();
      setNotifications(data || []);
    } catch {
      // offline fallback notifications
    }
  };

  const handleRoleSwitch = async (newRole: RoleType) => {
    await loginAsRole(newRole);
    setShowRoleSwitcher(false);
    if (newRole === 'ROLE_ADMIN') navigate('/admin');
    else if (newRole === 'ROLE_PLANNER') navigate('/planner');
    else if (newRole === 'ROLE_CLIENT') navigate('/client');
    else if (newRole === 'ROLE_VENDOR') navigate('/vendor');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-champagne-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-burgundy-800 to-burgundy-600 flex items-center justify-center text-champagne-300 shadow-md group-hover:scale-105 transition-transform">
            <Crown className="w-6 h-6 drop-shadow" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-black tracking-widest text-burgundy-950 block leading-tight">
              THE ROYAL KNOT
            </span>
            <span className="text-[10px] tracking-[0.25em] text-champagne-700 font-semibold uppercase block">
              Luxury Wedding Planning
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-burgundy-800 font-bold border-b-2 border-champagne-500 pb-0.5' : 'text-slate-600 hover:text-burgundy-800'
            }`}
          >
            Welcome
          </Link>
          <Link
            to="/packages"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/packages' ? 'text-burgundy-800 font-bold border-b-2 border-champagne-500 pb-0.5' : 'text-slate-600 hover:text-burgundy-800'
            }`}
          >
            Services & Packages
          </Link>
          <Link
            to="/enquiry"
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/enquiry' ? 'text-burgundy-800 font-bold border-b-2 border-champagne-500 pb-0.5' : 'text-slate-600 hover:text-burgundy-800'
            }`}
          >
            Plan Your Wedding
          </Link>

          {/* Direct links to 4 Dashboards */}
          <div className="h-4 w-px bg-slate-200" />
          <Link
            to="/admin"
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
              location.pathname.startsWith('/admin') ? 'bg-burgundy-900 text-champagne-300 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Admin
          </Link>
          <Link
            to="/planner"
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
              location.pathname.startsWith('/planner') ? 'bg-burgundy-900 text-champagne-300 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Planner
          </Link>
          <Link
            to="/client"
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
              location.pathname.startsWith('/client') ? 'bg-burgundy-900 text-champagne-300 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Couple
          </Link>
          <Link
            to="/vendor"
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
              location.pathname.startsWith('/vendor') ? 'bg-burgundy-900 text-champagne-300 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Vendor
          </Link>
        </nav>

        {/* Right Action Tools: Role Switcher & Notifications */}
        <div className="flex items-center gap-3">
          
          {/* Quick Persona Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-champagne-50 border border-champagne-300/80 text-burgundy-900 text-xs font-semibold hover:bg-champagne-100 transition-colors shadow-xs"
              title="Click to switch between Admin, Planner, Client, and Vendor dashboards"
            >
              <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
              <span>
                {role === 'ROLE_ADMIN' ? '👑 Admin / Founder' :
                 role === 'ROLE_PLANNER' ? '📋 Wedding Planner' :
                 role === 'ROLE_CLIENT' ? '💍 Couple (The Sharmas)' :
                 role === 'ROLE_VENDOR' ? '🍽️ Vendor (Royal Rasoi)' : 'Select Role'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-champagne-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Switch Active Persona
                </div>
                <button
                  onClick={() => handleRoleSwitch('ROLE_ADMIN')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-champagne-50 ${role === 'ROLE_ADMIN' ? 'text-burgundy-900 font-bold bg-champagne-50/70' : 'text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">👑</span>
                    <div>
                      <div className="font-medium">Admin / Founder</div>
                      <div className="text-[10px] text-slate-400">Alexander Sterling</div>
                    </div>
                  </div>
                  {role === 'ROLE_ADMIN' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('ROLE_PLANNER')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-champagne-50 ${role === 'ROLE_PLANNER' ? 'text-burgundy-900 font-bold bg-champagne-50/70' : 'text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <div>
                      <div className="font-medium">Wedding Planner</div>
                      <div className="text-[10px] text-slate-400">Isabella Vance</div>
                    </div>
                  </div>
                  {role === 'ROLE_PLANNER' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('ROLE_CLIENT')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-champagne-50 ${role === 'ROLE_CLIENT' ? 'text-burgundy-900 font-bold bg-champagne-50/70' : 'text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">💍</span>
                    <div>
                      <div className="font-medium">Client / Couple</div>
                      <div className="text-[10px] text-slate-400">Eleanor & Arjun Sharma</div>
                    </div>
                  </div>
                  {role === 'ROLE_CLIENT' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  onClick={() => handleRoleSwitch('ROLE_VENDOR')}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-champagne-50 ${role === 'ROLE_VENDOR' ? 'text-burgundy-900 font-bold bg-champagne-50/70' : 'text-slate-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🍽️</span>
                    <div>
                      <div className="font-medium">Vendor Partner</div>
                      <div className="text-[10px] text-slate-400">Royal Rasoi Caterers</div>
                    </div>
                  </div>
                  {role === 'ROLE_VENDOR' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-full text-slate-600 hover:text-burgundy-800 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-champagne-200 py-3 z-50 animate-in fade-in">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-burgundy-950">Notifications</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-champagne-100 text-champagne-800 font-semibold">
                    {notifications.length} alerts
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-champagne-50/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                          <span className="text-[9px] text-slate-400">Just now</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Logout / User avatar */}
          <button
            onClick={logout}
            className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

