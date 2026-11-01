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
          <div className="relative bg-white rounded-3xl overflow-hidden border-2 border-champagne-400 shadow-2xl flex flex-col justify-between">
            <div className="h-56 relative overflow-hidden">
              <img
                src="https://images.unsplash.https://unsplash.com/photos/a-man-and-woman-dressed-in-traditional-indian-garb-3ZISmV72cbMcom/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Full-Service Royal Indian Wedding"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/80 via-transparent to-transparent flex items-end p-5">
                <span className="text-xs uppercase tracking-widest text-champagne-300 font-bold">Royal Palace Tier</span>
              </div>
              <div className="absolute top-3 right-3 bg-gradient-to-l from-champagne-500 to-champagne-400 text-burgundy-950 font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                <Star className="w-3.5 h-3.5 fill-current" />
                Most Popular
              </div>
            </div>

            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-champagne-700">Package A</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-burgundy-950 mt-1">
                  Full-Service Royal Luxury
                </h2>
                <p className="text-xs text-slate-500 mt-2">
                  Complete, stress-free royal Indian wedding planning from conception to post-reception Vidai.
                </p>

                <div className="mt-6 mb-8 pb-6 border-b border-slate-100 flex items-baseline gap-2">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-burgundy-900">
                    ₹25,00,000
                  </span>
                  <span className="text-xs text-slate-500">starting base price</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    'Complete 3-day wedding planning and ceremonial concept',
                    'Heritage palace contract negotiation (Udaipur, Jodhpur, Jaipur)',
                    'Bespoke hand-carved floral Mandap & stage fabrication',
                    'Awadhi, Rajasthani & Nizami 3-way caterer proposal comparisons',
                    'Candid royal photography & 4K cinematic drone reels',
                    'Celebrity Sufi artist, DJ & traditional Shehnai coordination',
                    'Grand Baraat procession with vintage Rolls-Royce & brass band',
                    'Master minute-by-minute live control room event coordination',
                    'Automated 25+ wedding milestone checklist & digital rupee ledger',
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
                <span>Select Full-Service Royal Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Package B: Partial / Day-of Service */}
          <div className="bg-white/95 rounded-3xl overflow-hidden border border-champagne-200 shadow-lg flex flex-col justify-between">
            <div className="h-56 relative overflow-hidden">
              <img
                src="https://imaghttps://unsplash.com/photos/castle-n5BfwGe74FUes.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80"
                alt="Partial Coordination - Palace Courtyard"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                <span className="text-xs uppercase tracking-widest text-champagne-300 font-bold">Coordination Tier</span>
              </div>
            </div>

            <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Package B</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Partial Coordination Elegance
                </h2>
                <p className="text-xs text-slate-500 mt-2">
                  Professional coordination for families who have contracted their venue but require flawless ceremonial execution.
                </p>

                <div className="mt-6 mb-8 pb-6 border-b border-slate-100 flex items-baseline gap-2">
                  <span className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-800">
                    ₹10,00,000
                  </span>
                  <span className="text-xs text-slate-500">starting base price</span>
                </div>

                <div className="space-y-3.5">
                  {[
                    'Final 60-day vendor takeover & call sheet architecture',
                    'Baraat, Varmala, Pheras & Reception schedule management',
                    '3-Day on-site senior planning team & hospitality desk',
                    'Mandap technical & sound rehearsal supervision',
                    'Live vendor arrival transmitter & delay mitigation',
                    'Post-event invoice compilation & transparent ledger reconciliation',
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
                <span>Select Partial Coordination Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

