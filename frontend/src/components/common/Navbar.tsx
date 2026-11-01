import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Crown,
  Bell,
  LogOut,
  CheckCircle,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  LogIn,
  LayoutDashboard,
  ShieldCheck,
  User,
  HeartHandshake
} from 'lucide-react';
import { royalKnotApi } from '../../services/api';
import { NotificationItem, RoleType } from '../../types';

export const Navbar: React.FC = () => {
  const { user, role, logout, loginAsRole, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    loadNotifications();
    const interval = setInterval(loadNotifications, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const data = await royalKnotApi.getNotifications();
      setNotifications(data || []);
    } catch {
      // Ignore notification fetch errors when token expired/empty
    }
  };

  const handleRoleSwitch = async (newRole: RoleType) => {
    try {
      await loginAsRole(newRole);
      setShowRoleSwitcher(false);
      setMobileMenuOpen(false);
      if (newRole === 'ROLE_ADMIN') navigate('/admin');
      else if (newRole === 'ROLE_PLANNER') navigate('/planner');
      else if (newRole === 'ROLE_CLIENT') navigate('/client');
      else if (newRole === 'ROLE_VENDOR') navigate('/vendor');
    } catch (err) {
      console.error('Role switch failed', err);
    }
  };

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    navigate(`/#${sectionId}`);
  };

  const getDashboardRoute = () => {
    switch (role) {
      case 'ROLE_ADMIN':
        return '/admin';
      case 'ROLE_PLANNER':
        return '/planner';
      case 'ROLE_CLIENT':
        return '/client';
      case 'ROLE_VENDOR':
        return '/vendor';
      default:
        return '/login';
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'ROLE_ADMIN':
        return { icon: '👑', label: 'Admin / Founder', shortLabel: 'Admin' };
      case 'ROLE_PLANNER':
        return { icon: '📋', label: 'Wedding Planner', shortLabel: 'Planner' };
      case 'ROLE_CLIENT':
        return { icon: '💍', label: 'Couple / Client', shortLabel: 'Couple' };
      case 'ROLE_VENDOR':
        return { icon: '🍽️', label: 'Vendor Partner', shortLabel: 'Vendor' };
      default:
        return { icon: '👤', label: 'Member', shortLabel: 'Member' };
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const roleBadge = getRoleBadge();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-champagne-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-burgundy-950 via-burgundy-900 to-burgundy-700 flex items-center justify-center text-champagne-300 shadow-md group-hover:scale-105 transition-transform border border-champagne-400/30">
            <Crown className="w-6 h-6 drop-shadow" />
          </div>
          <div>
            <span className="font-serif text-lg sm:text-2xl font-black tracking-widest text-burgundy-950 block leading-tight">
              THE ROYAL KNOT
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-champagne-700 font-semibold uppercase block">
              Luxury Wedding Planning
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {!isAuthenticated ? (
            /* Unauthenticated Visitor Navigation */
            <>
              <button
                onClick={() => handleNavClick('about')}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-burgundy-900 transition-colors"
              >
                About
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-burgundy-900 transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('portfolio')}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-burgundy-900 transition-colors"
              >
                Our Weddings
              </button>
              <button
                onClick={() => handleNavClick('achievements')}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-burgundy-900 transition-colors"
              >
                Achievements
              </button>
              <button
                onClick={() => handleNavClick('investors')}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-burgundy-900 transition-colors"
              >
                Investors
              </button>
              <Link
                to="/packages"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  location.pathname === '/packages'
                    ? 'text-burgundy-900 font-bold border-b-2 border-champagne-500 pb-0.5'
                    : 'text-slate-600 hover:text-burgundy-900'
                }`}
              >
                Packages
              </Link>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-burgundy-900 transition-colors"
              >
                Enquiry
              </button>
            </>
          ) : (
            /* Authenticated Portal User Navigation */
            <>
              <Link
                to="/"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  location.pathname === '/'
                    ? 'text-burgundy-900 font-bold border-b-2 border-champagne-500 pb-0.5'
                    : 'text-slate-600 hover:text-burgundy-900'
                }`}
              >
                Public Site
              </Link>
              <Link
                to="/packages"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  location.pathname === '/packages'
                    ? 'text-burgundy-900 font-bold border-b-2 border-champagne-500 pb-0.5'
                    : 'text-slate-600 hover:text-burgundy-900'
                }`}
              >
                Packages
              </Link>
              <Link
                to="/enquiry"
                className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                  location.pathname === '/enquiry'
                    ? 'text-burgundy-900 font-bold border-b-2 border-champagne-500 pb-0.5'
                    : 'text-slate-600 hover:text-burgundy-900'
                }`}
              >
                Consultations
              </Link>

              {/* Direct Dashboard Button for Logged-In User */}
              <Link
                to={getDashboardRoute()}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-serif font-bold transition-all shadow-xs ${
                  location.pathname === getDashboardRoute()
                    ? 'bg-burgundy-950 text-champagne-300 ring-2 ring-champagne-400'
                    : 'bg-burgundy-900/10 text-burgundy-900 hover:bg-burgundy-900/20'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-champagne-600" />
                <span>My Dashboard</span>
              </Link>
            </>
          )}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            /* Unauthenticated Login Button */
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-800 text-champagne-200 text-xs sm:text-sm font-serif font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all border border-champagne-400/40"
            >
              <LogIn className="w-4 h-4 text-champagne-400" />
              <span>Login</span>
            </Link>
          ) : (
            /* Authenticated Actions: Role Badge, Persona Switcher (for demo), Notifications, Logout */
            <>
              {/* Persona Switcher / Profile Badge */}
              <div className="relative">
                <button
                  onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-champagne-50 border border-champagne-300 text-burgundy-950 text-xs font-semibold hover:bg-champagne-100 transition-colors shadow-xs"
                  title="Active Account & Role"
                >
                  <span className="text-sm">{roleBadge.icon}</span>
                  <div className="hidden sm:block text-left">
                    <div className="font-bold text-[11px] leading-tight text-burgundy-900">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-champagne-700 font-semibold">
                      {roleBadge.shortLabel}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-500 ml-0.5" />
                </button>

                {showRoleSwitcher && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-champagne-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Logged In User
                        </div>
                        <div className="text-xs font-bold text-burgundy-950">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-[10px] text-slate-500">{user?.email}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-champagne-100 text-champagne-900 text-[10px] font-bold">
                        {roleBadge.shortLabel}
                      </span>
                    </div>

                    <div className="px-4 pt-2.5 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Switch Demo Role
                    </div>
                    <button
                      onClick={() => handleRoleSwitch('ROLE_ADMIN')}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-champagne-50/80 transition-colors ${
                        role === 'ROLE_ADMIN' ? 'bg-champagne-50 font-bold text-burgundy-950' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">👑</span>
                        <div>
                          <div className="font-semibold">Ranveer Singh Rathore</div>
                          <div className="text-[10px] text-slate-400">Founder & CEO (Admin)</div>
                        </div>
                      </div>
                      {role === 'ROLE_ADMIN' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSwitch('ROLE_PLANNER')}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-champagne-50/80 transition-colors ${
                        role === 'ROLE_PLANNER' ? 'bg-champagne-50 font-bold text-burgundy-950' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">📋</span>
                        <div>
                          <div className="font-semibold">Ishaani Sharma</div>
                          <div className="text-[10px] text-slate-400">Lead Wedding Planner</div>
                        </div>
                      </div>
                      {role === 'ROLE_PLANNER' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSwitch('ROLE_CLIENT')}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-champagne-50/80 transition-colors ${
                        role === 'ROLE_CLIENT' ? 'bg-champagne-50 font-bold text-burgundy-950' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">💍</span>
                        <div>
                          <div className="font-semibold">Aanya & Arjun Sharma</div>
                          <div className="text-[10px] text-slate-400">Client / Couple</div>
                        </div>
                      </div>
                      {role === 'ROLE_CLIENT' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSwitch('ROLE_VENDOR')}
                      className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-champagne-50/80 transition-colors ${
                        role === 'ROLE_VENDOR' ? 'bg-champagne-50 font-bold text-burgundy-950' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">🍽️</span>
                        <div>
                          <div className="font-semibold">Chef Raghavendra Rao</div>
                          <div className="text-[10px] text-slate-400">Maharaja Catering & Events</div>
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
                  className="relative p-2 rounded-full text-slate-600 hover:text-burgundy-900 hover:bg-champagne-50 transition-colors"
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
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-champagne-200 py-3 z-50 animate-in fade-in">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-burgundy-950">System Notifications</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-champagne-100 text-champagne-800 font-semibold">
                        {notifications.length} alerts
                      </span>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="p-3 hover:bg-champagne-50/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                              <span className="text-[9px] text-slate-400">Alert</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-snug">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 rounded-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Log out of session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-burgundy-900 hover:bg-slate-100 transition-colors"
            title="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-champagne-200 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 shadow-xl">
          {!isAuthenticated ? (
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick('about')}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                About The Royal Knot
              </button>
              <button
                onClick={() => handleNavClick('services')}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                Services
              </button>
              <button
                onClick={() => handleNavClick('portfolio')}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                Our Weddings
              </button>
              <button
                onClick={() => handleNavClick('achievements')}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                Achievements
              </button>
              <button
                onClick={() => handleNavClick('investors')}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                Investor Overview
              </button>
              <Link
                to="/packages"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50 block"
              >
                Services & Packages
              </Link>
              <button
                onClick={() => handleNavClick('contact')}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                Plan Your Wedding / Contact
              </button>
              <div className="pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-burgundy-900 text-champagne-200 font-serif font-bold text-sm block shadow-md"
                >
                  Login
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-2">
              <div className="px-3 py-2 bg-champagne-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-burgundy-950">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-[10px] text-slate-500">{user?.email}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-champagne-200 text-burgundy-950 text-[10px] font-bold">
                  {roleBadge.shortLabel}
                </span>
              </div>

              <Link
                to={getDashboardRoute()}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-serif font-bold text-champagne-200 bg-burgundy-950 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-champagne-400" />
                <span>My Dashboard ({roleBadge.shortLabel})</span>
              </Link>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                Public Website
              </Link>
              <Link
                to="/packages"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                Services & Packages
              </Link>
              <Link
                to="/enquiry"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-champagne-50"
              >
                Plan Your Wedding
              </Link>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
