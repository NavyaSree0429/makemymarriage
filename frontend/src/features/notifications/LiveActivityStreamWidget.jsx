import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import {
  Radio, CheckCircle2, CreditCard, Camera, MessageSquare,
  Volume2, VolumeX, ShieldCheck, Zap, Sliders, Ship, ArrowRight,
  Sparkles, Download, Bell, Activity
} from 'lucide-react';

export default function LiveActivityStreamWidget({ weddingId }) {
  const {
    notifications,
    socketConnected,
    sendTestNotification,
    soundEnabled,
    setSoundEnabled,
  } = useNotifications();

  // Granular Alert Toggle States from Stitch design
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [escrowAlertsEnabled, setEscrowAlertsEnabled] = useState(true);
  const [logisticsEnabled, setLogisticsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('STREAM'); // 'STREAM' or 'SETTINGS'

  const recentStream = notifications.slice(0, 4);

  return (
    <div className="bg-[#111827]/80 border border-[#B76E79]/30 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#0F131D] border border-[#F3E5AB]/30 text-[#F3E5AB] flex items-center justify-center shadow-lg shadow-amber-500/10">
            <Radio className="w-5 h-5 animate-pulse text-[#F3E5AB]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-[#B76E79] font-bold">WebSocket Telemetry</span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
              <span className="font-mono text-xs text-slate-400">room_{weddingId?.slice(-6) || 'active'}</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white mt-0.5">Live Operational Stream & Dispatch</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
            <span>{socketConnected ? 'ACTIVE LISTENER • 24ms' : 'CONNECTING...'}</span>
          </span>

          <button
            onClick={() => sendTestNotification({
              title: 'Royal Mandap Stage Prepared 🌺',
              message: 'Lead florist confirmed completion of 1,200 fresh Dutch Hydrangeas and marigold garlands.',
              category: 'EVENT',
              priority: 'NORMAL',
              actionUrl: '#events-section',
              actionLabel: 'View Schedule',
            })}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#F3E5AB] border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
            title="Trigger WebSocket real-time test ping"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Emit Test Event</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Timeline Stream & Right Dispatch Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Real-Time Event Timeline Nodes (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-[#F3E5AB]" />
            <span>Real-Time Activity Timeline</span>
          </h3>

          <div className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#F3E5AB] before:via-slate-800 before:to-transparent space-y-4">
            {recentStream.map((item, idx) => {
              const isFirst = idx === 0;
              return (
                <div key={item._id} className="relative group">
                  {/* Glowing Node Dot */}
                  <span
                    className={`absolute -left-6 top-2 w-4 h-4 rounded-full bg-slate-950 border-2 flex items-center justify-center ring-4 ring-slate-900 shadow-md ${
                      item.category === 'RSVP'
                        ? 'border-emerald-400 shadow-emerald-500/50'
                        : item.category === 'VENDOR'
                        ? 'border-rose-400 shadow-rose-500/50'
                        : item.category === 'PHOTO'
                        ? 'border-purple-400 shadow-purple-500/50'
                        : 'border-[#F3E5AB] shadow-amber-500/50'
                    }`}
                  ></span>

                  {/* Node Card */}
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.category === 'RSVP'
                              ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                              : item.category === 'VENDOR'
                              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                              : item.category === 'PHOTO'
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                              : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Event: <code className="text-slate-300">{item.metadata?.source || 'socket.broadcast'}</code>
                        </span>
                      </div>
                      <span className="text-[11px] text-[#F3E5AB] font-mono font-semibold">
                        {isFirst ? 'Just Now' : `${(idx + 1) * 15}m ago`}
                      </span>
                    </div>

                    <h4 className="mt-2 text-sm font-semibold text-slate-100">{item.title}</h4>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">{item.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Alert Dispatch Matrix (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#F3E5AB]" />
                  <span>Live Alert Dispatch Matrix</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Customize real-time push protocols</p>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-[#F3E5AB]/30 text-[10px] font-mono text-[#F3E5AB] font-semibold">
                SYNC ENABLED
              </span>
            </div>

            {/* Toggle 1: WhatsApp VIP Concierge */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">WhatsApp VIP Concierge</div>
                  <div className="text-[10px] text-slate-400">Instant push to couple & organizers</div>
                </div>
              </div>
              <button
                onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${whatsappEnabled ? 'bg-[#B76E79]' : 'bg-slate-800'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${whatsappEnabled ? 'right-[3px]' : 'left-[3px]'}`}></div>
              </button>
            </div>

            {/* Toggle 2: Escrow Disbursal Payouts */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-300 flex items-center justify-center border border-amber-500/20">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Escrow Payout Triggers</div>
                  <div className="text-[10px] text-slate-400">Alert on payments &gt; ₹50,000</div>
                </div>
              </div>
              <button
                onClick={() => setEscrowAlertsEnabled(!escrowAlertsEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${escrowAlertsEnabled ? 'bg-[#B76E79]' : 'bg-slate-800'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${escrowAlertsEnabled ? 'right-[3px]' : 'left-[3px]'}`}></div>
              </button>
            </div>

            {/* Toggle 3: Flotilla & Gate Logistics */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center border border-sky-500/20">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Flotilla & Gate Logistics</div>
                  <div className="text-[10px] text-slate-400">Island boat shuttle arrival broadcast</div>
                </div>
              </div>
              <button
                onClick={() => setLogisticsEnabled(!logisticsEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${logisticsEnabled ? 'bg-[#B76E79]' : 'bg-slate-800'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${logisticsEnabled ? 'right-[3px]' : 'left-[3px]'}`}></div>
              </button>
            </div>

            {/* Toggle 4: Audio Synthesizer Chime */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-200">Chime Synthesizer</div>
                  <div className="text-[10px] text-slate-400">Royal harp audio chime on live RSVP</div>
                </div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-10 h-5 rounded-full transition-colors relative ${soundEnabled ? 'bg-[#B76E79]' : 'bg-slate-800'}`}
              >
                <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform ${soundEnabled ? 'right-[3px]' : 'left-[3px]'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
