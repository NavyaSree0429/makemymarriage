import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CountdownTimer from '../components/CountdownTimer';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../context/WeddingContext';
import UserProfileCard from '../features/auth/UserProfileCard';
import CreateWeddingModal from '../features/wedding/CreateWeddingModal';
import InvitePartnerModal from '../features/wedding/InvitePartnerModal';
import AcceptPartnerInviteModal from '../features/wedding/AcceptPartnerInviteModal';
import OrganizersListWidget from '../features/organizers/OrganizersListWidget';
import InviteOrganizerModal from '../features/organizers/InviteOrganizerModal';

import {
  Heart, Calendar, Users, Shield, CheckCircle, Gift, MapPin, Video,
  Plus, Search, Bell, Copy, Share2, Layers, AlertCircle, ArrowUpRight, Check, KeyRound, UserPlus
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { activeWedding, myWeddings, switchWedding } = useWedding();

  const [copiedLink, setCopiedLink] = useState(false);

  // Modal Visibility States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  // MOD-03 Organizer Modal Top-Level States
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [selectedOrganizerMembership, setSelectedOrganizerMembership] = useState(null);
  const [organizerRefreshKey, setOrganizerRefreshKey] = useState(0);

  const handleOpenOrganizerModal = (membership = null) => {
    setSelectedOrganizerMembership(membership);
    setShowOrganizerModal(true);
  };

  const handleCopyLink = () => {
    if (activeWedding?.wedding?.slug) {
      navigator.clipboard.writeText(`http://localhost:5173/w/${activeWedding.wedding.slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const weddingObj = activeWedding?.wedding;
  const role = activeWedding?.role || 'OWNER';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* User Account Details Header */}
        <UserProfileCard />

        {/* Global MOD-02 Workspace Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center justify-center font-bold text-sm">
              💍
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Active Workspace Selector</span>
              {myWeddings.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={activeWedding?.wedding?._id || ''}
                    onChange={(e) => switchWedding(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-300 focus:outline-none focus:border-rose-500"
                  >
                    {myWeddings.map((item) => (
                      <option key={item.wedding?._id} value={item.wedding?._id}>
                        {item.wedding?.partnerNames?.partner1 || 'Partner 1'} & {item.wedding?.partnerNames?.partner2 || 'Partner 2'}'s Wedding ({item.role})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-xs font-semibold text-amber-400">No active wedding workspace yet</p>
              )}
            </div>
          </div>

          {/* Action Buttons: Create New Wedding & Invite Partner */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Wedding</span>
            </button>

            {weddingObj && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Invite Partner</span>
              </button>
            )}

            <button
              onClick={() => setShowAcceptModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Join with Code</span>
            </button>
          </div>
        </div>

        {/* Wedding Overview Top Banner (Dynamic or Empty State) */}
        {!weddingObj ? (
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-dashed border-rose-500/30 rounded-3xl p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-center mx-auto text-2xl font-bold">
              💍
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="font-serif text-2xl font-bold text-slate-100">No Wedding Workspace Created Yet</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create a new wedding workspace to start managing multi-event timelines, guest RSVPs, task assignments, and vendor budgets.
              </p>
            </div>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/25 transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Wedding</span>
              </button>
              <button
                onClick={() => setShowAcceptModal(true)}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-2"
              >
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Enter Partner Code</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-900/90 to-rose-950/40 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold mb-1">
                  <SparklesIcon />
                  <span>Active Workspace • {role} Access</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100">
                  {weddingObj.partnerNames?.partner1 || 'Partner 1'} & {weddingObj.partnerNames?.partner2 || 'Partner 2'}
                </h1>
                <p className="text-xs text-slate-400 flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    Main Wedding: {weddingObj.weddingDate ? new Date(weddingObj.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'} • {weddingObj.primaryLocation?.venueName || 'Venue TBD'}, {weddingObj.primaryLocation?.city || 'City TBD'}
                  </span>
                </p>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                  <span>{copiedLink ? 'Website Link Copied!' : 'Copy Website Link'}</span>
                </button>

                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-md"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Invite Partner</span>
                </button>
              </div>
            </div>

            {/* Real-Time Ticking Countdown Clock Banner */}
            <CountdownTimer targetDate={weddingObj.weddingDate} />
          </div>
        )}

        {/* 4 KPI Summary Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Guest RSVPs</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-slate-100">342 / 450</h3>
              <p className="text-[11px] text-emerald-400 font-medium">82% Confirmed • 18 Pending</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[82%]"></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Scheduled Events</span>
              <Calendar className="w-4 h-4 text-rose-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-slate-100">5 Functions</h3>
              <p className="text-[11px] text-rose-300">Haldi, Sangeet, Pheras & Reception</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-[100%]"></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Task Progress</span>
              <CheckCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-slate-100">24 / 32 Done</h3>
              <p className="text-[11px] text-amber-400 font-medium">8 Pending • 2 Overdue</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 w-[75%]"></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Budget Tracker</span>
              <Gift className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-slate-100">₹18.5L / ₹25L</h3>
              <p className="text-[11px] text-emerald-400 font-medium">₹6.5 Lakhs Remaining</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-500 to-emerald-400 w-[74%]"></div>
            </div>
          </div>
        </div>

        {/* 2-Column Details Layout: Tasks & Organizers List Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Tasks */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-semibold text-slate-100 text-base flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-amber-400" />
                  <span>Pending Tasks List</span>
                </h3>
                <span className="text-xs text-amber-400 font-semibold">8 Pending</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded accent-rose-500" />
                    <div>
                      <p className="font-semibold text-slate-200">Finalize Catering Menu & Food Options</p>
                      <span className="text-[10px] text-slate-400">Assigned to: Anita (Organizer) • Due in 2 days</span>
                    </div>
                  </div>
                  <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[10px]">High Priority</span>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" className="rounded accent-rose-500" />
                    <div>
                      <p className="font-semibold text-slate-200">Send Sangeet Choreography Practice Video</p>
                      <span className="text-[10px] text-slate-400">Assigned to: Priya (Partner) • Due in 5 days</span>
                    </div>
                  </div>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">Medium Priority</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: MOD-03 Organizers & Granular Permissions Hub */}
          <div className="lg:col-span-5 space-y-6">
            <OrganizersListWidget
              weddingId={weddingObj?._id}
              canManage={role === 'OWNER' || role === 'PARTNER'}
              onOpenInviteModal={handleOpenOrganizerModal}
              refreshTrigger={organizerRefreshKey}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <CreateWeddingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <InvitePartnerModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        weddingId={weddingObj?._id}
      />

      <AcceptPartnerInviteModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
      />

      <InviteOrganizerModal
        isOpen={showOrganizerModal}
        onClose={() => setShowOrganizerModal(false)}
        weddingId={weddingObj?._id}
        existingMembership={selectedOrganizerMembership}
        onRefresh={() => setOrganizerRefreshKey((k) => k + 1)}
      />
    </div>
  );
}

function SparklesIcon() {
  return <span className="text-amber-300 font-bold text-xs">✨</span>;
}
