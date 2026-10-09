import React, { useState } from 'react';

export default function VendorBudgetWidget({
  vendors = [],
  onAddVendor,
  onEditVendor,
  onDeleteVendor,
  onRecordPayment,
  loading = false,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [activeStatus, setActiveStatus] = useState('ALL');

  // Financial Metrics
  const totalEstimated = vendors.reduce((acc, v) => acc + (Number(v.estimatedBudget) || 0), 0);
  const totalAgreed = vendors.reduce((acc, v) => acc + (Number(v.actualCost) || 0), 0);
  const totalPaid = vendors.reduce((acc, v) => acc + (Number(v.paidAmount) || 0), 0);
  const totalRemaining = Math.max(0, totalAgreed - totalPaid);

  const paidPercentage = totalAgreed > 0 ? Math.min(100, Math.round((totalPaid / totalAgreed) * 100)) : 0;

  // Filter logic
  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      (v.vendorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === 'ALL' || v.category === activeCategory;
    const matchesStatus = activeStatus === 'ALL' || v.paymentStatus === activeStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'VENUE':
        return '🏰 Venue';
      case 'CATERING':
        return '🍽️ Catering';
      case 'PHOTOGRAPHY':
        return '📸 Photo/Video';
      case 'DECOR':
        return '🌸 Decor';
      case 'MUSIC':
        return '🎵 Music';
      case 'MAKEUP':
        return '💄 Makeup';
      default:
        return '📦 Other';
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'FULLY_PAID':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'PARTIALLY_PAID':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'UNPAID':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="bg-[#111827]/80 border border-[#B76E79]/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B76E79] font-bold">Financial Workspace</span>
          <h2 className="text-2xl font-serif font-bold text-white mt-0.5">Vendor Directory & Budget Hub</h2>
          <p className="text-xs text-gray-400 mt-1">Track planned vs. actual costs, deposit installments, and remaining dues</p>
        </div>
        <button
          onClick={onAddVendor}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white font-bold text-xs shadow-lg hover:opacity-95 transition flex items-center gap-2"
        >
          <span>🏛️</span> Add Vendor
        </button>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <div className="bg-[#0B0F19]/90 border border-gray-800 rounded-xl p-4">
          <span className="text-gray-400 text-xs block mb-1">Estimated Budget</span>
          <span className="text-[#F3E5AB] font-bold text-lg">{formatCurrency(totalEstimated)}</span>
        </div>

        <div className="bg-[#0B0F19]/90 border border-gray-800 rounded-xl p-4">
          <span className="text-blue-400 text-xs block mb-1">Total Agreed Cost</span>
          <span className="text-blue-300 font-bold text-lg">{formatCurrency(totalAgreed)}</span>
        </div>

        <div className="bg-[#0B0F19]/90 border border-emerald-500/30 rounded-xl p-4">
          <span className="text-emerald-400 text-xs block mb-1">Deposits Paid</span>
          <span className="text-emerald-300 font-bold text-lg">{formatCurrency(totalPaid)}</span>
        </div>

        <div className="bg-[#0B0F19]/90 border border-rose-500/30 rounded-xl p-4">
          <span className="text-rose-400 text-xs block mb-1">Remaining Due</span>
          <span className="text-rose-300 font-bold text-lg">{formatCurrency(totalRemaining)}</span>
        </div>
      </div>

      {/* Payment Progress Bar */}
      <div className="mb-6 bg-[#0B0F19]/80 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-300 font-medium">Budget Payment Progress</span>
          <span className="text-emerald-400 font-bold">
            {paidPercentage}% Paid ({formatCurrency(totalPaid)} of {formatCurrency(totalAgreed)})
          </span>
        </div>
        <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
          <div
            className="h-full bg-gradient-to-r from-[#B76E79] via-[#D4AF37] to-[#10B981] transition-all duration-500"
            style={{ width: `${paidPercentage}%` }}
          />
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.g.target.value)}
            placeholder="Search vendors by company name, contact, or email..."
            className="w-full bg-gray-900/70 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#B76E79]"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Categories' },
            { id: 'VENUE', label: '🏰 Venue' },
            { id: 'CATERING', label: '🍽️ Catering' },
            { id: 'PHOTOGRAPHY', label: '📸 Photo/Video' },
            { id: 'DECOR', label: '🌸 Decor' },
            { id: 'MUSIC', label: '🎵 Music' },
            { id: 'MAKEUP', label: '💄 Makeup' },
            { id: 'OTHER', label: '📦 Other' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#B76E79] border-[#B76E79] text-white shadow-md'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Payment Status Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-2">
          {[
            { id: 'ALL', label: 'All Vendors' },
            { id: 'FULLY_PAID', label: '✅ Fully Paid' },
            { id: 'PARTIALLY_PAID', label: '⏳ Partially Paid' },
            { id: 'UNPAID', label: '🔴 Unpaid' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStatus(tab.id)}
              className={`text-xs font-medium px-3 py-1 rounded-md transition ${
                activeStatus === tab.id
                  ? 'bg-[#B76E79]/20 text-[#F3E5AB] font-bold border border-[#B76E79]/40'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor Cards Roster */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-xs">
          <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading vendor directory...
        </div>
      ) : filteredVendors.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
          <span className="text-3xl block mb-2">🏛️</span>
          <p className="text-sm font-semibold text-gray-300">No vendor records found</p>
          <p className="text-xs text-gray-500 mt-1">Click "+ Add Vendor" to record your first vendor contract!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVendors.map((v) => {
            const pending = Math.max(0, (v.actualCost || 0) - (v.paidAmount || 0));

            return (
              <div
                key={v._id}
                className="bg-[#0B0F19]/90 border border-gray-800 hover:border-[#B76E79]/40 rounded-xl p-4 transition flex flex-col justify-between gap-3 shadow-lg"
              >
                {/* Header info */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-white truncate">{v.vendorName}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${getPaymentStatusBadge(
                        v.paymentStatus
                      )}`}
                    >
                      {v.paymentStatus?.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-[#F3E5AB] border border-gray-700 font-medium">
                      {getCategoryIcon(v.category)}
                    </span>
                    {v.contactPerson && (
                      <span className="text-xs text-gray-400">
                        👤 {v.contactPerson}
                      </span>
                    )}
                  </div>

                  {(v.phone || v.email) && (
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-2 font-mono">
                      {v.phone && <span>📞 {v.phone}</span>}
                      {v.email && <span className="truncate">✉️ {v.email}</span>}
                    </div>
                  )}
                </div>

                {/* Financial Details Box */}
                <div className="bg-gray-900/60 border border-gray-800/80 rounded-lg p-3 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Agreed Cost:</span>
                    <span className="font-bold text-white">{formatCurrency(v.actualCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Paid Deposit:</span>
                    <span className="font-bold text-emerald-400">{formatCurrency(v.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-800">
                    <span className="text-gray-400 font-semibold">Remaining Due:</span>
                    <span className="font-bold text-rose-400">{formatCurrency(pending)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800/60 text-xs">
                  <button
                    onClick={() => onRecordPayment(v)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 font-semibold transition"
                  >
                    💳 Record Payment
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditVendor(v)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-[#F3E5AB] hover:bg-gray-800 transition text-xs"
                      title="Edit Vendor"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDeleteVendor(v._id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition text-xs"
                      title="Delete Vendor"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
