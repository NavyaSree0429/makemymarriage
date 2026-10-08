import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEventsApi, deleteEventApi } from '../../services/eventService';
import EventManagementModal from './EventManagementModal';
import { Calendar, Clock, MapPin, Video, Plus, Edit3, Trash2, Tag, ExternalLink, Sparkles, RefreshCw, Filter } from 'lucide-react';

const EVENT_TYPE_BADGES = {
  HALDI: { emoji: '💛', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30' },
  MEHENDI: { emoji: '💚', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' },
  SANGEET: { emoji: '🎵', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/30' },
  WEDDING: { emoji: '💍', bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30' },
  RECEPTION: { emoji: '🎉', bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30' },
  COCKTAIL: { emoji: '🥂', bg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30' },
  CUSTOM: { emoji: '✨', bg: 'bg-slate-500/10 text-slate-300 border-slate-500/30' },
};

export default function EventTimelineWidget({ weddingId, canManage = true, onOpenCreateModal, onOpenEditModal, refreshTrigger }) {
  const { accessToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    if (!weddingId || !accessToken) return;
    setLoading(true);
    try {
      const res = await getEventsApi(accessToken, weddingId);
      setEvents(res.data || []);
    } catch (err) {
      console.error('Failed to load event ceremonies:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [weddingId, accessToken, refreshTrigger]);

  const handleDelete = async (eventId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" ceremony?`)) {
      return;
    }
    try {
      await deleteEventApi(accessToken, weddingId, eventId);
      fetchEvents();
    } catch (err) {
      alert(err.message || 'Failed to delete ceremony function');
    }
  };

  const handleEdit = (event) => {
    if (onOpenEditModal) {
      onOpenEditModal(event);
    } else {
      setSelectedEvent(event);
      setShowModal(true);
    }
  };

  const handleAddClick = () => {
    if (onOpenCreateModal) {
      onOpenCreateModal();
    } else {
      setSelectedEvent(null);
      setShowModal(true);
    }
  };

  const filteredEvents = activeFilter === 'ALL'
    ? events
    : events.filter((e) => e.eventType === activeFilter);

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-rose-400" />
            <h3 className="font-serif text-xl font-bold text-slate-100">
              Ceremonies & Master Itinerary Timeline
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-semibold border border-rose-500/20">
              {events.length} Functions
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Chronological timeline of all wedding events, venues, dress codes, and live streams.
          </p>
        </div>

        {canManage && (
          <button
            onClick={handleAddClick}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition flex items-center space-x-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Ceremony</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 ${
            activeFilter === 'ALL'
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          All Functions ({events.length})
        </button>
        {Object.keys(EVENT_TYPE_BADGES).map((type) => {
          const count = events.filter((e) => e.eventType === type).length;
          if (count === 0 && activeFilter !== type) return null;
          const badge = EVENT_TYPE_BADGES[type];
          return (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition shrink-0 flex items-center space-x-1 border ${
                activeFilter === type
                  ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span>{badge.emoji}</span>
              <span>{type}</span>
              {count > 0 && <span className="opacity-75">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Timeline Content */}
      {loading ? (
        <div className="text-center py-10 text-xs text-slate-400 flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
          <span>Loading ceremony itinerary...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-slate-950/60 rounded-2xl border border-dashed border-slate-800 p-8 text-center space-y-3">
          <p className="text-xs text-slate-400">No ceremony events added to timeline yet.</p>
          {canManage && (
            <button
              onClick={handleAddClick}
              className="text-xs font-semibold text-rose-400 hover:underline inline-flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add your first function (Haldi, Mehendi, Sangeet...)</span>
            </button>
          )}
        </div>
      ) : (
        <div className="relative pl-6 lg:pl-8 space-y-6 before:absolute before:left-3 lg:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-rose-500 before:to-amber-500">
          {filteredEvents.map((evt) => {
            const badge = EVENT_TYPE_BADGES[evt.eventType] || EVENT_TYPE_BADGES.CUSTOM;
            const eventDateFormatted = evt.date
              ? new Date(evt.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Date TBD';

            return (
              <div key={evt._id} className="relative group animate-fadeIn">
                {/* Glowing Node Marker */}
                <div className="absolute -left-[31px] lg:-left-[39px] top-4 w-5 h-5 rounded-full bg-slate-950 border-2 border-rose-500 group-hover:border-amber-400 group-hover:scale-110 transition flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                </div>

                {/* Event Card */}
                <div className="p-5 bg-slate-950/70 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900 pb-3">
                    <div className="flex items-center space-x-2.5">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold border ${badge.bg}`}>
                        {badge.emoji} {evt.eventType}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-slate-100">{evt.title}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-amber-300" />
                        <span>
                          {eventDateFormatted} • {evt.startTime} - {evt.endTime}
                        </span>
                      </div>

                      {canManage && (
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(evt)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm cursor-pointer"
                            title="Edit Ceremony Details"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>Edit Ceremony</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(evt._id, evt.title)}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location & Dress Code Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Venue Location */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 font-semibold text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{evt.location?.venueName || 'Venue TBD'}</span>
                      </div>
                      {evt.location?.address && (
                        <p className="text-[11px] text-slate-400 pl-5">
                          {evt.location.address} {evt.location.city ? `• ${evt.location.city}` : ''}
                        </p>
                      )}
                      {evt.location?.googleMapsUrl && (
                        <a
                          href={evt.location.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-[11px] font-semibold text-sky-400 hover:underline pl-5 pt-0.5"
                        >
                          <span>Open Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Dress Code & Live Stream */}
                    <div className="space-y-2">
                      {evt.dressCode && (
                        <div className="flex items-center space-x-1.5">
                          <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="text-[11px] text-slate-400">Dress Code:</span>
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold">
                            {evt.dressCode}
                          </span>
                        </div>
                      )}

                      {evt.liveStreamUrl && (
                        <a
                          href={evt.liveStreamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-300 text-[11px] font-semibold hover:bg-sky-500/20 transition"
                        >
                          <Video className="w-3.5 h-3.5 text-sky-400" />
                          <span>🔴 Virtual Live Stream Ready</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Notes / Description */}
                  {evt.description && (
                    <p className="text-xs text-slate-300/90 pt-1 italic border-t border-slate-900/60">
                      "{evt.description}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Internal Modal Fallback (Used only if parent handlers are not provided) */}
      {!onOpenCreateModal && !onOpenEditModal && (
        <EventManagementModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          weddingId={weddingId}
          existingEvent={selectedEvent}
          onRefresh={fetchEvents}
        />
      )}
    </div>
  );
}
