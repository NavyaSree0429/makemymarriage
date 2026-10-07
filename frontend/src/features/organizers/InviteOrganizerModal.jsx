import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { inviteOrganizerApi, updateOrganizerPermissionsApi } from '../../services/organizerService';
import { Mail, User, Shield, Sparkles, X, Check, Lock, AlertCircle, ArrowRight, Share2, Copy, Send } from 'lucide-react';

export default function InviteOrganizerModal({ isOpen, onClose, weddingId, existingMembership = null, onRefresh }) {
  const { accessToken } = useAuth();

  const isEdit = !!existingMembership;

  const [email, setEmail] = useState(existingMembership?.user?.email || '');
  const [fullName, setFullName] = useState(existingMembership?.user?.fullName || '');
  
  const [permissions, setPermissions] = useState({
    canManageEvents: existingMembership?.permissions?.canManageEvents ?? true,
    canManageGuests: existingMembership?.permissions?.canManageGuests ?? true,
    canManageInvitations: existingMembership?.permissions?.canManageInvitations ?? true,
    canManageTasks: existingMembership?.permissions?.canManageTasks ?? true,
    canManageVendors: existingMembership?.permissions?.canManageVendors ?? true,
    canManageBudget: existingMembership?.permissions?.canManageBudget ?? false,
    canManageGallery: existingMembership?.permissions?.canManageGallery ?? false,
    canManageWebsite: existingMembership?.permissions?.canManageWebsite ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [invitedSuccessData, setInvitedSuccessData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const applyPreset = (preset) => {
    if (preset === 'PLANNER') {
      setPermissions({
        canManageEvents: true,
        canManageGuests: true,
        canManageInvitations: true,
        canManageTasks: true,
        canManageVendors: true,
        canManageBudget: false,
        canManageGallery: false,
        canManageWebsite: true,
      });
    } else if (preset === 'FAMILY') {
      setPermissions({
        canManageEvents: true,
        canManageGuests: true,
        canManageInvitations: true,
        canManageTasks: true,
        canManageVendors: false,
        canManageBudget: false,
        canManageGallery: true,
        canManageWebsite: true,
      });
    } else if (preset === 'FULL') {
      setPermissions({
        canManageEvents: true,
        canManageGuests: true,
        canManageInvitations: true,
        canManageTasks: true,
        canManageVendors: true,
        canManageBudget: true,
        canManageGallery: true,
        canManageWebsite: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInvitedSuccessData(null);

    try {
      if (isEdit) {
        await updateOrganizerPermissionsApi(accessToken, weddingId, existingMembership.membershipId, permissions);
        if (onRefresh) onRefresh();
        onClose();
      } else {
        const res = await inviteOrganizerApi(accessToken, weddingId, {
          email,
          fullName,
          permissions,
        });
        setInvitedSuccessData({
          email,
          fullName: fullName || email.split('@')[0],
          permissions,
          result: res.data,
        });
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to process organizer request.');
    } finally {
      setLoading(false);
    }
  };

  const getInviteText = () => {
    const name = invitedSuccessData?.fullName || email;
    return `Hi ${name}! You've been invited as an Organizer on MakeMyMarriage to help plan our wedding.\n\nSign in to access your workspace: http://localhost:5173/signin\nLogin Email: ${invitedSuccessData?.email || email}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getInviteText());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getInviteText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleEmailShare = () => {
    const targetEmail = invitedSuccessData?.email || email;
    const subject = encodeURIComponent('Wedding Organizer Access Invitation - MakeMyMarriage');
    const body = encodeURIComponent(getInviteText());
    window.open(`mailto:${targetEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  const handleResetModal = () => {
    setInvitedSuccessData(null);
    setEmail('');
    setFullName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-rose-950/50 my-8">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleResetModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If Invitation is Generated/Sent Successfully */}
        {invitedSuccessData ? (
          <div className="space-y-6 text-center animate-fadeIn py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-3xl font-bold">
              ✓
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-emerald-200 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                Organizer Invited & Configured!
              </h3>
              <p className="text-xs text-slate-300">
                Workspace access created for <span className="font-semibold text-rose-300">{invitedSuccessData.email}</span> with custom module permissions.
              </p>
            </div>

            {/* Instant Sharing Buttons */}
            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 text-left">
              <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
                📲 Send Direct Invitation
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click below to send the sign-in details directly via WhatsApp or Email, or copy the link:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleEmailShare}
                  className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via Email</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition border border-slate-700"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedLink ? 'Invitation Details Copied!' : 'Copy Invitation Link & Message'}</span>
              </button>
            </div>

            <button
              onClick={handleResetModal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-xs shadow-md transition"
            >
              Done & Return to Dashboard
            </button>
          </div>
        ) : (
          /* Form View */
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold mb-2 border border-rose-500/20">
                <Shield className="w-3.5 h-3.5 text-amber-300" />
                <span>Granular Access Control</span>
              </div>
              <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                {isEdit ? 'Edit Organizer Permissions' : 'Invite New Organizer'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Control exact module permissions for planners or family members.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isEdit && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Organizer Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="planner@weddings.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Full Name (Optional)</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Anita Verma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Role Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Quick Permission Presets</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('PLANNER')}
                    className="py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:border-rose-500/50 transition text-center"
                  >
                    📋 Lead Planner
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('FAMILY')}
                    className="py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:border-amber-500/50 transition text-center"
                  >
                    🏡 Family Coord
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('FULL')}
                    className="py-1.5 px-2 rounded-xl text-[11px] font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:border-emerald-500/50 transition text-center"
                  >
                    ⭐ Full Access
                  </button>
                </div>
              </div>

              {/* 8 Granular Permission Switches Grid */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-medium text-slate-300">Granular Module Permissions</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  <PermissionToggle
                    label="Ceremony Schedules"
                    desc="Haldi, Sangeet & Pheras"
                    active={permissions.canManageEvents}
                    onClick={() => togglePermission('canManageEvents')}
                  />
                  <PermissionToggle
                    label="Guest List & RSVPs"
                    desc="Attendees & Dietary notes"
                    active={permissions.canManageGuests}
                    onClick={() => togglePermission('canManageGuests')}
                  />
                  <PermissionToggle
                    label="Digital Invitations"
                    desc="WhatsApp links & Templates"
                    active={permissions.canManageInvitations}
                    onClick={() => togglePermission('canManageInvitations')}
                  />
                  <PermissionToggle
                    label="Task Assignments"
                    desc="Tasks & Priorities"
                    active={permissions.canManageTasks}
                    onClick={() => togglePermission('canManageTasks')}
                  />
                  <PermissionToggle
                    label="Vendor Contacts"
                    desc="Caterer, Decor & DJ"
                    active={permissions.canManageVendors}
                    onClick={() => togglePermission('canManageVendors')}
                  />
                  <PermissionToggle
                    label="Budget & Financials"
                    desc="Expense amounts (Sensitive)"
                    active={permissions.canManageBudget}
                    onClick={() => togglePermission('canManageBudget')}
                    isSensitive
                  />
                  <PermissionToggle
                    label="Private Photo Albums"
                    desc="Family Photo Uploads"
                    active={permissions.canManageGallery}
                    onClick={() => togglePermission('canManageGallery')}
                  />
                  <PermissionToggle
                    label="Public Website Copy"
                    desc="Website details & Maps"
                    active={permissions.canManageWebsite}
                    onClick={() => togglePermission('canManageWebsite')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-xs shadow-lg shadow-rose-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? 'Generating Invitation...' : isEdit ? 'Update Organizer Permissions' : 'Generate & Send Organizer Invitation'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function PermissionToggle({ label, desc, active, onClick, isSensitive = false }) {
  return (
    <div
      onClick={onClick}
      className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
        active
          ? 'bg-rose-500/10 border-rose-500/40 text-slate-100'
          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
      }`}
    >
      <div className="space-y-0.5 pr-2">
        <div className="flex items-center space-x-1.5">
          <span className="text-xs font-semibold">{label}</span>
          {isSensitive && <Lock className="w-3 h-3 text-amber-400" />}
        </div>
        <p className="text-[10px] text-slate-400">{desc}</p>
      </div>
      <div className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${active ? 'bg-rose-500' : 'bg-slate-800'}`}>
        <div className={`w-3 h-3 rounded-full bg-white transition-transform ${active ? 'translate-x-4' : 'translate-x-0'}`}></div>
      </div>
    </div>
  );
}
