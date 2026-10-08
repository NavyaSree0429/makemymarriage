import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createGuestApi, updateGuestApi } from '../../services/guestService';
import { getEventsApi } from '../../services/eventService';
import { Users, Mail, Phone, Tag, Utensils, Calendar, X, Check, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

const CATEGORIES = [
  { id: 'BRIDE_FAMILY', label: '👰 Bride Family', color: 'text-rose-300 border-rose-500/30 bg-rose-500/10' },
  { id: 'GROOM_FAMILY', label: '🤵 Groom Family', color: 'text-amber-300 border-amber-500/30 bg-amber-500/10' },
  { id: 'FRIENDS', label: '🎉 Friends', color: 'text-purple-300 border-purple-500/30 bg-purple-500/10' },
  { id: 'VIP', label: '⭐ VIP Guests', color: 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' },
  { id: 'PLANNERS', label: '📋 Planners & Crew', color: 'text-sky-300 border-sky-500/30 bg-sky-500/10' },
  { id: 'GENERAL', label: '👥 General Guests', color: 'text-slate-300 border-slate-700 bg-slate-800/50' },
];

export default function GuestManagementModal({ isOpen, onClose, weddingId, existingGuest = null, onRefresh }) {
  const { accessToken } = useAuth();
  const isEdit = !!existingGuest;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('BRIDE_FAMILY');
  const [allocatedAttendees, setAllocatedAttendees] = useState(1);
  const [dietaryPreference, setDietaryPreference] = useState('VEG');
  const [rsvpStatus, setRsvpStatus] = useState('PENDING');
  const [invitedEvents, setInvitedEvents] = useState([]);
  const [notes, setNotes] = useState('');

  const [availableEvents, setAvailableEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (weddingId && accessToken && isOpen) {
      getEventsApi(accessToken, weddingId)
        .then((res) => setAvailableEvents(res.data || []))
        .catch((err) => console.error('Failed to load events for guest modal:', err.message));
    }
  }, [weddingId, accessToken, isOpen]);

  useEffect(() => {
    if (existingGuest && isOpen) {
      setFullName(existingGuest.fullName || '');
      setEmail(existingGuest.email || '');
      setPhone(existingGuest.phone || '');
      setCategory(existingGuest.category || 'BRIDE_FAMILY');
      setAllocatedAttendees(existingGuest.allocatedAttendees || 1);
      setDietaryPreference(existingGuest.dietaryPreference || 'VEG');
      setRsvpStatus(existingGuest.rsvpStatus || 'PENDING');
      setNotes(existingGuest.notes || '');
      
      const evtIds = (existingGuest.invitedEvents || []).map((evt) => (typeof evt === 'object' ? evt._id : evt));
      setInvitedEvents(evtIds);
    } else if (isOpen) {
      setFullName('');
      setEmail('');
      setPhone('');
      setCategory('BRIDE_FAMILY');
      setAllocatedAttendees(1);
      setDietaryPreference('VEG');
      setRsvpStatus('PENDING');
      setNotes('');
      // Default to all events
      setInvitedEvents(availableEvents.map((e) => e._id));
    }
  }, [existingGuest, isOpen, availableEvents]);

  if (!isOpen) return null;

  const toggleEventSelection = (eventId) => {
    setInvitedEvents((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleSelectAllEvents = () => {
    if (invitedEvents.length === availableEvents.length) {
      setInvitedEvents([]);
    } else {
      setInvitedEvents(availableEvents.map((e) => e._id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      fullName,
      email,
      phone,
      category,
      allocatedAttendees: Number(allocatedAttendees),
      dietaryPreference,
      rsvpStatus,
      invitedEvents,
      notes,
    };

    try {
      if (isEdit) {
        await updateGuestApi(accessToken, weddingId, existingGuest._id, payload);
        setSuccessMsg('Guest record updated successfully!');
      } else {
        await createGuestApi(accessToken, weddingId, payload);
        setSuccessMsg('New guest added to roster successfully!');
      }

      if (onRefresh) onRefresh();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save guest record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-rose-950/40 my-8">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold mb-2 border border-rose-500/20">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>Guest Roster & E-Vites</span>
          </div>
          <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            {isEdit ? 'Edit Guest Record' : 'Add New Guest'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Manage attendance, assigned functions, dietary preferences, and digital invitation details.
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Guest / Family Name</label>
              <input
                type="text"
                required
                placeholder="Rajesh Sharma & Family"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-2.5 text-xs text-rose-300 focus:outline-none focus:border-rose-500 font-semibold"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Email Address (Optional)</span>
              </label>
              <input
                type="email"
                placeholder="guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>WhatsApp / Phone Number</span>
              </label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Attendees, Dietary & RSVP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Allocated Attendees</label>
              <input
                type="number"
                min="1"
                max="20"
                required
                value={allocatedAttendees}
                onChange={(e) => setAllocatedAttendees(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                <Utensils className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dietary Preference</span>
              </label>
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-2.5 text-xs text-slate-100 focus:outline-none focus:border-rose-500 font-medium"
              >
                <option value="VEG">🥗 Pure Veg</option>
                <option value="NON_VEG">🍗 Non-Veg</option>
                <option value="JAIN">🌿 Jain Veg</option>
                <option value="VEGAN">🌱 Vegan</option>
                <option value="EGGITARIAN">🥚 Eggitarian</option>
                <option value="NO_PREFERENCE">🍽️ No Preference</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>RSVP Status</span>
              </label>
              <select
                value={rsvpStatus}
                onChange={(e) => setRsvpStatus(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 px-2.5 text-xs focus:outline-none focus:border-rose-500 font-semibold"
              >
                <option value="PENDING" className="text-amber-400">⏳ Pending Response</option>
                <option value="CONFIRMED" className="text-emerald-400">✅ Confirmed Attending</option>
                <option value="DECLINED" className="text-rose-400">❌ Declined</option>
              </select>
            </div>
          </div>

          {/* Invited Ceremonies Selection */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300 flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>Invited Ceremonies & Functions</span>
              </label>
              {availableEvents.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllEvents}
                  className="text-[11px] font-semibold text-rose-300 hover:underline"
                >
                  {invitedEvents.length === availableEvents.length ? 'Deselect All' : 'Select All Ceremonies'}
                </button>
              )}
            </div>

            {availableEvents.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No ceremony events scheduled yet. Add ceremonies in MOD-04 to assign them to guests.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                {availableEvents.map((evt) => {
                  const isChecked = invitedEvents.includes(evt._id);
                  return (
                    <div
                      key={evt._id}
                      onClick={() => toggleEventSelection(evt._id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                        isChecked
                          ? 'bg-rose-500/10 border-rose-500/40 text-slate-100'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-0.5 pr-2">
                        <span className="font-semibold block">{evt.title}</span>
                        <span className="text-[10px] text-slate-400 block">{evt.eventType} • {evt.startTime}</span>
                      </div>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-700'}`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Notes / Seating */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Notes / Table Seating Preferences</label>
            <textarea
              rows={2}
              placeholder="e.g. Ground floor seating near main stage required."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-xs shadow-lg shadow-rose-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Saving Guest...' : isEdit ? 'Update Guest Record' : 'Save Guest & Generate Digital E-Invite'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
