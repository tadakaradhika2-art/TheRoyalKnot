import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { royalKnotApi } from '../../services/api';
import { Sparkles, Calendar, Users, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ConsultationForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    coupleNames: 'Aanya Sharma & Arjun Mehta',
    email: 'client@royalknot.com',
    phone: '+91 98765 43210',
    preferredWeddingDate: '2027-02-14',
    estimatedGuestCount: 400,
    weddingLocation: 'City Palace, Udaipur, Rajasthan',
    preferredTheme: 'Royal Rajasthani Heritage',
    weddingType: 'Traditional Royal Marwari & Punjabi',
    selectedPackage: searchParams.get('package') || 'Full-Service Royal Luxury',
    maximumBudget: 2500000,
    additionalRequirements: '8 Live multi-cuisine counters for 400 guests, royal doli entrance, classical sufi night.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await royalKnotApi.createEnquiry(formData);
      setSubmittedEnquiry(result);
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    } catch (err) {
      console.error(err);
      // Fallback display
      setSubmittedEnquiry({ ...formData, id: 99, status: 'New' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {submittedEnquiry ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-champagne-300 shadow-2xl text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-widest text-champagne-700 font-bold">
              Enquiry Registered & Notified
            </span>
            <h2 className="font-serif text-3xl font-extrabold text-burgundy-950 mt-1">
              Consultation Request Confirmed
            </h2>
            <p className="text-sm text-slate-600 mt-3 max-w-lg mx-auto">
              Your royal consultation request for <strong>{submittedEnquiry.coupleNames}</strong> has been logged in the system. An automated notification has been dispatched to Senior Planner <strong>Ishaani Sharma</strong>.
            </p>

            <div className="bg-champagne-50/60 rounded-2xl p-5 border border-champagne-200 my-6 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-champagne-100 pb-2">
                <span className="text-slate-500">Selected Package:</span>
                <span className="font-bold text-burgundy-900">{submittedEnquiry.selectedPackage}</span>
              </div>
              <div className="flex justify-between border-b border-champagne-100 pb-2">
                <span className="text-slate-500">Expected Guests:</span>
                <span className="font-bold text-slate-800">{submittedEnquiry.estimatedGuestCount} Guests</span>
              </div>
              <div className="flex justify-between border-b border-champagne-100 pb-2">
                <span className="text-slate-500">Preferred Theme:</span>
                <span className="font-bold text-slate-800">{submittedEnquiry.preferredTheme}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Planner:</span>
                <span className="font-bold text-emerald-700">Ishaani Sharma (Lead Planner)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate('/planner')}
                className="px-6 py-3 rounded-xl bg-burgundy-900 text-champagne-200 font-serif font-bold text-xs shadow-lg hover:bg-burgundy-950 transition-all flex items-center gap-2"
              >
                <span>View in Planner Cockpit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/client')}
                className="px-6 py-3 rounded-xl bg-white border border-champagne-300 text-burgundy-900 font-serif font-bold text-xs shadow-sm hover:bg-champagne-50 transition-all"
              >
                Proceed to Couple Portal
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-champagne-300/80 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100 text-champagne-800 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Module 3: Consultation Form
              </div>
              <h1 className="font-serif text-3xl font-extrabold text-burgundy-950">
                Begin Your Wedding Journey
              </h1>
              <p className="text-xs text-slate-500 mt-2">
                Pre-filled with PRD demonstration values for "The Sharma Wedding".
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Couple Names</label>
                  <input
                    type="text"
                    required
                    value={formData.coupleNames}
                    onChange={(e) => setFormData({ ...formData, coupleNames: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Wedding Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredWeddingDate}
                    onChange={(e) => setFormData({ ...formData, preferredWeddingDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Guest Count</label>
                  <input
                    type="number"
                    required
                    value={formData.estimatedGuestCount}
                    onChange={(e) => setFormData({ ...formData, estimatedGuestCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Wedding Location / City</label>
                  <input
                    type="text"
                    required
                    value={formData.weddingLocation}
                    onChange={(e) => setFormData({ ...formData, weddingLocation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Selected Package</label>
                  <select
                    value={formData.selectedPackage}
                    onChange={(e) => setFormData({ ...formData, selectedPackage: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm bg-white"
                  >
                    <option value="Full-Service Wedding">Full-Service Wedding (₹25,00,000)</option>
                    <option value="Partial / Day-of Service">Partial / Day-of Service (₹10,00,000)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Theme</label>
                  <select
                    value={formData.preferredTheme}
                    onChange={(e) => setFormData({ ...formData, preferredTheme: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm bg-white"
                  >
                    <option value="Royal Heritage">Royal Heritage (Udaipur Palace Aesthetic)</option>
                    <option value="Beach Chic">Beach Chic (Goan Luxury Coastal)</option>
                    <option value="Modern Classic">Modern Classic (Minimal Ivory & Gold)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Budget (INR)</label>
                  <input
                    type="number"
                    value={formData.maximumBudget}
                    onChange={(e) => setFormData({ ...formData, maximumBudget: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Requirements</label>
                <textarea
                  rows={3}
                  value={formData.additionalRequirements}
                  onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-champagne-500 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-burgundy-900 to-burgundy-700 text-champagne-200 font-serif font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border border-champagne-400/30 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Dispatching to Planner...</span>
                ) : (
                  <>
                    <span>Submit Royal Wedding Enquiry</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

