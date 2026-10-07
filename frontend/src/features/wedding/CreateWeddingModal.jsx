import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Heart, Calendar, MapPin, Sparkles, X, ArrowRight, AlertCircle } from 'lucide-react';

export default function CreateWeddingModal({ isOpen, onClose }) {
  const { createWedding } = useWedding();

  const [formData, setFormData] = useState({
    partner1Name: '',
    partner2Name: '',
    weddingDate: '',
    city: '',
    venueName: '',
    description: '',
    theme: 'ROYAL',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await createWedding(formData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create wedding workspace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-rose-950/30 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>New Wedding Workspace</span>
          </div>
          <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            Create Wedding Workspace
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Set up your shared workspace for multi-event planning and partner collaboration.
          </p>
        </div>

        {/* Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Partner 1 Name</label>
              <input
                type="text"
                name="partner1Name"
                required
                placeholder="Rahul Sharma"
                value={formData.partner1Name}
                onChange={handleChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Partner 2 Name</label>
              <input
                type="text"
                name="partner2Name"
                required
                placeholder="Priya Patel"
                value={formData.partner2Name}
                onChange={handleChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Main Wedding Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                name="weddingDate"
                required
                value={formData.weddingDate}
                onChange={handleChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">City / Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="city"
                  placeholder="Jaipur, Rajasthan"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Theme Style</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              >
                <option value="ROYAL">Royal Heritage</option>
                <option value="FLORAL">Floral Elegance</option>
                <option value="TRADITIONAL">Traditional Indian</option>
                <option value="MODERN">Modern Chic</option>
                <option value="MINIMAL">Minimalist</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-xs shadow-lg shadow-rose-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Workspace...' : 'Create Wedding Workspace'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
