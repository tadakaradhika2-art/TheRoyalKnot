import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, ArrowRight, Star } from 'lucide-react';

export const ServicesPackages: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPackage = (packageName: string) => {
    navigate(`/enquiry?package=${encodeURIComponent(packageName)}`);
  };

  return (
    <div className="min-h-screen bg-ivory py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100 border border-champagne-300 text-champagne-800 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Ceremonial Offerings
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-950">
            Wedding Services & Luxury Packages
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Designed to match your grandeur, whether you desire complete royal orchestration or expert day-of direction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Package A: Full-Service Wedding */}
          <div className="relative bg-white rounded-3xl p-8 sm:p-10 border-2 border-champagne-400 shadow-2xl flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-champagne-500 to-champagne-400 text-burgundy-950 font-bold text-xs uppercase tracking-widest px-6 py-2 rounded-bl-2xl flex items-center gap-1.5 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              Most Popular
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-champagne-700">Package A</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-burgundy-950 mt-1">
                Full-Service Wedding
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                Complete, stress-free wedding planning from conception to post-reception farewell.
              </p>

              <div className="mt-6 mb-8 pb-6 border-b border-slate-100 flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-900">
                  ₹25,00,000
                </span>
                <span className="text-xs text-slate-500">starting base price</span>
              </div>

              <div className="space-y-3.5">
                {[
                  'Complete wedding planning and concept development',
                  'Venue shortlisting & palace contract negotiation',
                  'Theme & bespoke floral decoration for all 3 days',
                  'Catering curation, food tastings & live counter design',
                  'Lead candid photography & cinematic drone videography',
                  'Celebrity artist, DJ & traditional shehnai coordination',
                  'Full vendor contract, quotation comparison & logistics',
                  'Master minute-by-minute run-of-show event coordination',
                  'Automatic 25+ wedding task tracking & payment ledger',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPackage('Full-Service Wedding')}
              className="mt-10 w-full py-4 rounded-xl bg-gradient-to-r from-burgundy-900 to-burgundy-700 text-champagne-200 font-serif font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 border border-champagne-400/30"
            >
              <span>Select Full-Service Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Package B: Partial / Day-of Service */}
          <div className="bg-white/90 rounded-3xl p-8 sm:p-10 border border-champagne-200 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Package B</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Partial / Day-of Service
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                Professional coordination for couples who have done the initial planning but need flawless execution.
              </p>

              <div className="mt-6 mb-8 pb-6 border-b border-slate-100 flex items-baseline gap-2">
                <span className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-800">
                  ₹10,00,000
                </span>
                <span className="text-xs text-slate-500">starting base price</span>
              </div>

              <div className="space-y-3.5">
                {[
                  'Assistance with final 60-day planning activities',
                  'Vendor arrival coordination & call sheet management',
                  'Granular 3-day wedding schedule & timeline management',
                  'Wedding-day execution & on-site hospitality desk',
                  'Stage and technical rehearsal supervision',
                  'Live vendor arrival tracking & delay mitigation',
                  'Post-event invoice compilation & ledger settlement',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPackage('Partial / Day-of Service')}
              className="mt-10 w-full py-4 rounded-xl bg-slate-900 text-white font-serif font-bold text-sm shadow hover:bg-burgundy-900 transition-all flex items-center justify-center gap-2"
            >
              <span>Select Partial Service Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

