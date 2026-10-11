import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import {
  Bell, CheckCheck, Trash2, X, Sparkles, Volume2, VolumeX,
  Send, ExternalLink, Calendar, CheckCircle, Gift, Camera,
  Users, CreditCard, Shield, Clock, Wifi, Zap
} from 'lucide-react';

export default function NotificationCenterModal({ isOpen, onClose }) {
  const {
    notifications,
    unreadCount,
    socketConnected,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    clearAll,
    sendTestNotification,
    soundEnabled,
    setSoundEnabled,
  } = useNotifications();

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [testingPing, setTestingPing] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'ALL', label: `All Activity (${notifications.length})` },
    { id: 'RSVP', label: `RSVPs & Guests (${notifications.filter((n) => n.category === 'RSVP').length})` },
    { id: 'VENDOR', label: `Milestone Payments (${notifications.filter((n) => n.category === 'VENDOR').length})` },
    { id: 'TASK', label: `Tasks & Checklist (${notifications.filter((n) => n.category === 'TASK').length})` },
    { id: 'EVENT', label: `Ceremonies (${notifications.filter((n) => n.category === 'EVENT').length})` },
    { id: 'PHOTO', label: `Photo Vault (${notifications.filter((n) => n.category === 'PHOTO').length})` },
  ];

  const filteredNotifications = notifications.filter((n) => {
    if (activeCategory === 'ALL') return true;
    return n.category === activeCategory;
  });

  const handleSendTestPing = async () => {
    setTestingPing(true);
    await sendTestNotification({
      title: 'VIP Guest RSVP Received! 🎉',
      message: 'Vikram & Ananya Malhotra just confirmed attendance (+2 Guests) for Auspicious Pheras!',
      category: 'RSVP',
      priority: 'HIGH',
      actionUrl: '#guests-section',
      actionLabel: 'View in Guest List',
    });
    setTestingPing(false);
  };

  const getCategoryConfig = (category) => {
    switch (category) {
      case 'RSVP':
        return {
          icon: Users,
          badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
          dotColor: 'bg-emerald-400',
          titleColor: 'text-emerald-300',
        };
      case 'VENDOR':
        return {
          icon: CreditCard,
          badgeColor: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          dotColor: 'bg-rose-400',
          titleColor: 'text-rose-300',
        };
      case 'EVENT':
        return {
          icon: Calendar,
          badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          dotColor: 'bg-amber-400',
          titleColor: 'text-amber-300',
        };
      case 'TASK':
        return {
          icon: CheckCircle,
          badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
          dotColor: 'bg-sky-400',
          titleColor: 'text-sky-300',
        };
      case 'PHOTO':
        return {
          icon: Camera,
          badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
          dotColor: 'bg-purple-400',
          titleColor: 'text-purple-300',
        };
      default:
        return {
          icon: Sparkles,
          badgeColor: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
          dotColor: 'bg-[#F3E5AB]',
          titleColor: 'text-[#F3E5AB]',
        };
    }
  };

  const formatTimestamp = (isoDate) => {
    if (!isoDate) return 'Just Now';
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just Now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F131D]/95 border border-[#F3E5AB]/30 rounded-3xl shadow-2xl shadow-rose-950/40 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#B76E79]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800/80 bg-[#171B26]/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B76E79] to-[#F3E5AB] flex items-center justify-center shadow-lg shadow-rose-500/20 text-[#0F131D]">
                <Bell className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl font-bold bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                    Wedding Activity & Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B76E79]/20 text-[#FFB2BC] border border-[#B76E79]/40 animate-pulse">
                      Unread ({unreadCount})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                    <span className="font-mono text-[11px] text-emerald-400">{socketConnected ? '24ms Live Synced' : 'Connecting...'}</span>
                  </span>
                  <span>•</span>
                  <span>Real-time concierge & team activity</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
                title={soundEnabled ? 'Mute royal audio chime' : 'Enable audio chime'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#F3E5AB]" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Row: Mark as Read & Filter Pills */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-[#F3E5AB] hover:text-white flex items-center gap-1.5 transition underline underline-offset-4 decoration-[#F3E5AB]/40"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            <button
              onClick={handleSendTestPing}
              disabled={testingPing}
              className="px-3 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-[#FFB2BC] border border-[#B76E79]/30 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{testingPing ? 'Dispatching...' : '⚡ Test Live Socket Alert'}</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-[#B76E79] to-[#9A5560] text-white border border-[#F3E5AB]/40 shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Feed List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/40">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-2xl">
                ✨
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-slate-200">You're all caught up!</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  No new wedding activity for this filter. When guests submit RSVPs or tasks are completed, alerts will stream in live.
                </p>
              </div>
            </div>
          ) : (
            filteredNotifications.map((n) => {
              const cfg = getCategoryConfig(n.category);
              const IconComp = cfg.icon;

              return (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                  className={`pt-3 first:pt-0 p-4 rounded-2xl transition-all relative group cursor-pointer ${
                    n.isRead
                      ? 'bg-slate-950/40 border border-slate-900 hover:bg-slate-900/40 hover:border-slate-800'
                      : 'bg-slate-900/80 border border-slate-800 hover:border-[#B76E79]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Category Icon & Unread Ping Dot */}
                    <div className="relative shrink-0">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${cfg.badgeColor}`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      {!n.isRead && (
                        <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${cfg.dotColor} ring-2 ring-slate-950 animate-pulse`}></span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.titleColor}`}>
                          {n.category} • {n.priority || 'NORMAL'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(n.createdAt)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(n._id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition"
                            title="Dismiss notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className={`text-sm font-semibold leading-snug ${n.isRead ? 'text-slate-300' : 'text-slate-100'}`}>
                        {n.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{n.message}</p>

                      {/* Action Button */}
                      {n.actionLabel && (
                        <div className="mt-3 flex items-center gap-2">
                          <a
                            href={n.actionUrl || '#'}
                            onClick={() => onClose()}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-[#F3E5AB] border border-slate-700 transition"
                          >
                            <span>{n.actionLabel}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#171B26]/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px]">Powered by MakeMyMarriage Socket.IO Live Telemetry</span>
          </div>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-slate-500 hover:text-rose-400 transition"
              >
                Clear all history
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
