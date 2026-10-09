import React, { useState, useEffect } from 'react';

export default function VendorManagementModal({ isOpen, onClose, onSave, vendor = null, loading = false }) {
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState(0);
  const [actualCost, setActualCost] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('UNPAID');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (vendor) {
      setVendorName(vendor.vendorName || '');
      setCategory(vendor.category || 'OTHER');
      setContactPerson(vendor.contactPerson || '');
      setPhone(vendor.phone || '');
      setEmail(vendor.email || '');
      setEstimatedBudget(vendor.estimatedBudget || 0);
      setActualCost(vendor.actualCost || 0);
      setPaidAmount(vendor.paidAmount || 0);
      setPaymentStatus(vendor.paymentStatus || 'UNPAID');
      setNotes(vendor.notes || '');
    } else {
      setVendorName('');
      setCategory('OTHER');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setEstimatedBudget(0);
      setActualCost(0);
      setPaidAmount(0);
      setPaymentStatus('UNPAID');
      setNotes('');
    }
  }, [vendor, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!vendorName.trim()) return;

    onSave({
      vendorName: vendorName.trim(),
      category,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      estimatedBudget: Number(estimatedBudget) || 0,
      actualCost: Number(actualCost) || 0,
      paidAmount: Number(paidAmount) || 0,
      paymentStatus,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-[#B76E79]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#B76E79]/20 via-[#1E293B] to-[#0F172A] border-b border-[#B76E79]/30">
          <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">
            {vendor ? '✏️ Edit Vendor Record' : '🏛️ Add New Vendor'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Vendor Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Vendor / Company Name *
            </label>
            <input
              type="text"
              required
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="e.g., Royal Rajasthan Palace Catering & Feasts"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B76E79] transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Service Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
            >
              <option value="VENUE">Venue & Palace 🏰</option>
              <option value="CATERING">Catering & Menu 🍽️</option>
              <option value="PHOTOGRAPHY">Photography & Video 📸</option>
              <option value="DECOR">Decor & Mandap 🌸</option>
              <option value="MUSIC">Music & Sangeet 🎵</option>
              <option value="MAKEUP">Outfits & Makeup 💄</option>
              <option value="OTHER">Other Services 📦</option>
            </select>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Contact Person
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g., Chef Ramesh Kumar"
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +91 98765 43210"
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Vendor Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., contact@royalfeasts.com"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
            />
          </div>

          {/* Financials: Estimated, Actual, Paid */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Estimated Budget (₹)
              </label>
              <input
                type="number"
                min="0"
                value={estimatedBudget}
                onChange={(e) => setEstimatedBudget(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Agreed Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                value={actualCost}
                onChange={(e) => setActualCost(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#B76E79] font-bold mb-1">
                Amount Paid (₹)
              </label>
              <input
                type="number"
                min="0"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
              />
            </div>
          </div>

          {/* Payment Status Pills */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Payment Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'UNPAID', label: '🔴 Unpaid', color: 'border-red-500/40 text-red-300' },
                { id: 'PARTIALLY_PAID', label: '⏳ Partial', color: 'border-amber-500/40 text-amber-300' },
                { id: 'FULLY_PAID', label: '✅ Fully Paid', color: 'border-emerald-500/40 text-emerald-300' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPaymentStatus(item.id)}
                  className={`py-2 rounded-xl border text-xs font-semibold transition ${
                    paymentStatus === item.id
                      ? `bg-gray-800 ${item.color} shadow-md`
                      : 'border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Contract Specs & Bank Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Bank account specs, payment installment schedules, deposit terms..."
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#B76E79]"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white text-xs font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Saving Record...' : vendor ? 'Update Vendor' : 'Save Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
