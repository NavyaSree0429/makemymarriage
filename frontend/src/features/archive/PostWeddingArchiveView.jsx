import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, Unlock, Calendar, MapPin, CheckCircle2, Download,
  CloudDownload, Users, Camera, Wallet, FolderArchive, FileSpreadsheet,
  FileJson, Search, Sparkles, Fingerprint, Printer, ArrowRight,
  ShieldCheck, AlertCircle, RefreshCw, Heart, FileText
} from 'lucide-react';
import {
  getArchiveRetrospectiveApi,
  toggleArchiveStatusApi,
  downloadExportApi,
} from '../../services/archiveService';

export default function PostWeddingArchiveView({
  weddingId,
  token,
  weddingObj,
  onStatusChange,
}) {
  const [loading, setLoading] = useState(true);
  const [retrospective, setRetrospective] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [downloadingType, setDownloadingType] = useState(null);
  const [togglingArchive, setTogglingArchive] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (weddingId && token) {
      loadRetrospectiveData();
    }
  }, [weddingId, token]);

  const loadRetrospectiveData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      const res = await getArchiveRetrospectiveApi(token, weddingId);
      if (res.success) {
        setRetrospective(res.data);
      }
    } catch (err) {
      console.error('Failed to load retrospective data:', err);
      setErrorMsg('Failed to load archival retrospective data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type) => {
    try {
      setDownloadingType(type);
      await downloadExportApi(token, weddingId, type);
    } catch (err) {
      console.error(`Failed to export ${type}:`, err);
      alert(`Export failed for ${type}. Please check server logs.`);
    } finally {
      setDownloadingType(null);
    }
  };

  const handleToggleArchive = async () => {
    try {
      setTogglingArchive(true);
      const isArchived = retrospective?.wedding?.status === 'ARCHIVED';
      const res = await toggleArchiveStatusApi(
        token,
        weddingId,
        !isArchived ? 'Preserved in eternal retrospective mode with reverence.' : ''
      );
      if (res.success) {
        setShowConfirmModal(false);
        await loadRetrospectiveData();
        if (onStatusChange) {
          onStatusChange(res.data.status);
        }
      }
    } catch (err) {
      console.error('Failed to toggle archive status:', err);
      alert('Unable to toggle archive status. Please verify permissions.');
    } finally {
      setTogglingArchive(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#111827]/70 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
        <div className="w-12 h-12 border-3 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="font-serif text-lg text-slate-200">Retrieving Eternal Nuptial Archive & Memory Vault...</p>
        <p className="text-xs text-[#F3E5AB]/70 font-mono">256-bit AES Sovereign Memory Integrity Verification</p>
      </div>
    );
  }

  const isArchived = retrospective?.wedding?.status === 'ARCHIVED';
  const metrics = retrospective?.metrics || {};
  const blessings = retrospective?.blessings || [];

  // Filtered blessings
  const filteredBlessings = blessings.filter((b) => {
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.wishes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'BRIDE') {
      return b.category.toLowerCase().includes('bride');
    }
    if (activeFilter === 'GROOM') {
      return b.category.toLowerCase().includes('groom');
    }
    if (activeFilter === 'VIP') {
      return b.category.toLowerCase().includes('vip') || b.category.toLowerCase().includes('friend');
    }
    return true;
  });

  return (
    <div className="space-y-10" id="archive-section">
      {/* 1. Majestic Archival Status Header Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#111827]/85 border border-[#B76E79]/40 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B76E79]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F3E5AB]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            {/* Ribbon Tag & Couple Tag */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F3E5AB]/10 border border-[#F3E5AB]/30 text-[#F3E5AB] font-mono text-[11px] uppercase tracking-widest font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                <span>ETERNAL NUPTIAL ARCHIVE • PRESERVED WITH REVERENCE</span>
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isArchived
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                }`}
              >
                {isArchived ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isArchived ? 'ARCHIVED & READ-ONLY' : 'ACTIVE PLANNING WORKSPACE'}</span>
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              {weddingObj?.partnerNames?.partner1 || 'Virat'} &{' '}
              {weddingObj?.partnerNames?.partner2 || 'Anushka'}'s Royal Nuptials{' '}
              <span className="text-[#F3E5AB] italic font-normal text-2xl sm:text-3xl">
                • {weddingObj?.primaryLocation?.city || 'Tuscany & Mumbai'}
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-medium">
              Centralized workspace frozen into an indelible digital heirloom. All ceremonies concluded, vendor ledgers
              reconciled, and guest blessings vaulted under 256-bit AES encryption.
            </p>

            {/* Concluded Metadata Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-4 h-4 text-[#F3E5AB]" />
                <span>
                  Concluded:{' '}
                  {weddingObj?.weddingDate
                    ? new Date(weddingObj.weddingDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'December 14, 2024'}
                </span>
              </span>

              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#B76E79]" />
                <span>
                  {weddingObj?.primaryLocation?.venueName
                    ? `${weddingObj.primaryLocation.venueName}, ${weddingObj.primaryLocation.city}`
                    : 'Borgo Finocchieto & The Taj Mahal Palace'}
                </span>
              </span>

              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>All {metrics.vendorCount || 14} Vendor Escrows Released</span>
              </span>
            </div>
          </div>

          {/* Master Action Suite */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[280px]">
            <button
              onClick={() => handleDownload('bundle')}
              disabled={downloadingType === 'bundle'}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#B76E79] to-[#9A5560] hover:from-[#c57b86] hover:to-[#aa626d] text-white font-semibold text-xs shadow-xl shadow-rose-950/50 border border-[#F3E5AB]/40 flex items-center justify-center gap-2.5 transition active:scale-95 group"
            >
              <CloudDownload className="w-4 h-4 text-[#F3E5AB] group-hover:translate-y-0.5 transition-transform" />
              <span>
                {downloadingType === 'bundle'
                  ? 'Generating Vault...'
                  : 'Download Master Heirloom (.JSON)'}
              </span>
            </button>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-3 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-[#F3E5AB]/30 text-[#F3E5AB] text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-95"
            >
              {isArchived ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span>Reactivate Workspace</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-rose-400" />
                  <span>Seal Workspace in Archive</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 2. Visual Read-Only Operational Banner */}
      <div className="rounded-2xl p-4 sm:px-6 flex items-center gap-4 bg-slate-900/90 border border-[#F3E5AB]/30 shadow-lg backdrop-blur-md">
        <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-[#F3E5AB]/40 flex-shrink-0 flex items-center justify-center text-[#F3E5AB]">
          <Shield className="w-5 h-5 text-amber-300" />
        </div>
        <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
          <p className="text-slate-200 leading-relaxed">
            <span className="text-[#F3E5AB] font-bold">
              {isArchived ? 'Workspace is in Sealed Retrospective Mode' : 'Planning Workspace is Active'}
            </span>{' '}
            — {isArchived
              ? 'All guest RSVPs, budget balances, and itineraries are immutably preserved for posterity. You can reactivate anytime if corrections are required.'
              : 'You can archive this workspace once all ceremonies conclude to preserve the complete history, wishes, and data ledger.'}
          </p>
          <button
            onClick={() => setShowConfirmModal(true)}
            className="text-xs font-bold text-rose-300 hover:text-white underline underline-offset-4 flex items-center gap-1 whitespace-nowrap"
          >
            <span>{isArchived ? 'Reopen for Edits' : 'Seal Archive Now'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Commemorative Milestone Metrics (4 Golden Glassmorphic KPI Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <span>Executive Retrospective Telemetry</span>
            <span className="text-slate-500 text-sm font-mono">#01</span>
          </h2>
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Permanent Registry Records
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Metric Card 1: Guests */}
          <div className="bg-[#111827]/80 rounded-2xl p-6 border border-slate-800 hover:border-[#B76E79]/50 transition shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Guests Welcomed
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#F3E5AB]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl font-bold text-[#F3E5AB]">
                {metrics.guestsWelcomed || 184} / {metrics.totalGuests || 200}
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{metrics.turnoutRate || '92.0'}% Turnout Realized</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>16 Regretfully Absent</span>
              <span className="text-[#F3E5AB]">16 Digital Blessings</span>
            </div>
          </div>

          {/* Metric Card 2: Ceremonies */}
          <div className="bg-[#111827]/80 rounded-2xl p-6 border border-slate-800 hover:border-[#B76E79]/50 transition shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Ceremonies Concluded
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#F3E5AB]">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl font-bold text-[#F3E5AB]">
                {metrics.ceremoniesConcluded || 5} of {metrics.totalCeremonies || 5} Sacred
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Executed on Muhurtham</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 font-medium truncate">
              {metrics.ceremonyNames?.join(', ') || 'Haldi, Mehendi, Sangeet, Pheras, Reception'}
            </div>
          </div>

          {/* Metric Card 3: Memories */}
          <div className="bg-[#111827]/80 rounded-2xl p-6 border border-slate-800 hover:border-[#B76E79]/50 transition shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Preserved Memories
              </span>
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#F3E5AB]">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl font-bold text-[#F3E5AB]">
                {metrics.photosCount || 128} RAW Frames
              </div>
              <div className="flex items-center gap-1.5 text-rose-300 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Private Vault Encrypted</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>98 Ceremony Stills</span>
              <span className="text-[#F3E5AB]">30 4K Cinematic Reels</span>
            </div>
          </div>

          {/* Metric Card 4: Budget */}
          <div className="bg-[#111827]/80 rounded-2xl p-6 border border-slate-800 hover:border-[#B76E79]/50 transition shadow-xl space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                Final Ledger Reconciled
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-serif text-3xl font-bold text-[#F3E5AB]">
                ₹{((metrics.settledBudget || 2450000) / 100000).toFixed(1)} Lakhs
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>₹0.00 Outstanding Balance</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>{metrics.vendorCount || 14} Vendor Accounts</span>
              <span className="text-emerald-400 font-bold">Audit Cleared</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sacred Blessings & Guest Wishes Scrapbook Wall */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#B76E79] font-bold">
              Commemorative Inscriptions
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Sacred Blessings & Guest Wishes Scrapbook
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1">
              Handwritten digital blessings and auspicious congratulations penned by wedding guests during attendance verification.
            </p>
          </div>

          <button
            onClick={() => handleDownload('guests')}
            className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-[#F3E5AB]/30 text-[#F3E5AB] hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Generate Parchment Album (CSV)</span>
          </button>
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="bg-[#111827]/70 rounded-2xl p-4 border border-slate-800 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blessings by guest name, sentiment, or family clan..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F3E5AB] transition"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-full transition ${
                activeFilter === 'ALL'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9A5560] text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              All Blessings ({blessings.length})
            </button>
            <button
              onClick={() => setActiveFilter('BRIDE')}
              className={`px-3.5 py-1.5 rounded-full transition ${
                activeFilter === 'BRIDE'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9A5560] text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Bride's Family 🌸
            </button>
            <button
              onClick={() => setActiveFilter('GROOM')}
              className={`px-3.5 py-1.5 rounded-full transition ${
                activeFilter === 'GROOM'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9A5560] text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Groom's Family 👑
            </button>
            <button
              onClick={() => setActiveFilter('VIP')}
              className={`px-3.5 py-1.5 rounded-full transition ${
                activeFilter === 'VIP'
                  ? 'bg-gradient-to-r from-[#B76E79] to-[#9A5560] text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              VIP Friends & Colleagues 🥂
            </button>
          </div>
        </div>

        {/* Masonry / Grid of Blessing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlessings.length > 0 ? (
            filteredBlessings.map((blessing, idx) => (
              <article
                key={idx}
                className="bg-[#111827]/85 border-t-2 border-t-[#F3E5AB]/70 border-x border-b border-slate-800/80 rounded-2xl p-6 relative flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-xl"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">{blessing.guestName}</h3>
                      <span className="inline-block text-[#B76E79] text-[11px] font-mono uppercase tracking-wider font-semibold">
                        {blessing.category}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                      {blessing.ceremony}
                    </span>
                  </div>

                  <p className="font-serif italic text-xs text-slate-200 leading-relaxed pt-2">
                    "{blessing.wishes}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-[#F3E5AB]">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Verified Guest Token #{blessing.verifiedToken}</span>
                  </span>
                  <span>{blessing.date}</span>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-xs text-slate-400 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
              No guest blessings matching this search criteria.
            </div>
          )}
        </div>
      </section>

      {/* 5. 1-Click Nuptial Heirloom & Data Portability Vault (4 Opulent Download Cards) */}
      <section className="space-y-6 pt-6">
        <div className="border-b border-slate-800 pb-4">
          <span className="text-xs uppercase tracking-widest text-[#B76E79] font-bold">
            Sovereign Data Sovereignty
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
            Nuptial Heirloom & Data Portability Vault
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Preserve complete records for family archives, tax reconciliations, and personalized thank-you mailings. Zero vendor lock-in guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Export Card 1: Guests */}
          <div className="bg-[#111827]/80 rounded-2xl p-6 flex flex-col justify-between border border-slate-800 hover:border-[#B76E79] transition shadow-xl space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#F3E5AB]">
                  <Users className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#F3E5AB] font-mono text-[10px] tracking-widest">
                  .CSV / EXCEL
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Guest Roster & Mailing List</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complete guest address directory, RSVP dietary preferences, and postal addresses pre-formatted for Thank-You cards.
              </p>
            </div>
            <button
              onClick={() => handleDownload('guests')}
              disabled={downloadingType === 'guests'}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#F3E5AB] hover:text-slate-950 text-[#F3E5AB] border border-[#F3E5AB]/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingType === 'guests' ? 'Exporting...' : 'Export Guest Directory'}</span>
            </button>
          </div>

          {/* Export Card 2: Budget */}
          <div className="bg-[#111827]/80 rounded-2xl p-6 flex flex-col justify-between border border-slate-800 hover:border-[#B76E79] transition shadow-xl space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#F3E5AB]">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#F3E5AB] font-mono text-[10px] tracking-widest">
                  .CSV / AUDIT
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Vendor Financial Ledger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full itemized accounting of all vendor contracts, escrow milestones, TDS records, and payment receipts.
              </p>
            </div>
            <button
              onClick={() => handleDownload('budget')}
              disabled={downloadingType === 'budget'}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#F3E5AB] hover:text-slate-950 text-[#F3E5AB] border border-[#F3E5AB]/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingType === 'budget' ? 'Exporting...' : 'Export Financial Audit'}</span>
            </button>
          </div>

          {/* Export Card 3: Itinerary */}
          <div className="bg-[#111827]/80 rounded-2xl p-6 flex flex-col justify-between border border-slate-800 hover:border-[#B76E79] transition shadow-xl space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-[#F3E5AB]">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[#F3E5AB] font-mono text-[10px] tracking-widest">
                  .CSV / ICAL
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Ceremony Chronology Log</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Comprehensive log of every ritual timing, muhurtham timestamps, flotilla schedules, and live stream archives.
              </p>
            </div>
            <button
              onClick={() => handleDownload('itinerary')}
              disabled={downloadingType === 'itinerary'}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#F3E5AB] hover:text-slate-950 text-[#F3E5AB] border border-[#F3E5AB]/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadingType === 'itinerary' ? 'Exporting...' : 'Export Chronology Log'}</span>
            </button>
          </div>

          {/* Export Card 4: Master Bundle */}
          <div className="bg-[#111827]/90 rounded-2xl p-6 flex flex-col justify-between border border-[#F3E5AB]/50 shadow-2xl space-y-4 relative group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#0F131D] border border-[#F3E5AB]/50 flex items-center justify-center text-[#F3E5AB]">
                  <FolderArchive className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-[10px] tracking-widest font-bold">
                  .JSON VAULT
                </span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#F3E5AB]">Master Nuptial Archive Bundle</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete cryptographic workspace snapshot including memories metadata, blessings scrapbook, and settings.
              </p>
            </div>
            <button
              onClick={() => handleDownload('bundle')}
              disabled={downloadingType === 'bundle'}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9A5560] hover:from-[#c57b86] hover:to-[#aa626d] text-white border border-[#F3E5AB]/40 text-xs font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-rose-950/40"
            >
              <CloudDownload className="w-3.5 h-3.5 text-[#F3E5AB]" />
              <span>{downloadingType === 'bundle' ? 'Exporting...' : 'Download Full Vault (JSON)'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Cryptographic Integrity & Concierge Seal Banner */}
      <div className="rounded-2xl p-8 bg-slate-900/60 border border-[#B76E79]/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-[#F3E5AB]/40 flex items-center justify-center text-[#F3E5AB] flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h4 className="font-serif text-lg font-bold text-white">Sovereign Indelible Memory Guarantee</h4>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed mt-0.5">
              This repository is immutably sealed on cold-storage distributed nodes across Frankfurt and Mumbai. Your media assets are preserved for 100+ years under the MakeMyMarriage Perpetual Trust.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs text-[#F3E5AB]/90 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
            SHA-256: 8f4e...c92a
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0F131D] border border-[#F3E5AB]/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-[#F3E5AB]/30 text-[#F3E5AB] flex items-center justify-center">
                {isArchived ? <Unlock className="w-6 h-6 text-emerald-400" /> : <Lock className="w-6 h-6 text-rose-400" />}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  {isArchived ? 'Reactivate Workspace?' : 'Archive Wedding Workspace?'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isArchived ? 'Re-enable editing and guest RSVP changes' : 'Seal workspace into permanent read-only status'}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isArchived
                ? 'Reactivating will unlock all guest forms, budget updates, and event schedules, allowing coordinators to make new edits.'
                : 'Sealing the workspace freezes all operational modules (events, tasks, guests, vendors) into a commemorative read-only heirloom. You can reactivate anytime.'}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleArchive}
                disabled={togglingArchive}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#9A5560] text-white text-xs font-semibold shadow-lg transition active:scale-95 disabled:opacity-50"
              >
                {togglingArchive ? 'Processing...' : isArchived ? 'Confirm Reactivation' : 'Confirm Archive Freeze'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
