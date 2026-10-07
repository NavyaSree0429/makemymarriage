import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, ShieldCheck, LogOut, Edit3, Key, Check } from 'lucide-react';

export default function UserProfileCard() {
  const { user, logout, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ fullName, phone });
      setEditing(false);
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-rose-500/20">
            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-slate-100">{user.fullName}</h3>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Verified Account</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setEditing(!editing)}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold flex items-center space-x-1.5"
          >
            <Edit3 className="w-4 h-4" />
            <span>{editing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
          <button
            onClick={logout}
            className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-300 transition text-xs font-semibold flex items-center space-x-1.5"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <h4 className="text-xs font-semibold text-rose-300 uppercase tracking-wider">Update Profile Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Check className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-medium flex items-center space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span>Email</span>
            </span>
            <p className="font-semibold text-slate-200">{user.email}</p>
          </div>
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-medium flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Phone</span>
            </span>
            <p className="font-semibold text-slate-200">{user.phone || 'Not specified'}</p>
          </div>
          <div className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 space-y-1">
            <span className="text-slate-500 font-medium flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Session Status</span>
            </span>
            <p className="font-mono text-[11px] text-emerald-400">JWT Token Active</p>
          </div>
        </div>
      )}
    </div>
  );
}
