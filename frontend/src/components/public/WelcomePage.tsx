import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RoyalKnotAnimation } from '../common/RoyalKnotAnimation';
import {
  Crown,
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Award,
  Clock,
  ArrowRight,
  ChevronRight,
  Star,
  FileCheck2,
  FileSignature,
  Utensils,
  DollarSign,
  Building,
  Mail,
  Phone,
  Send,
  Lock,
  Layers,
  Compass
} from 'lucide-react';
import { royalKnotApi } from '../../services/api';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  // Consultation form state
  const [coupleNames, setCoupleNames] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [weddingDate, setWeddingDate] = useState('2026-11-20');
  const [guestCount, setGuestCount] = useState(400);
  const [weddingLocation, setWeddingLocation] = useState('Umaid Bhawan Palace, Jodhpur');
  const [selectedPackage, setSelectedPackage] = useState('Full-Service Wedding');
  const [budget, setBudget] = useState(2500000);
  const [requirements, setRequirements] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const result = await royalKnotApi.createEnquiry({
        coupleNames,
        email,
        phone,
        preferredWeddingDate: weddingDate,
        estimatedGuestCount: Number(guestCount),
        weddingLocation,
        selectedPackage,
        maximumBudget: Number(budget),
        additionalRequirements: requirements,
      });

      setSubmitSuccess(`Your consultation enquiry for ${result.coupleNames} has been registered! A Senior Royal Knot Planner has been notified.`);
      setCoupleNames('');
      setEmail('');
      setPhone('');
      setRequirements('');
    } catch (err: any) {
      setSubmitError(err?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-slate-800">

      {/* ============================================================== */}
      {/* 1. HERO SECTION */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-champagne-100/70 via-ivory to-ivory border-b border-champagne-300/40">
        <div className="max-w-6xl mx-auto text-center relative z-10">

          {/* Animated Signature Knot & Rings */}
          <div className="mb-6">
            <RoyalKnotAnimation />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-burgundy-900/10 border border-burgundy-900/20 text-burgundy-900 text-xs font-serif font-bold uppercase tracking-widest mb-4">
            <Crown className="w-3.5 h-3.5 text-champagne-600" />
            <span>India's Sovereign Luxury Wedding Atelier & Palace Destination Specialist</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-burgundy-950 tracking-tight leading-tight max-w-4xl mx-auto">
            Where Heritage Meets Haute Couture
          </h1>

          <p className="max-w-3xl mx-auto text-slate-700 text-sm sm:text-base lg:text-lg leading-relaxed mt-5">
            THE ROYAL KNOT orchestrates India's most extraordinary royal palace, heritage fort, and coastal destination weddings. From sacred Vedic muhurtham rituals and vibrant Sangeet galas to gourmet multi-course regional banquets, we blend centuries of Indian matrimonial traditions with architectural precision and itemized financial transparency.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('portfolio')}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-burgundy-900 to-burgundy-700 text-champagne-200 font-serif font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-champagne-400/30"
            >
              <span>Explore Royal Weddings</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollTo('services')}
              className="px-8 py-3.5 rounded-full bg-white text-burgundy-900 font-serif font-bold text-sm shadow-md hover:shadow-lg hover:bg-champagne-50 transition-all border border-champagne-300"
            >
              Ceremonial Services
            </button>

            <Link
              to="/login"
              className="px-8 py-3.5 rounded-full bg-champagne-200/80 text-burgundy-950 font-serif font-bold text-sm hover:bg-champagne-300 transition-all border border-champagne-400 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-burgundy-800" />
              <span>Login</span>
            </Link>
          </div>

          {/* Hero Feature Showcase Card with Indian Bride & Groom */}
          <div className="mt-12 rounded-3xl overflow-hidden border border-champagne-300 shadow-2xl bg-white max-w-5xl mx-auto text-left grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-7 h-72 md:h-96 relative">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80"

                alt="Indian Royal Wedding Couple in Traditional Lehenga & Sherwani at Palace Mandap"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-burgundy-950/30 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-bold">Featured Royal Celebration</span>
                <h3 className="font-serif text-2xl font-bold">The Royal Udaipur Palace Wedding</h3>
                <p className="text-xs text-champagne-100/90 mt-1">Aanya Sharma & Arjun Mehta &bull; City Palace, Udaipur &bull; 400 Guests</p>
              </div>
            </div>

            <div className="md:col-span-5 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-champagne-50/50 to-white">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-champagne-700 font-bold block mb-1">Authentic Cultural Identity</span>
                <h4 className="font-serif text-lg font-bold text-burgundy-950">Grand Indian Matrimony</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Every celebration is curated around India's sacred ceremonial cadence: Auspicious Muhurtham, Poolside Marigold Haldi, Mehendi Courtyards, High-Energy Sangeet, Grand Baraat with Brass Troupe, and Sacred Vedic Pheras under hand-carved floral Mandaps.
                </p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-burgundy-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Udaipur, Jodhpur & Jaipur Heritage Palaces</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-burgundy-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Awadhi, Rajasthani & South Indian Sadya Feasts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-burgundy-900">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Minute-by-Minute Live Wedding Control Room</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-champagne-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-champagne-800 uppercase tracking-wider">100% Transparent INR Ledgers</span>
                <button onClick={() => scrollTo('services')} className="text-xs font-bold text-burgundy-900 hover:text-burgundy-700 flex items-center gap-1">
                  Explore Services &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Authentic Indian Wedding Visual Showcase Strip */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-champagne-300 relative group h-40">
              <img
                src="https://images.unsplash.com/photo-1587271636175-90d58cdad458?auto=format&fit=crop&w=600&q=80"
                alt="Regal Indian Bride in Traditional Zardozi Lehenga"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-serif font-bold text-champagne-200">Royal Bridal Lehengas</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-champagne-300 relative group h-40">
              <img
                src="https://images.unsplash.com/photo-1630526720753-aa4e71acf67d?auto=format&fit=crop&w=600&q=80"
                alt="Rajasthan Palace Architecture in Jodhpur & Udaipur"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-serif font-bold text-champagne-200">Heritage Forts & Palaces</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-champagne-300 relative group h-40">
              <img
                src="https://images.unsplash.com/photo-1599462616558-2b75fd26a283?auto=format&fit=crop&w=600&q=80"
                alt="Sacred Vedic Pheras & Mandap Rituals"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-serif font-bold text-champagne-200">Vedic Rituals & Pheras</span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-champagne-300 relative group h-40">
              <img
                src="https://plus.unsplash.com/premium_photo-1682092597591-81f59c80d9ec?auto=format&fit=crop&w=600&q=80"
                alt="Traditional Haldi & Marigold Decor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-[11px] font-serif font-bold text-champagne-200">Haldi & Sangeet Celebrations</span>
              </div>
            </div>
          </div>

          {/* Quick Credibility Trust Badges */}
          <div className="mt-14 pt-8 border-t border-champagne-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto text-center">
            <div>
              <div className="font-serif text-2xl font-black text-burgundy-950">25+</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Palace Weddings</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-black text-burgundy-950">₹4.20+ Cr</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Annual Portfolio</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-black text-burgundy-950">40+</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Vetted Elite Vendors</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-black text-burgundy-950">98.2%</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">On-Time Execution</div>
            </div>
          </div>

        </div>
      </section>


      {/* ============================================================== */}
      {/* 2. ABOUT THE COMPANY */}
      {/* ============================================================== */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-700 font-bold block mb-2">
              Our Matrimonial Heritage & Vision
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-950 leading-tight">
              An Architectural Approach to Grand Indian Matrimony
            </h2>
            <p className="text-sm text-slate-600 mt-4 leading-relaxed">
              Founded by Ranveer Singh Rathore, <strong>THE ROYAL KNOT</strong> was established on a radical belief: high-end luxury Indian weddings should combine the sacred spiritual sanctity of centuries-old rituals with the highest caliber of contemporary operational rigor.
            </p>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Unlike traditional event planners who rely on fragmented spreadsheets and opaque markups, The Royal Knot operates with full financial transparency, digital service agreements, competitive 3-way vendor bidding, and real-time wedding-day satellite coordination tailored to India’s diverse matrimonial cultures.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-champagne-100 text-burgundy-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-burgundy-950">Multi-Day Ceremonial Orchestration</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    End-to-end synchronization of each sacred milestone: Poolside Marigold Haldi, Bohemian Mehendi Courtyards, High-Energy Choreographed Sangeet, Grand Baraat Processions with Brass Ensembles, Sacred Vedic Pheras around the Havan Kund, and Opulent Royal Receptions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-champagne-100 text-burgundy-900 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-burgundy-950">Vedic Muhurtham Fidelity & Ritual Precision</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Meticulous coordination with Vedic priests, Astrologers, and Kazi scholars ensuring strict fidelity to auspicious Muhurtham timings, sacred samagri procurement, and regional customs across Rajasthani, Telugu, Tamil, Hyderabadi, and Punjabi celebrations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-champagne-100 text-burgundy-900 flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-burgundy-950">The Five-Phase Matrimonial Framework</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Family Discovery & Vows &bull; Heritage Palace Spatial Architecture &bull; Transparent Multi-Bid Procurement &bull; 25-Point Checklist Walkthrough &bull; Minute-by-Minute Live Day-of Control Room.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-champagne-300 relative group h-64 sm:h-72">
              <img
                src="https://images.unsplash.com/photo-1665960213508-48f07086d49c?auto=format&fit=crop&w=800&q=80"
                alt="Royal Palace Wedding Courtyard with Illuminated Stone Arches"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/90 via-transparent to-transparent flex items-end p-5">
                <div className="text-white">
                  <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-bold block">Heritage Venues</span>
                  <div className="font-serif font-bold text-base">City Palace, Umaid Bhawan & Falaknuma Residencies</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white rounded-2xl p-4 border border-champagne-200/90 shadow-sm text-center">
                <div className="font-serif font-bold text-burgundy-950 text-sm">Royal Palaces</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Udaipur, Jodhpur, Jaipur & Hyderabad</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-champagne-200/90 shadow-sm text-center">
                <div className="font-serif font-bold text-burgundy-950 text-sm">Regional Feasts</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Awadhi, Nizami & South Indian Sadya</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-champagne-200/90 shadow-sm text-center">
                <div className="font-serif font-bold text-burgundy-950 text-sm">Live Control</div>
                <div className="text-[11px] text-slate-500 mt-0.5">08:00 AM - 02:00 AM Call Sheets</div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-champagne-200/90 shadow-sm text-center">
                <div className="font-serif font-bold text-burgundy-950 text-sm">Digital Ledger</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Client Canvas Signatures & Rupee Ledgers</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ============================================================== */}
      {/* 3. LUXURY SERVICES */}
      {/* ============================================================== */}
      <section id="services" className="py-20 bg-champagne-50/50 border-y border-champagne-200/60 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-700 font-bold block mb-2">
              Comprehensive Matrimonial Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-950">
              Indian Luxury Wedding Services
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every ceremonial milestone is managed by our senior directors, certified master planners, and on-site hospitality coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Service 1: Full-Service Wedding Planning */}
            <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=600&q=80"
                    alt="Full-Service Indian Wedding Planning - Couple in Royal Attire"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-serif font-bold text-champagne-200">Full-Service Royal Luxury</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-burgundy-950">
                    Full-Service Wedding Planning
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    End-to-end luxury management covering concept, design, palace curation, vendor procurement, production, logistics, live execution & guest relations.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Dedicated Senior Director & 8 On-site Planners</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Bespoke Spatial Mandap & Stage Production</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 25+ Automated Milestone Checklists</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-900 font-serif">₹25,00,000 Base</span>
                  <Link to="/packages" className="text-xs font-bold text-champagne-700 hover:text-burgundy-900 flex items-center gap-1">
                    View Package &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Service 2: Partial Wedding Planning */}
            <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1727430256509-0f897d6f4765?auto=format&fit=crop&w=600&q=80"
                    alt="Partial Coordination - Heritage Palace Courtyard"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-serif font-bold text-champagne-200">Partial Coordination</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-burgundy-950">
                    Partial Coordination Elegance
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Designed for couples who have contracted their key venues but require professional curation, vendor coordination, and 3-day on-site ceremony execution.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 3 On-site Planners & Final 6-Week Takeover</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Timeline Architecture & Rehearsal Direction</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Day-of Vendor Arrival & Sound Checks</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-900 font-serif">₹10,00,000 Base</span>
                  <Link to="/packages" className="text-xs font-bold text-champagne-700 hover:text-burgundy-900 flex items-center gap-1">
                    View Package &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Service 3: Day-of Wedding Coordination */}
            <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1735052712489-f45220126a0c?auto=format&fit=crop&w=600&q=80"
                    alt="Day-of Coordination - Sacred Vedic Pheras"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-serif font-bold text-champagne-200">Day-of Direction</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-burgundy-950">
                    Day-of Wedding Coordination
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Comprehensive master execution on the wedding day ensuring every Baraat, Varmala, Phera, and banquet runs like clockwork without family stress.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Master 08:00 AM to 02:00 AM Call Sheets</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Radio-linked Onsite Hospitality & Escort Crew</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Live Vendor Arrival & Delay Mitigation</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-900 font-serif">Included in Packages</span>
                  <button onClick={() => scrollTo('contact')} className="text-xs font-bold text-champagne-700 hover:text-burgundy-900">
                    Consult &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Service 4: Venue & Mandap Decoration */}
            <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1708606811579-23b18fc48007?auto=format&fit=crop&w=600&q=80"
                    alt="Mandap & Venue Decor - Royal Floral Arches"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-serif font-bold text-champagne-200">Mandap & Venue Decor</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-burgundy-950">
                    Venue & Mandap Decoration
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Bespoke carved wooden mandaps, marigold & fresh rose floral chandeliers, architectural palace uplighting, fairy light canopies, and sacred havan staging.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 10,00,000+ Fresh Marigolds, Roses & Orchids</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Royal Courtyard & Ballroom Spatial 3D Renderings</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Authentic Sacred Havan Kund Fireplace Setup</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-900 font-serif">Bespoke Curation</span>
                  <button onClick={() => scrollTo('contact')} className="text-xs font-bold text-champagne-700 hover:text-burgundy-900">
                    Inquire &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Service 5: Catering & Traditional Food */}
            <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1738202321539-9ed4a727f735?auto=format&fit=crop&w=600&q=80"
                    alt="Royal Catering & Traditional Food Feasts"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-serif font-bold text-champagne-200">Gourmet Catering</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-burgundy-950">
                    Catering & Traditional Feasts
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Transparent 3-way caterer proposal matrix comparing authentic live stations, antique brass chafing dishes, per-plate costs, and headcount adjustments.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Awadhi, Rajasthani, Nizami & Royal Sadya</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 8 Live Sigri Grills & Chaat Galli Counters</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Single-click Selection Closing Competing Bids</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-900 font-serif">Transparent INR Bids</span>
                  <button onClick={() => scrollTo('contact')} className="text-xs font-bold text-champagne-700 hover:text-burgundy-900">
                    Compare &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Service 6: Photography & Videography */}
            <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1583878545126-2f1ca0142714?auto=format&fit=crop&w=600&q=80"
                    alt="Photography & Cinematic Videography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-serif font-bold text-champagne-200">Cinematography</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-burgundy-950">
                    Photography & Cinematography
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Candid luxury wedding portraiture, traditional ritual archives, and cinematic 4K drone cinematography capturing every Baraat, Varmala, and Phera.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Master Candid Photographers & Drone Pilots</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Same-Day Reception Edit Cinematic Trailers</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Archival Leather-bound Wedding Coffee Table Books</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-900 font-serif">Curated Master Artists</span>
                  <button onClick={() => scrollTo('contact')} className="text-xs font-bold text-champagne-700 hover:text-burgundy-900">
                    View Reels &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Service 7: Entertainment & Sangeet */}
            <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1691030256235-47d75d5890b9?auto=format&fit=crop&w=600&q=80"
                    alt="Entertainment & Sangeet Orchestration"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-serif font-bold text-champagne-200">Sangeet & Entertainment</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-burgundy-950">
                    Entertainment & Sangeet
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Celebrity Sufi maestros, classical Shehnai & Nadaswaram players, high-energy Punjabi Dhol troupes, and choreographed family Sangeet dance sequences.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Classical Shehnai & Vedic Procession Troupe</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Bollywood Choreographer & Sound Engineer</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Concert-Grade Sound, Trussing & Intelligent Lights</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-900 font-serif">Concert Precision</span>
                  <button onClick={() => scrollTo('contact')} className="text-xs font-bold text-champagne-700 hover:text-burgundy-900">
                    Explore &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Service 8: Vendor Coordination */}
            <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1555447405-057915b40299?auto=format&fit=crop&w=600&q=80"
                    alt="Vendor Coordination - Mehendi Artists & Logistics"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-serif font-bold text-champagne-200">Vendor Coordination</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg font-bold text-burgundy-950">
                    Vendor Coordination & Matrix
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Transparent procurement matrix comparing proposals from vetted caterers, organic henna artists, brass bands, and decorators with strict arrival tracking.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-700">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> 40+ Vetted Gold Vendor Partner Ecosystem</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Real-time Vendor Check-In Transmitter</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Milestone Disbursements Linked to Verification</li>
                  </ul>
                </div>
              </div>
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-burgundy-900 font-serif">40+ Partners</span>
                  <button onClick={() => scrollTo('contact')} className="text-xs font-bold text-champagne-700 hover:text-burgundy-900">
                    Partner &rarr;
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================== */}
      {/* 4. PREVIOUS WEDDINGS PORTFOLIO */}
      {/* ============================================================== */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100 text-champagne-900 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-champagne-700" />
            <span>Demonstration Portfolio &bull; Fictional Projects</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-950">
            Our Previous Indian Weddings
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A showcase of the diverse matrimonial cultures and destination celebrations curated by The Royal Knot atelier across India’s most celebrated heritage locations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Style 1: Royal Rajasthani Palace Wedding */}
          <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-xl group hover:shadow-2xl transition-all flex flex-col justify-between">
            <div className="h-72 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1519998705700-db9884b452a3?auto=format&fit=crop&w=600&q=80"
                alt="Royal Rajasthani Palace Wedding - Aanya Sharma & Arjun Mehta"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/40 to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-champagne-300 border border-white/15">
                400 Guests &bull; Udaipur
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/90 text-[10px] font-bold text-white shadow-sm">
                Demonstration Project
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-bold block">1. Royal Rajasthani Palace Wedding</span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">Aanya Sharma & Arjun Mehta</h3>
                <p className="text-[11px] text-champagne-100/90 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-champagne-400 shrink-0" />
                  <span>City Palace, Udaipur &bull; Royal Rajasthani Heritage & 24K Gold</span>
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Ceremony Details:</strong> Grand vintage Rolls-Royce Baraat procession, revolving lakeside Varmala stage, and 8 live Awadhi & Mewari food counters curated by Maharaja Catering & Events.
                </p>
                <div className="mt-2 text-[11px] text-slate-500">
                  <strong>Services Provided:</strong> Full-Service Royal Luxury Planning, Maharaja Catering & Events, Jaipur Heritage Decor, Saptapadi Royal Brass Band.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">400 Guests</span>
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">Mewari Royal Banquet</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">Executed On Schedule</span>
              </div>
            </div>
          </div>

          {/* Style 2: Traditional Telugu Wedding */}
          <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-xl group hover:shadow-2xl transition-all flex flex-col justify-between">
            <div className="h-72 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1577362227095-696968dfd590?auto=format&fit=crop&w=600&q=80"
                alt="Traditional Telugu Wedding - Priya Reddy & Karthik Varma"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/40 to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-champagne-300 border border-white/15">
                450 Guests &bull; Hyderabad
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/90 text-[10px] font-bold text-white shadow-sm">
                Demonstration Project
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-bold block">2. Traditional Telugu Wedding</span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">Priya Reddy & Karthik Varma</h3>
                <p className="text-[11px] text-champagne-100/90 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-champagne-400 shrink-0" />
                  <span>Heritage Palace Grounds, Hyderabad &bull; Temple Kanjeevaram Gold</span>
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Ceremony Details:</strong> Auspicious dawn Muhurtham, sacred Jeelakarra Bellam ritual, Mangalasutram tying, pearl Talambralu shower, classical Nadaswaram recital, and 28-course royal feast.
                </p>
                <div className="mt-2 text-[11px] text-slate-500">
                  <strong>Services Provided:</strong> Muhurtham Timing Direction, Traditional Mandap Styling, Deccan Royal Banquets, Vedic Coordination.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">450 Guests</span>
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">Deccan Royal Banquets</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">Zero Muhurtham Delays</span>
              </div>
            </div>
          </div>

          {/* Style 3: Grand Hyderabadi Wedding */}
          <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-xl group hover:shadow-2xl transition-all flex flex-col justify-between">
            <div className="h-72 relative overflow-hidden">
              <img
                src="https://plus.unsplash.com/premium_photo-1682092632793-c7d75b23718e?auto=format&fit=crop&w=600&q=80"
                alt="Grand Hyderabadi Wedding - Ananya Kapoor & Rohan Malhotra"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/40 to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-champagne-300 border border-white/15">
                500 Guests &bull; Hyderabad
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/90 text-[10px] font-bold text-white shadow-sm">
                Demonstration Project
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-bold block">3. Grand Hyderabadi Wedding</span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">Ananya Kapoor & Rohan Malhotra</h3>
                <p className="text-[11px] text-champagne-100/90 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-champagne-400 shrink-0" />
                  <span>Taj Falaknuma Palace, Hyderabad &bull; Nizami Emerald & Pearls</span>
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Ceremony Details:</strong> Historic 101-seat dining table royal reception, authentic slow-simmered Dum Pukht Gosht Biryani by Deccan Royal Kitchens, and candlelit qawwali night.
                </p>
                <div className="mt-2 text-[11px] text-slate-500">
                  <strong>Services Provided:</strong> Full-Service Palace Production, Deccan Royal Kitchens, Nizami Floral Architecture, Sufi Stage Ensemble.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">500 Guests</span>
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">Nizami Grand Dawat</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">100% Satisfaction</span>
              </div>
            </div>
          </div>

          {/* Style 4: Elegant South Indian Wedding */}
          <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-xl group hover:shadow-2xl transition-all flex flex-col justify-between">
            <div className="h-72 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1654156577076-e0350ba86cc1?auto=format&fit=crop&w=600&q=80"
                alt="Elegant South Indian Wedding - Meera Iyer & Aditya Nair"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/40 to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-champagne-300 border border-white/15">
                400 Guests &bull; Bangalore
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/90 text-[10px] font-bold text-white shadow-sm">
                Demonstration Project
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-bold block">4. Elegant South Indian Wedding</span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">Meera Iyer & Aditya Nair</h3>
                <p className="text-[11px] text-champagne-100/90 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-champagne-400 shrink-0" />
                  <span>Bangalore Palace Temple Courtyard &bull; Pure Temple Mogra & Silk</span>
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Ceremony Details:</strong> Dawn Kashi Yatra, Oonjal swing ceremony with classical Carnatic musicians, mandap draped in 5,000 meters of fresh jasmine, and traditional Sadya on banana leaves.
                </p>
                <div className="mt-2 text-[11px] text-slate-500">
                  <strong>Services Provided:</strong> Vedic Temple Mandap Decor, Annapurna Wedding Caterers, Nadaswaram Troupe, Floral Architecture.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">400 Guests</span>
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">Annapurna Caterers</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">Vedic Precision</span>
              </div>
            </div>
          </div>

          {/* Style 5: North Indian Destination Wedding */}
          <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-xl group hover:shadow-2xl transition-all flex flex-col justify-between">
            <div className="h-72 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1783188223242-07c15cabbf18?auto=format&fit=crop&w=600&q=80"
                alt="North Indian Destination Wedding - Diya Singh & Vivaan Rajput"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/40 to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-champagne-300 border border-white/15">
                350 Guests &bull; Jaipur
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/90 text-[10px] font-bold text-white shadow-sm">
                Demonstration Project
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-bold block">5. North Indian Destination Wedding</span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">Diya Singh & Vivaan Rajput</h3>
                <p className="text-[11px] text-champagne-100/90 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-champagne-400 shrink-0" />
                  <span>Rambagh Palace, Jaipur &bull; Imperial Rajputana & Marigold</span>
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Ceremony Details:</strong> Sun-drenched pool deck Haldi ceremony with 10,000 marigolds, 21 royal brass band Baraat musicians, elephant salutation, and midnight sacred fire Pheras.
                </p>
                <div className="mt-2 text-[11px] text-slate-500">
                  <strong>Services Provided:</strong> Destination Hospitality Management, Jaipur Heritage Decor, Royal Brass Band & Escort, Haldi Pool Deck Production.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">350 Guests</span>
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">Pure Desi Ghee Classics</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">On-Time Execution</span>
              </div>
            </div>
          </div>

          {/* Style 6: Luxury Beachside Indian Wedding */}
          <div className="bg-white rounded-3xl overflow-hidden border border-champagne-200 shadow-xl group hover:shadow-2xl transition-all flex flex-col justify-between">
            <div className="h-72 relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1769500810743-5e5dd4fd5848?auto=format&fit=crop&w=800&q=80"
                alt="Luxury Beachside Indian Wedding - Kavya Patel & Siddharth Shah"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950 via-burgundy-950/40 to-transparent" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-champagne-300 border border-white/15">
                300 Guests &bull; Goa
              </div>
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500/90 text-[10px] font-bold text-white shadow-sm">
                Demonstration Project
              </div>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] uppercase tracking-widest text-champagne-300 font-bold block">6. Luxury Beachside Indian Wedding</span>
                <h3 className="font-serif text-xl font-bold text-white mt-0.5">Kavya Patel & Siddharth Shah</h3>
                <p className="text-[11px] text-champagne-100/90 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-champagne-400 shrink-0" />
                  <span>The Leela Palace, Goa &bull; Coastal Twilight & Fairy Lights</span>
                </p>
              </div>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Ceremony Details:</strong> Beachfront sunset Vedic mandap overlooking the Arabian Sea, bohemian coastal Mehendi with organic henna, sundowner Sangeet, and midnight beach fireworks.
                </p>
                <div className="mt-2 text-[11px] text-slate-500">
                  <strong>Services Provided:</strong> Coastal Mandap Engineering, Saptapadi Events & Entertainment, Beach Logistics, Live Percussionists.
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">300 Guests</span>
                <span className="px-2 py-0.5 rounded-md bg-champagne-50 border border-champagne-200 text-burgundy-900 font-semibold">Coastal Indo-Western</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">Bespoke Coastal</span>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ============================================================== */}
      {/* 5. COMPANY ACHIEVEMENTS & BUSINESS PERFORMANCE */}
      {/* ============================================================== */}
      <section id="achievements" className="py-20 bg-burgundy-950 text-white px-4 sm:px-6 lg:px-8 border-y border-champagne-500/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-400 font-bold block mb-2">
              Demonstration & Prototype Scale Metrics
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              Indian Luxury Wedding Architecture & Operational Scale
            </h2>
            <p className="text-sm text-champagne-200/80 mt-2">
              All figures below represent simulated demonstration benchmarks within our prototype application in the context of the $50B+ Indian wedding industry.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">

            <div className="bg-white/5 border border-champagne-400/20 rounded-2xl p-6 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-champagne-400/20 text-champagne-300 flex items-center justify-center mx-auto mb-3">
                <Crown className="w-5 h-5" />
              </div>
              <div className="font-serif text-3xl font-black text-champagne-300">25</div>
              <div className="text-xs font-semibold text-white mt-1">Simulated Weddings</div>
              <div className="text-[10px] text-champagne-400/70 mt-1">18 Complete &bull; 7 Active</div>
            </div>

            <div className="bg-white/5 border border-champagne-400/20 rounded-2xl p-6 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-champagne-400/20 text-champagne-300 flex items-center justify-center mx-auto mb-3">
                <Heart className="w-5 h-5" />
              </div>
              <div className="font-serif text-3xl font-black text-champagne-300">100%</div>
              <div className="text-xs font-semibold text-white mt-1">Couple Satisfaction</div>
              <div className="text-[10px] text-champagne-400/70 mt-1">Simulated Feedback</div>
            </div>

            <div className="bg-white/5 border border-champagne-400/20 rounded-2xl p-6 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-champagne-400/20 text-champagne-300 flex items-center justify-center mx-auto mb-3">
                <Building className="w-5 h-5" />
              </div>
              <div className="font-serif text-3xl font-black text-champagne-300">40+</div>
              <div className="text-xs font-semibold text-white mt-1">Partner Network</div>
              <div className="text-[10px] text-champagne-400/70 mt-1">Vetted Caterers & Decor</div>
            </div>

            <div className="bg-white/5 border border-champagne-400/20 rounded-2xl p-6 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-champagne-400/20 text-champagne-300 flex items-center justify-center mx-auto mb-3">
                <Award className="w-5 h-5" />
              </div>
              <div className="font-serif text-3xl font-black text-champagne-300">10+</div>
              <div className="text-xs font-semibold text-white mt-1">Heritage Experience</div>
              <div className="text-[10px] text-champagne-400/70 mt-1">Founding Specialists</div>
            </div>

            <div className="bg-white/5 border border-champagne-400/20 rounded-2xl p-6 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-champagne-400/20 text-champagne-300 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="font-serif text-3xl font-black text-champagne-300">₹4.20 Cr</div>
              <div className="text-xs font-semibold text-white mt-1">Simulated Volume</div>
              <div className="text-[10px] text-champagne-400/70 mt-1">Prototype Season Run</div>
            </div>

            <div className="bg-white/5 border border-champagne-400/20 rounded-2xl p-6 backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-champagne-400/20 text-champagne-300 flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <div className="font-serif text-3xl font-black text-champagne-300">98.2%</div>
              <div className="text-xs font-semibold text-white mt-1">On-Time Score</div>
              <div className="text-[10px] text-champagne-400/70 mt-1">Timeline Benchmark</div>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================== */}
      {/* 6. CLIENT TESTIMONIALS */}
      {/* ============================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-champagne-700 font-bold block mb-2">
            Fictional Demonstration Narratives &bull; Prototype Experience
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-950">
            Endorsements of Royal Distinction
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Illustrative testimonials demonstrating client portal feedback, 3-way caterer proposal comparison, and digital agreement workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="bg-white rounded-3xl p-8 border border-champagne-200 shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "The Royal Knot transformed what could have been a chaotic 400-guest royal celebration at City Palace, Udaipur into a completely stress-free fairy tale. The 3-way caterer proposal matrix allowed us to select Maharaja Catering with total price clarity, and signing the contract digitally on our iPad was seamless."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="font-serif font-bold text-sm text-burgundy-950">Aanya Sharma & Arjun Mehta</div>
              <div className="text-[11px] text-slate-400">City Palace, Udaipur Wedding (Demonstration Narrative)</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-champagne-200 shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "As the father of the bride, financial transparency was my highest priority. With Ranveer Singh Rathore's ledger and client-approval workflow, every single rupee was accounted for before we signed off. No surprise charges on the wedding night."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="font-serif font-bold text-sm text-burgundy-950">Mr. Vikramaditya Singhania</div>
              <div className="text-[11px] text-slate-400">Jaipur Rambagh Palace Wedding (Demonstration Narrative)</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-champagne-200 shadow-lg relative flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic">
                "Lead Planner Ishaani Sharma was on radio with the live timeline from 08:00 AM to midnight. When dessert kitchens reported a minor 15-minute delay, buffers were applied seamlessly and our guests never noticed. True 5-star precision."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="font-serif font-bold text-sm text-burgundy-950">Priya Reddy & Karthik Varma</div>
              <div className="text-[11px] text-slate-400">Umaid Bhawan Palace Nuptials (Demonstration Narrative)</div>
            </div>
          </div>

        </div>
      </section>


      {/* ============================================================== */}
      {/* 7. WHY CHOOSE THE ROYAL KNOT? */}
      {/* ============================================================== */}
      <section className="py-20 bg-champagne-100/50 border-y border-champagne-200/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-700 font-bold block mb-2">
              The Sovereign Difference
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-950">
              Why Choose The Royal Knot?
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Six foundational pillars distinguishing our atelier from traditional event coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <div className="bg-white rounded-2xl p-6 border border-champagne-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-burgundy-50 text-burgundy-900 flex items-center justify-center mb-3">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-burgundy-950">1. Personalized Royal Curation</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                No templated weddings. Every moodboard, floral palette, and music ensemble is tailored to the couple's personal family story and cultural traditions.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-champagne-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-champagne-100 text-champagne-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-burgundy-950">2. Vetted Vendor Reliability</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Every caterer, decorator, and lighting crew is vetted under our Vendor Reliability Index (averaging 98.2% on-time performance with 0 cancellations).
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-champagne-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-burgundy-950">3. 100% Transparent Quotations</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Itemized formula: <code>(Price per plate × guests) + extras = Total</code>. You compare 3 competing proposals side-by-side with zero hidden markups.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-champagne-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-3">
                <FileSignature className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-burgundy-950">4. Legally Enforceable Digital Agreements</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Comprehensive digital contracts with integrated electronic signature capture, explicit deliverables, milestone dates, and cancellation covenants.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-champagne-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-burgundy-950">5. Real-Time Financial Ledger</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Live ledger tracking agreed package amounts, client-approved extra services (e.g. DJ extension, extra plates), payments received, and exact remaining balances.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-champagne-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-burgundy-950">6. Live Wedding Day Master Control</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Live minute-by-minute timeline transmitter allowing vendors to broadcast check-in updates directly to planners, preventing ceremonial delays.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================== */}
      {/* 8. INVESTOR & BUSINESS OVERVIEW */}
      {/* ============================================================== */}
      <section id="investors" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-burgundy-950 via-burgundy-900 to-burgundy-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-champagne-400/40">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-400/20 text-champagne-300 text-xs font-bold uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Institutional & Business Overview</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-white">
              The Business of Luxury Celebrations
            </h2>
            <p className="text-sm text-champagne-200/80 mt-3 leading-relaxed">
              India's wedding market is estimated at over <strong>$50 Billion annually</strong>, with luxury destination weddings growing at over 25% year-on-year. The Royal Knot captures high-margin value through our proprietary orchestration platform that unifies planning, procurement, and fintech ledger control.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <div className="text-xs uppercase tracking-wider text-champagne-300 font-bold mb-1">Market Opportunity</div>
              <h4 className="font-serif text-xl font-bold text-white">$50B+ Industry</h4>
              <p className="text-xs text-champagne-100/70 mt-2 leading-relaxed">
                Surging demand from high-net-worth domestic and NRI families seeking centralized, digitized palace wedding management.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <div className="text-xs uppercase tracking-wider text-champagne-300 font-bold mb-1">Revenue Model</div>
              <h4 className="font-serif text-xl font-bold text-white">Fee + Commission</h4>
              <p className="text-xs text-champagne-100/70 mt-2 leading-relaxed">
                Base planning fees (₹10L – ₹25L) + approved additions commission + curated vendor ecosystem retainers.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <div className="text-xs uppercase tracking-wider text-champagne-300 font-bold mb-1">Operational Moat</div>
              <h4 className="font-serif text-xl font-bold text-white">4 Connected Portals</h4>
              <p className="text-xs text-champagne-100/70 mt-2 leading-relaxed">
                Synchronized real-time visibility for Founder, Planner, Client, and Vendor eliminates miscommunication and overhead.
              </p>
            </div>

            <div className="bg-white/10 rounded-2xl p-5 border border-white/10">
              <div className="text-xs uppercase tracking-wider text-champagne-300 font-bold mb-1">Expansion Roadmap</div>
              <h4 className="font-serif text-xl font-bold text-white">Multi-Destination</h4>
              <p className="text-xs text-champagne-100/70 mt-2 leading-relaxed">
                Scaling footprint from Rajasthan palaces to Goa beach estates, Mumbai heritage landmarks, and international UAE circuits.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ============================================================== */}
      {/* 9. CONTACT & CONSULTATION ENQUIRY FORM */}
      {/* ============================================================== */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-champagne-700 font-bold block mb-1">
              Begin Your Royal Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-950 leading-tight">
              Schedule Your Private Consultation
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every masterwork begins with an intimate conversation. Share your wedding vision with our Senior Planning Directors for a bespoke feasibility review and curated palace availability schedule.
            </p>

            <div className="space-y-4 pt-4 border-t border-champagne-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne-100 text-burgundy-900 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-burgundy-950">Atelier Headquarters</div>
                  <div className="text-xs text-slate-500">City Palace Complex, Udaipur, Rajasthan &bull; Worli Seaface, Mumbai</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne-100 text-burgundy-900 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-burgundy-950">Concierge Helpline</div>
                  <div className="text-xs text-slate-500">+91 98201 54321 / +91 98765 43210 (24/7 Concierge)</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne-100 text-burgundy-900 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-burgundy-950">Direct Inquiries</div>
                  <div className="text-xs text-slate-500">concierge@royalknot.com &bull; planner@royalknot.com</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-champagne-300 shadow-2xl">
            <h3 className="font-serif text-2xl font-bold text-burgundy-950 mb-2">
              Request Matrimonial Consultation
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Submissions directly persist in our PostgreSQL database and trigger instant planner notifications.
            </p>

            {submitSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-6">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmitEnquiry} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Couple Names *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aanya Sharma & Arjun Mehta"
                    value={coupleNames}
                    onChange={(e) => setCoupleNames(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-champagne-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@royalknot.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-champagne-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98201 54321"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-champagne-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-champagne-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Headcount</label>
                  <input
                    type="number"
                    min="50"
                    max="5000"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-champagne-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Location</label>
                  <input
                    type="text"
                    value={weddingLocation}
                    onChange={(e) => setWeddingLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-champagne-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Package Tier</label>
                  <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-champagne-500 focus:outline-none"
                  >
                    <option value="Full-Service Wedding">Full-Service Royal Luxury (₹25,00,000)</option>
                    <option value="Partial / Day-of Service">Partial Coordination Elegance (₹10,00,000)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Vision & Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your dream palace venue, theme, music preferences, or special procession requests..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-champagne-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-burgundy-900 to-burgundy-700 text-champagne-200 font-serif font-bold text-xs shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 border border-champagne-400/30 disabled:opacity-50"
              >
                {submitting ? (
                  <span>Registering Consultation...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Consultation Request to Atelier</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. PORTAL ACCESS CTA BANNER */}
      {/* ============================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-gradient-to-r from-champagne-100 via-champagne-50 to-champagne-100 rounded-3xl p-8 sm:p-12 border border-champagne-300 text-center">
          <div className="w-12 h-12 rounded-full bg-burgundy-900 text-champagne-300 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-burgundy-950">
            Designated Portal Access
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-xl mx-auto">
            Are you an existing Royal Knot client, certified wedding planner, vendor partner, or company director? Access your secure role-based management cockpit below.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/login"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-burgundy-900 to-burgundy-700 text-champagne-200 font-serif font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>Sign In to Your Cockpit</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
