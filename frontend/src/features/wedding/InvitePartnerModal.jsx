import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Sparkles, X, Copy, Check, ShieldCheck, Heart } from 'lucide-react';

export default function InvitePartnerModal({ isOpen, onClose, weddingId }) {
  const { invitePartner } = useWedding();
  const [inviteData, setInviteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const data = await invitePartner(weddingId);
      setInviteData(data);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate partner invitation.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (inviteData?.inviteCode) {
      navigator.clipboard.writeText(inviteData.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-rose-950/30 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-rose-300" />
            <span>Co-Owner Partner Access</span>
          </div>
          <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 to-amber-200 bg-clip-text text-transparent">
            Invite Your Partner
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Generate a unique code for your partner to join this wedding workspace with shared Co-Owner access.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {!inviteData ? (
          <div className="text-center py-4 space-y-4">
            <p className="text-xs text-slate-400">
              Your partner will be able to manage all events, RSVPs, tasks, vendors, and photo galleries together with you.
            </p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-xs shadow-lg shadow-rose-500/25 transition"
            >
              {loading ? 'Generating Code...' : 'Generate Partner Invitation Code'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center space-y-2">
              <span className="text-[10px] font-semibold text-amber-300 uppercase tracking-widest">Partner Invite Code</span>
              <div className="font-mono text-2xl font-bold text-rose-300 tracking-wider">
                {inviteData.inviteCode}
              </div>
              <p className="text-[10px] text-slate-500">Valid for 7 days</p>
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center space-x-2 transition border border-slate-700"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? 'Code Copied to Clipboard!' : 'Copy Invitation Code'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
