import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, Share2, Send, Calendar, MapPin, Heart } from 'lucide-react';

export default function DigitalInviteModal({ isOpen, onClose, guest, weddingObj }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !guest) return null;

  const partner1 = weddingObj?.partnerNames?.partner1 || 'Partner 1';
  const partner2 = weddingObj?.partnerNames?.partner2 || 'Partner 2';
  const weddingDate = weddingObj?.weddingDate
    ? new Date(weddingObj.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBD';
  const venue = weddingObj?.primaryLocation?.venueName || 'Venue TBD';
  const city = weddingObj?.primaryLocation?.city || 'City TBD';

  const rsvpUrl = `http://localhost:5173/rsvp/${guest.invitationToken}`;

  const getInviteMessage = () => {
    return `✨ Wedding Invitation ✨\n\nDear ${guest.fullName},\n\nWe cordially invite you to celebrate the wedding of ${partner1} & ${partner2}!\n\n🗓 Date: ${weddingDate}\n📍 Venue: ${venue}, ${city}\n👥 Allocated Attendees: ${guest.allocatedAttendees} Person(s)\n\nPlease view your personalized itinerary and confirm your RSVP online here:\n${rsvpUrl}\n\nWe look forward to celebrating with you! 💕`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getInviteMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getInviteMessage());
    const phone = guest.phone ? guest.phone.replace(/[^0-9]/g, '') : '';
    const whatsappUrl = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${text}`
      : `https://api.whatsapp.com/send?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Wedding Invitation - ${partner1} & ${partner2}`);
    const body = encodeURIComponent(getInviteMessage());
    window.open(`mailto:${guest.email || ''}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-rose-950/40 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold mb-2 border border-rose-500/20">
            <Heart className="w-3.5 h-3.5 fill-rose-300" />
            <span>Digital E-Invite Card</span>
          </div>
          <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            Preview & Send Digital E-Invite
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Personalized royal invitation card for <span className="font-semibold text-rose-300">{guest.fullName}</span>.
          </p>
        </div>

        {/* Royal Card Preview */}
        <div className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-rose-950/30 p-6 rounded-2xl border border-amber-500/30 text-center space-y-4 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400"></div>

          <div className="text-amber-300 text-xs font-semibold uppercase tracking-widest">
            Together with their families
          </div>

          <h2 className="font-serif text-3xl font-extrabold text-slate-100">
            {partner1} <span className="text-rose-400 font-serif font-normal">&</span> {partner2}
          </h2>

          <div className="w-16 h-0.5 bg-amber-400/40 mx-auto"></div>

          <p className="text-xs text-slate-300">
            Request the honor of your presence to celebrate their wedding union.
          </p>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-slate-200 font-semibold">
              <Calendar className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{weddingDate}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{venue}, {city}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Invited Attendees: <strong className="text-rose-300">{guest.allocatedAttendees} Person(s)</strong></span>
              <span>Dietary: <strong className="text-emerald-400">{guest.dietaryPreference}</strong></span>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-1">Accountless RSVP Link</span>
            <div className="p-2 bg-slate-950 rounded-lg text-[11px] font-mono text-rose-300 border border-slate-800 break-all select-all">
              {rsvpUrl}
            </div>
          </div>
        </div>

        {/* Instant Sharing Actions */}
        <div className="space-y-2 pt-4">
          <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block text-center">
            📲 Send Invitation Now
          </span>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-md"
            >
              <Share2 className="w-4 h-4" />
              <span>WhatsApp Invite</span>
            </button>

            <button
              type="button"
              onClick={handleEmailShare}
              className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Email Invite</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Invitation Link & Message Copied!' : 'Copy Digital E-Invite Link & Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
