import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGuestsApi, deleteGuestApi } from '../../services/guestService';
import GuestManagementModal from './GuestManagementModal';
import DigitalInviteModal from './DigitalInviteModal';
import { Users, UserPlus, Search, Edit3, Trash2, Send, CheckCircle2, Clock, XCircle, Filter, Utensils, RefreshCw, Mail, Phone, ExternalLink } from 'lucide-react';

const CATEGORY_MAP = {
  BRIDE_FAMILY: { label: 'Bride Family', emoji: '👰', color: 'bg-rose-500/10 text-rose-300 border-rose-500/20' },
  GROOM_FAMILY: { label: 'Groom Family', emoji: '🤵', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  FRIENDS: { label: 'Friends', emoji: '🎉', color: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
  VIP: { label: 'VIP Guest', emoji: '⭐', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
  PLANNERS: { label: 'Planner', emoji: '📋', color: 'bg-sky-500/10 text-sky-300 border-sky-500/20' },
  GENERAL: { label: 'General', emoji: '👥', color: 'bg-slate-800 text-slate-300 border-slate-700' },
};

export default function GuestListWidget({ weddingId, weddingObj, canManage = true, onOpenAddGuestModal, onOpenEditGuestModal, refreshTrigger }) {
  const { accessToken } = useAuth();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback Internal Modal States
  const [selectedGuestForEdit, setSelectedGuestForEdit] = useState(null);
  const [selectedGuestForInvite, setSelectedGuestForInvite] = useState(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  const fetchGuests = async () => {
    if (!weddingId || !accessToken) return;
    setLoading(true);
    try {
      const res = await getGuestsApi(accessToken, weddingId);
      setGuests(res.data || []);
    } catch (err) {
      console.error('Failed to load guest list:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [weddingId, accessToken, refreshTrigger]);

  const handleDelete = async (guestId, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the guest roster?`)) {
      return;
    }
    try {
      await deleteGuestApi(accessToken, weddingId, guestId);
      fetchGuests();
    } catch (err) {
      alert(err.message || 'Failed to remove guest');
    }
  };

  const handleEdit = (guest) => {
    if (onOpenEditGuestModal) {
      onOpenEditGuestModal(guest);
    } else {
      setSelectedGuestForEdit(guest);
      setShowManageModal(true);
    }
  };

  const handleAddClick = () => {
    if (onOpenAddGuestModal) {
      onOpenAddGuestModal();
    } else {
      setSelectedGuestForEdit(null);
      setShowManageModal(true);
    }
  };

  const handleOpenInvite = (guest) => {
    setSelectedGuestForInvite(guest);
    setShowInviteModal(true);
  };

  // Filter & Search Logic
  const filteredGuests = guests.filter((g) => {
    const matchesCategory = activeCategory === 'ALL' || g.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      g.fullName.toLowerCase().includes(q) ||
      (g.email && g.email.toLowerCase().includes(q)) ||
      (g.phone && g.phone.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Calculate Summary Statistics
  const confirmedCount = guests.filter((g) => g.rsvpStatus === 'CONFIRMED').length;
  const pendingCount = guests.filter((g) => g.rsvpStatus === 'PENDING').length;
  const totalAttendeesAllocated = guests.reduce((sum, g) => sum + (g.allocatedAttendees || 1), 0);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-rose-400" />
            <h3 className="font-serif text-xl font-bold text-slate-100">
              Guest List Roster & Digital E-Vites
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/20">
              {guests.length} Roster Entries ({totalAttendeesAllocated} Total Attendees)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Manage invitations, attendee counts, ceremony assignments, and 1-click WhatsApp E-Vites.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleAddClick}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition flex items-center space-x-1.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Guest to Roster</span>
          </button>
        )}
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block font-medium">Total Roster Entries</span>
          <span className="text-lg font-bold text-slate-100">{guests.length}</span>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-emerald-400 block font-medium">Confirmed Attending</span>
          <span className="text-lg font-bold text-emerald-400">{confirmedCount}</span>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-amber-400 block font-medium">Pending Response</span>
          <span className="text-lg font-bold text-amber-400">{pendingCount}</span>
        </div>
        <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
          <span className="text-[10px] text-rose-300 block font-medium">Total Attendees</span>
          <span className="text-lg font-bold text-rose-300">{totalAttendeesAllocated} People</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
              activeCategory === 'ALL'
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            All ({guests.length})
          </button>
          {Object.keys(CATEGORY_MAP).map((catKey) => {
            const cat = CATEGORY_MAP[catKey];
            const count = guests.filter((g) => g.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center space-x-1 border ${
                  activeCategory === catKey
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
                <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search guest name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Guest Roster List */}
      {loading ? (
        <div className="text-center py-10 text-xs text-slate-400 flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
          <span>Loading guest roster...</span>
        </div>
      ) : filteredGuests.length === 0 ? (
        <div className="bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 p-8 text-center space-y-3">
          <p className="text-xs text-slate-400">
            {searchQuery ? `No guests found matching "${searchQuery}".` : 'No guests added to this category yet.'}
          </p>
          {canManage && (
            <button
              onClick={handleAddClick}
              className="text-xs font-semibold text-rose-400 hover:underline inline-flex items-center space-x-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add guest to roster</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGuests.map((guest) => {
            const cat = CATEGORY_MAP[guest.category] || CATEGORY_MAP.GENERAL;
            const rsvpColor =
              guest.rsvpStatus === 'CONFIRMED'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : guest.rsvpStatus === 'DECLINED'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/20';

            return (
              <div
                key={guest._id}
                className="p-4 bg-slate-950/70 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 via-rose-600/10 to-amber-500/20 text-rose-300 flex items-center justify-center font-bold text-sm border border-rose-500/30 shrink-0">
                      {guest.fullName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-100 text-xs">{guest.fullName}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${cat.color}`}>
                          {cat.emoji} {cat.label}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
                        {guest.phone && <span className="flex items-center space-x-1"><Phone className="w-3 h-3 text-slate-500" /><span>{guest.phone}</span></span>}
                        {guest.email && <span className="flex items-center space-x-1"><Mail className="w-3 h-3 text-slate-500" /><span>{guest.email}</span></span>}
                      </div>
                    </div>
                  </div>

                  {/* Actions & RSVP Badge */}
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${rsvpColor}`}>
                      {guest.rsvpStatus === 'CONFIRMED' && '✅ Confirmed'}
                      {guest.rsvpStatus === 'PENDING' && '⏳ Pending RSVP'}
                      {guest.rsvpStatus === 'DECLINED' && '❌ Declined'}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleOpenInvite(guest)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm"
                      title="Send Digital E-Invite"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send E-Invite 📲</span>
                    </button>

                    {canManage && (
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(guest)}
                          className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition"
                          title="Edit Guest Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(guest._id, guest.fullName)}
                          className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition"
                          title="Delete Guest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Details Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-0.5">
                  <div className="flex items-center space-x-3">
                    <span>Attendees: <strong className="text-rose-300 font-semibold">{guest.allocatedAttendees || 1} Person(s)</strong></span>
                    <span>Dietary: <strong className="text-emerald-400 font-semibold">{guest.dietaryPreference || 'VEG'}</strong></span>
                  </div>

                  {guest.notes && (
                    <span className="text-[11px] text-slate-400 italic">Notes: "{guest.notes}"</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Internal Modals */}
      {!onOpenAddGuestModal && !onOpenEditGuestModal && (
        <GuestManagementModal
          isOpen={showManageModal}
          onClose={() => setShowManageModal(false)}
          weddingId={weddingId}
          existingGuest={selectedGuestForEdit}
          onRefresh={fetchGuests}
        />
      )}

      <DigitalInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        guest={selectedGuestForInvite}
        weddingObj={weddingObj}
      />
    </div>
  );
}
