import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOrganizersApi, revokeOrganizerApi } from '../../services/organizerService';
import InviteOrganizerModal from './InviteOrganizerModal';
import { Shield, UserPlus, Edit3, Trash2, CheckCircle2, Lock, Sparkles, RefreshCw } from 'lucide-react';

export default function OrganizersListWidget({ weddingId, canManage = true, onOpenInviteModal, refreshTrigger }) {
  const { accessToken } = useAuth();
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fallback Internal Modal States (if parent doesn't handle modal)
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);

  const fetchOrganizers = async () => {
    if (!weddingId || !accessToken) return;
    setLoading(true);
    try {
      const res = await getOrganizersApi(accessToken, weddingId);
      setOrganizers(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizers();
  }, [weddingId, accessToken, refreshTrigger]);

  const handleOpenInvite = (membership = null) => {
    if (onOpenInviteModal) {
      onOpenInviteModal(membership);
    } else {
      setSelectedMembership(membership);
      setShowInviteModal(true);
    }
  };

  const handleRevoke = async (membershipId, name) => {
    if (!window.confirm(`Are you sure you want to revoke organizer access for ${name || 'this organizer'}?`)) {
      return;
    }
    try {
      await revokeOrganizerApi(accessToken, weddingId, membershipId);
      fetchOrganizers();
    } catch (err) {
      alert(err.message || 'Failed to revoke organizer access');
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-rose-400" />
          <h3 className="font-semibold text-slate-100 text-base">Organizers & Granular Permissions</h3>
        </div>

        {canManage && (
          <button
            onClick={() => handleOpenInvite(null)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md transition flex items-center space-x-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Organizer</span>
          </button>
        )}
      </div>

      {/* Roster List */}
      {loading ? (
        <div className="text-center py-6 text-xs text-slate-400 flex items-center justify-center space-x-2">
          <RefreshCw className="w-4 h-4 animate-spin text-rose-400" />
          <span>Loading organizers roster...</span>
        </div>
      ) : organizers.length === 0 ? (
        <div className="text-center py-6 text-xs text-slate-400 space-y-2">
          <p>No external organizers invited yet.</p>
          {canManage && (
            <button
              onClick={() => handleOpenInvite(null)}
              className="text-rose-400 hover:underline font-semibold"
            >
              + Invite family members or planners
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {organizers.map((item) => {
            const isOwner = item.role === 'OWNER';
            const isPartner = item.role === 'PARTNER';
            const userName = item.user?.fullName || 'Organizer User';
            const userEmail = item.user?.email || '';

            return (
              <div
                key={item.membershipId}
                className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500/20 to-amber-500/20 text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-500/30">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-slate-200 text-xs">{userName}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                          isOwner ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          isPartner ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-300 border-rose-500/20'
                        }`}>
                          {item.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">{userEmail}</p>
                    </div>
                  </div>

                  {canManage && !isOwner && (
                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => handleOpenInvite(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px] font-medium flex items-center space-x-1"
                        title="Edit Permissions"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span className="hidden sm:inline">Permissions</span>
                      </button>
                      <button
                        onClick={() => handleRevoke(item.membershipId, userName)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                        title="Revoke Access"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Permission Chips */}
                {!isOwner && item.permissions && (
                  <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-900 text-[10px]">
                    <PermChip label="Events" active={item.permissions.canManageEvents} />
                    <PermChip label="Guests" active={item.permissions.canManageGuests} />
                    <PermChip label="Invitations" active={item.permissions.canManageInvitations} />
                    <PermChip label="Tasks" active={item.permissions.canManageTasks} />
                    <PermChip label="Vendors" active={item.permissions.canManageVendors} />
                    <PermChip label="Budget" active={item.permissions.canManageBudget} isSensitive />
                    <PermChip label="Gallery" active={item.permissions.canManageGallery} />
                    <PermChip label="Website" active={item.permissions.canManageWebsite} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Internal Modal Fallback (Only used if parent onOpenInviteModal is not provided) */}
      {!onOpenInviteModal && (
        <InviteOrganizerModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          weddingId={weddingId}
          existingMembership={selectedMembership}
          onRefresh={fetchOrganizers}
        />
      )}
    </div>
  );
}

function PermChip({ label, active, isSensitive = false }) {
  return (
    <span className={`px-2 py-0.5 rounded-md font-medium flex items-center space-x-1 border ${
      active
        ? 'bg-slate-900 text-emerald-400 border-emerald-500/30'
        : 'bg-slate-950 text-slate-500 border-slate-800'
    }`}>
      {isSensitive && !active && <Lock className="w-2.5 h-2.5 text-amber-400" />}
      <span>{label}: {active ? '✓' : 'Restricted'}</span>
    </span>
  );
}
