import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Heart, Sparkles, X, KeyRound, Check, AlertCircle } from 'lucide-react';

export default function AcceptPartnerInviteModal({ isOpen, onClose }) {
  const { acceptPartnerInvite } = useWedding();
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await acceptPartnerInvite(inviteCode.trim());
      setSuccessMsg(`Successfully joined ${res.wedding?.title || 'Wedding Workspace'} as Partner!`);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid or expired invitation code.');
    } finally {
      setLoading(false);
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
            <span>Join Partner Workspace</span>
          </div>
          <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 to-amber-200 bg-clip-text text-transparent">
            Accept Partner Invitation
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter the invitation code provided by your partner to join their wedding workspace as Co-Owner.
          </p>
        </div>

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
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Invitation Code</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="PARTNER-123456"
                value={inviteCode}
                onChange={(e) => { setInviteCode(e.target.value); setErrorMsg(''); }}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono text-slate-100 placeholder-slate-500 uppercase focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-xs shadow-lg shadow-rose-500/25 transition disabled:opacity-50"
          >
            {loading ? 'Joining Workspace...' : 'Accept Invitation & Join'}
          </button>
        </form>
      </div>
    </div>
  );
}
