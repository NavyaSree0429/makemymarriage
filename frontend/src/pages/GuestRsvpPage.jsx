import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicRsvpApi, submitPublicRsvpApi } from '../services/guestService';

export default function GuestRsvpPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [guest, setGuest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [rsvpStatus, setRsvpStatus] = useState('CONFIRMED');
  const [attendingCount, setAttendingCount] = useState(1);
  const [dietaryPreference, setDietaryPreference] = useState('VEG');
  const [acceptedEvents, setAcceptedEvents] = useState([]);
  const [wishes, setWishes] = useState('');

  useEffect(() => {
    fetchRsvpDetails();
  }, [token]);

  const fetchRsvpDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getPublicRsvpApi(token);
      const guestData = response.data;
      setGuest(guestData);

      // Pre-fill existing choices
      setRsvpStatus(guestData.rsvpStatus === 'PENDING' ? 'CONFIRMED' : guestData.rsvpStatus);
      setAttendingCount(guestData.attendingCount || guestData.allocatedAttendees || 1);
      setDietaryPreference(guestData.dietaryPreference || 'VEG');
      setWishes(guestData.wishes || '');

      // Default all invited events as accepted initially if not set
      if (guestData.acceptedEvents && guestData.acceptedEvents.length > 0) {
        setAcceptedEvents(guestData.acceptedEvents.map((e) => (typeof e === 'object' ? e._id : e)));
      } else if (guestData.invitedEvents && guestData.invitedEvents.length > 0) {
        setAcceptedEvents(guestData.invitedEvents.map((e) => (typeof e === 'object' ? e._id : e)));
      }

      if (guestData.rsvpStatus !== 'PENDING') {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unable to load invitation details. Please verify your link.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEvent = (eventId) => {
    if (acceptedEvents.includes(eventId)) {
      setAcceptedEvents(acceptedEvents.filter((id) => id !== eventId));
    } else {
      setAcceptedEvents([...acceptedEvents, eventId]);
    }
  };

  const handleSubmitRsvp = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      const payload = {
        rsvpStatus,
        attendingCount: rsvpStatus === 'CONFIRMED' ? attendingCount : 0,
        dietaryPreference,
        acceptedEvents: rsvpStatus === 'CONFIRMED' ? acceptedEvents : [],
        wishes,
      };

      const res = await submitPublicRsvpApi(token, payload);
      setGuest(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit RSVP response.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-[#F3E5AB] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-16 h-16 border-4 border-[#B76E79] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#B76E79] font-medium tracking-wide">Loading Royal Invitation...</p>
      </div>
    );
  }

  if (error && !guest) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#111827]/80 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ⚠️
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2 font-serif">Invitation Link Invalid</h2>
          <p className="text-gray-300 mb-6 text-sm">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white font-medium hover:opacity-90 transition shadow-lg"
          >
            Go to MakeMyMarriage Home
          </Link>
        </div>
      </div>
    );
  }

  const wedding = guest?.weddingId || {};
  const groomName = wedding.partner1Name || wedding.groomName || 'Groom';
  const brideName = wedding.partner2Name || wedding.brideName || 'Bride';
  const weddingTitle = wedding.title || `${groomName} & ${brideName}'s Royal Wedding`;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F3E5AB] font-sans selection:bg-[#B76E79]/30 pb-16">
      {/* Decorative Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#B76E79]/15 via-[#F3E5AB]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative max-w-xl mx-auto px-4 pt-8">
        {/* Royal Crest Monogram */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#B76E79]/30 to-[#F3E5AB]/20 border border-[#B76E79]/40 shadow-xl mb-4 backdrop-blur-md">
            <span className="font-serif text-2xl font-bold tracking-widest text-[#F3E5AB]">
              {groomName.charAt(0)} & {brideName.charAt(0)}
            </span>
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-wide bg-gradient-to-r from-[#F3E5AB] via-[#FFF] to-[#B76E79] bg-clip-text text-transparent">
            {weddingTitle}
          </h1>
          <p className="text-[#B76E79] text-sm mt-1 flex items-center justify-center gap-2 font-medium">
            <span>📍 {wedding.city || wedding.venueName || 'Udaipur, India'}</span>
            <span>•</span>
            <span>📅 {wedding.weddingDate || 'November 2026'}</span>
          </p>
        </div>

        {/* Personalized Welcome Badge */}
        <div className="bg-[#111827]/70 border border-[#B76E79]/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#B76E79] font-bold">Personalized Pass</span>
              <h2 className="text-2xl font-bold text-white mt-0.5">{guest.fullName}</h2>
              <p className="text-xs text-gray-400 mt-1">
                Category: <span className="text-[#F3E5AB] font-medium">{guest.category}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#B76E79]/20 text-[#F3E5AB] border border-[#B76E79]/40">
                🎟️ {guest.allocatedAttendees} Passes Allowed
              </span>
              <div className="mt-2">
                {guest.rsvpStatus === 'CONFIRMED' && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ✓ Confirmed
                  </span>
                )}
                {guest.rsvpStatus === 'DECLINED' && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    ✕ Declined
                  </span>
                )}
                {guest.rsvpStatus === 'PENDING' && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    ⏳ Response Pending
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Confirmation State View */}
        {submitted ? (
          <div className="bg-[#111827]/80 border border-[#10B981]/40 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-3xl">
              ✨
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-white mb-2">RSVP Response Saved!</h3>
              <p className="text-sm text-gray-300">
                Thank you, <strong className="text-[#F3E5AB]">{guest.fullName}</strong>. Your response has been sent to{' '}
                {groomName} & {brideName}.
              </p>
            </div>

            {/* Response Summary Card */}
            <div className="bg-[#0B0F19]/80 border border-[#B76E79]/30 rounded-xl p-5 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-gray-800 pb-2">
                <span className="text-gray-400">RSVP Status:</span>
                <span className={`font-bold ${guest.rsvpStatus === 'CONFIRMED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {guest.rsvpStatus}
                </span>
              </div>
              {guest.rsvpStatus === 'CONFIRMED' && (
                <>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Attending Guests:</span>
                    <span className="font-bold text-white">{guest.attendingCount} Person(s)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-2">
                    <span className="text-gray-400">Dietary Preference:</span>
                    <span className="font-bold text-[#F3E5AB]">{guest.dietaryPreference}</span>
                  </div>
                </>
              )}
              {guest.wishes && (
                <div className="pt-1">
                  <span className="text-gray-400 block mb-1">Your Wishes / Message:</span>
                  <p className="text-gray-200 italic bg-gray-900/60 p-2.5 rounded-lg border border-gray-800">
                    "{guest.wishes}"
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="w-full py-3 rounded-xl border border-[#B76E79]/50 text-[#F3E5AB] hover:bg-[#B76E79]/20 transition text-sm font-medium"
            >
              ✏️ Update Response
            </button>
          </div>
        ) : (
          /* RSVP Form */
          <form onSubmit={handleSubmitRsvp} className="space-y-6">
            {/* Status Choice */}
            <div className="bg-[#111827]/70 border border-[#B76E79]/30 rounded-2xl p-6 backdrop-blur-xl">
              <h3 className="text-sm uppercase tracking-wider text-[#B76E79] font-bold mb-4">
                Will you be attending?
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRsvpStatus('CONFIRMED')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center transition ${
                    rsvpStatus === 'CONFIRMED'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
                      : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <span className="text-2xl mb-1">🎉</span>
                  <span className="font-bold text-sm">Joyfully Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRsvpStatus('DECLINED')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center transition ${
                    rsvpStatus === 'DECLINED'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10'
                      : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <span className="text-2xl mb-1">💌</span>
                  <span className="font-bold text-sm">Regretfully Decline</span>
                </button>
              </div>
            </div>

            {rsvpStatus === 'CONFIRMED' && (
              <>
                {/* Attending Count & Dietary */}
                <div className="bg-[#111827]/70 border border-[#B76E79]/30 rounded-2xl p-6 backdrop-blur-xl space-y-5">
                  {/* Attending Guests Count */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#B76E79] font-bold block mb-2">
                      Number of Attending Guests (Max {guest.allocatedAttendees})
                    </label>
                    <div className="flex items-center gap-4 bg-gray-900/60 p-3 rounded-xl border border-gray-800 w-fit">
                      <button
                        type="button"
                        onClick={() => setAttendingCount(Math.max(1, attendingCount - 1))}
                        className="w-10 h-10 rounded-lg bg-[#B76E79]/20 text-[#F3E5AB] font-bold text-xl hover:bg-[#B76E79]/30"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold text-white w-8 text-center">{attendingCount}</span>
                      <button
                        type="button"
                        onClick={() => setAttendingCount(Math.min(guest.allocatedAttendees, attendingCount + 1))}
                        className="w-10 h-10 rounded-lg bg-[#B76E79]/20 text-[#F3E5AB] font-bold text-xl hover:bg-[#B76E79]/30"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Dietary Preferences */}
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#B76E79] font-bold block mb-2">
                      Dietary Preferences
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'VEG', label: 'Pure Veg 🥦' },
                        { id: 'NON_VEG', label: 'Non-Veg 🍗' },
                        { id: 'JAIN', label: 'Jain 🪷' },
                        { id: 'VEGAN', label: 'Vegan 🥗' },
                        { id: 'EGGITARIAN', label: 'Eggitarian 🥚' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setDietaryPreference(item.id)}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                            dietaryPreference === item.id
                              ? 'bg-[#B76E79] border-[#B76E79] text-white shadow-lg'
                              : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Invited Ceremonies Checklist */}
                {guest.invitedEvents && guest.invitedEvents.length > 0 && (
                  <div className="bg-[#111827]/70 border border-[#B76E79]/30 rounded-2xl p-6 backdrop-blur-xl">
                    <h3 className="text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-3">
                      Select Functions You Will Attend
                    </h3>
                    <div className="space-y-3">
                      {guest.invitedEvents.map((evt) => {
                        const eventObj = typeof evt === 'object' ? evt : { _id: evt, title: 'Ceremony Event' };
                        const isChecked = acceptedEvents.includes(eventObj._id);

                        return (
                          <div
                            key={eventObj._id}
                            onClick={() => handleToggleEvent(eventObj._id)}
                            className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              isChecked
                                ? 'bg-[#B76E79]/15 border-[#B76E79]/50 text-white'
                                : 'bg-gray-900/40 border-gray-800 text-gray-500'
                            }`}
                          >
                            <div>
                              <p className="font-bold text-sm text-[#F3E5AB]">{eventObj.title}</p>
                              {eventObj.date && (
                                <p className="text-xs text-gray-400">
                                  📅 {eventObj.date} {eventObj.startTime ? `• ${eventObj.startTime}` : ''}
                                </p>
                              )}
                            </div>
                            <div
                              className={`w-6 h-6 rounded-md border flex items-center justify-center font-bold text-xs ${
                                isChecked
                                  ? 'bg-[#B76E79] border-[#B76E79] text-white'
                                  : 'border-gray-700 bg-gray-900 text-transparent'
                              }`}
                            >
                              ✓
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Wishes & Song Requests */}
            <div className="bg-[#111827]/70 border border-[#B76E79]/30 rounded-2xl p-6 backdrop-blur-xl">
              <label className="text-xs uppercase tracking-wider text-[#B76E79] font-bold block mb-2">
                Send Blessings or Song Request
              </label>
              <textarea
                rows={3}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder="Write your wishes or favorite sangeet track for the couple..."
                className="w-full bg-gray-900/70 border border-gray-800 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#B76E79] transition"
              />
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B76E79] via-[#D4AF37] to-[#B76E79] text-white font-bold text-base shadow-xl hover:opacity-95 transition disabled:opacity-50"
            >
              {submitting ? 'Submitting Response...' : '✨ Confirm & Submit RSVP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
