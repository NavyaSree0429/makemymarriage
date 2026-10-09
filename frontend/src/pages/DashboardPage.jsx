import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import CountdownTimer from '../components/CountdownTimer';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../context/WeddingContext';
import UserProfileCard from '../features/auth/UserProfileCard';
import CreateWeddingModal from '../features/wedding/CreateWeddingModal';
import InvitePartnerModal from '../features/wedding/InvitePartnerModal';
import AcceptPartnerInviteModal from '../features/wedding/AcceptPartnerInviteModal';
import OrganizersListWidget from '../features/organizers/OrganizersListWidget';
import InviteOrganizerModal from '../features/organizers/InviteOrganizerModal';
import EventTimelineWidget from '../features/events/EventTimelineWidget';
import EventManagementModal from '../features/events/EventManagementModal';
import GuestListWidget from '../features/guests/GuestListWidget';
import GuestManagementModal from '../features/guests/GuestManagementModal';
import TaskPlannerWidget from '../features/tasks/TaskPlannerWidget';
import TaskManagementModal from '../features/tasks/TaskManagementModal';
import { createTaskApi, getTasksApi, updateTaskApi, deleteTaskApi } from '../services/taskService';
import VendorBudgetWidget from '../features/vendors/VendorBudgetWidget';
import VendorManagementModal from '../features/vendors/VendorManagementModal';
import { createVendorApi, getVendorsApi, updateVendorApi, deleteVendorApi } from '../services/vendorService';
import PhotoGalleryWidget from '../features/photos/PhotoGalleryWidget';
import PhotoUploadModal from '../features/photos/PhotoUploadModal';
import LightboxViewerModal from '../features/photos/LightboxViewerModal';
import { createPhotoApi, getPhotosApi, deletePhotoApi, toggleLikePhotoApi } from '../services/photoService';

import {
  Heart, Calendar, Users, Shield, CheckCircle, Gift, MapPin, Video,
  Plus, Search, Bell, Copy, Share2, Layers, AlertCircle, ArrowUpRight, Check, KeyRound, UserPlus, DollarSign, Camera
} from 'lucide-react';

export default function DashboardPage() {
  const { user, accessToken } = useAuth();
  const { activeWedding, myWeddings, switchWedding } = useWedding();

  const token = accessToken || localStorage.getItem('access_token');

  const [copiedLink, setCopiedLink] = useState(false);

  // Modal Visibility States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  // MOD-03 Organizer Modal Top-Level States
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [selectedOrganizerMembership, setSelectedOrganizerMembership] = useState(null);
  const [organizerRefreshKey, setOrganizerRefreshKey] = useState(0);

  // MOD-04 Event Modal Top-Level States
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventObj, setSelectedEventObj] = useState(null);
  const [eventRefreshKey, setEventRefreshKey] = useState(0);

  // MOD-05 Guest Modal Top-Level States
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [selectedGuestObj, setSelectedGuestObj] = useState(null);
  const [guestRefreshKey, setGuestRefreshKey] = useState(0);

  // MOD-07 Task Top-Level States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTaskObj, setSelectedTaskObj] = useState(null);
  const [tasksList, setTasksList] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);

  // MOD-08 Vendor & Budget Top-Level States
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [selectedVendorObj, setSelectedVendorObj] = useState(null);
  const [vendorsList, setVendorsList] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);

  // MOD-09 Photo Gallery Top-Level States
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photosList, setPhotosList] = useState([]);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  React.useEffect(() => {
    if (activeWedding?.wedding?._id) {
      fetchTasks();
      fetchVendors();
      fetchPhotos();
    }
  }, [activeWedding?.wedding?._id]);

  const fetchTasks = async () => {
    try {
      setTaskLoading(true);
      const res = await getTasksApi(token, activeWedding.wedding._id);
      setTasksList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setTaskLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      setVendorLoading(true);
      const res = await getVendorsApi(token, activeWedding.wedding._id);
      setVendorsList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setVendorLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      setPhotoLoading(true);
      const res = await getPhotosApi(token, activeWedding.wedding._id);
      setPhotosList(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleOpenAddTaskModal = () => {
    setSelectedTaskObj(null);
    setShowTaskModal(true);
  };

  const handleOpenEditTaskModal = (task) => {
    setSelectedTaskObj(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTaskObj) {
        await updateTaskApi(token, activeWedding.wedding._id, selectedTaskObj._id, taskData);
      } else {
        await createTaskApi(token, activeWedding.wedding._id, taskData);
      }
      setShowTaskModal(false);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to save task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTaskApi(token, activeWedding.wedding._id, taskId);
      fetchTasks();
    } catch (err) {
      alert(err.message || 'Failed to delete task');
    }
  };

  const handleToggleTaskStatus = async (task) => {
    try {
      const nextStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      await updateTaskApi(token, activeWedding.wedding._id, task._id, { status: nextStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  // Vendor Handlers
  const handleOpenAddVendorModal = () => {
    setSelectedVendorObj(null);
    setShowVendorModal(true);
  };

  const handleOpenEditVendorModal = (vendor) => {
    setSelectedVendorObj(vendor);
    setShowVendorModal(true);
  };

  const handleSaveVendor = async (vendorData) => {
    try {
      if (selectedVendorObj) {
        await updateVendorApi(token, activeWedding.wedding._id, selectedVendorObj._id, vendorData);
      } else {
        await createVendorApi(token, activeWedding.wedding._id, vendorData);
      }
      setShowVendorModal(false);
      fetchVendors();
    } catch (err) {
      alert(err.message || 'Failed to save vendor record');
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm('Are you sure you want to delete this vendor record?')) return;
    try {
      await deleteVendorApi(token, activeWedding.wedding._id, vendorId);
      fetchVendors();
    } catch (err) {
      alert(err.message || 'Failed to delete vendor');
    }
  };

  const handleRecordPayment = (vendor) => {
    setSelectedVendorObj(vendor);
    setShowVendorModal(true);
  };

  // Photo Handlers
  const handleOpenPhotoUpload = () => {
    setShowPhotoModal(true);
  };

  const handleSavePhoto = async (photoData) => {
    try {
      await createPhotoApi(token, activeWedding.wedding._id, photoData);
      setShowPhotoModal(false);
      fetchPhotos();
    } catch (err) {
      alert(err.message || 'Failed to upload photo memory');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo memory?')) return;
    try {
      await deletePhotoApi(token, activeWedding.wedding._id, photoId);
      fetchPhotos();
    } catch (err) {
      alert(err.message || 'Failed to delete photo');
    }
  };

  const handleToggleLikePhoto = async (photoId) => {
    try {
      const res = await toggleLikePhotoApi(token, activeWedding.wedding._id, photoId);
      if (res.data) {
        setPhotosList((prev) =>
          prev.map((p) => (p._id === photoId ? res.data : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleOpenOrganizerModal = (membership = null) => {
    setSelectedOrganizerMembership(membership);
    setShowOrganizerModal(true);
  };

  const handleOpenCreateEventModal = () => {
    setSelectedEventObj(null);
    setShowEventModal(true);
  };

  const handleOpenEditEventModal = (eventObj) => {
    setSelectedEventObj(eventObj);
    setShowEventModal(true);
  };

  const handleOpenAddGuestModal = () => {
    setSelectedGuestObj(null);
    setShowGuestModal(true);
  };

  const handleOpenEditGuestModal = (guest) => {
    setSelectedGuestObj(guest);
    setShowGuestModal(true);
  };

  const handleCopyLink = () => {
    if (activeWedding?.wedding?.slug) {
      navigator.clipboard.writeText(`http://localhost:5173/w/${activeWedding.wedding.slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const weddingObj = activeWedding?.wedding;
  const role = activeWedding?.role || 'OWNER';
  const canManage = role === 'OWNER' || role === 'PARTNER';

  // Compute dynamic KPI metrics
  const totalVendorAgreed = vendorsList.reduce((acc, v) => acc + (Number(v.actualCost) || 0), 0);
  const totalVendorPaid = vendorsList.reduce((acc, v) => acc + (Number(v.paidAmount) || 0), 0);
  const totalVendorRemaining = Math.max(0, totalVendorAgreed - totalVendorPaid);
  const budgetPaidPct = totalVendorAgreed > 0 ? Math.min(100, Math.round((totalVendorPaid / totalVendorAgreed) * 100)) : 0;

  const completedTasksCount = tasksList.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* User Account Details Header */}
        <UserProfileCard />

        {/* Global MOD-02 Workspace Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center justify-center font-bold text-sm">
              💍
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Active Workspace Selector</span>
              {myWeddings.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={activeWedding?.wedding?._id || ''}
                    onChange={(e) => switchWedding(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-300 focus:outline-none focus:border-rose-500"
                  >
                    {myWeddings.map((item) => (
                      <option key={item.wedding?._id} value={item.wedding?._id}>
                        {item.wedding?.partnerNames?.partner1 || 'Partner 1'} & {item.wedding?.partnerNames?.partner2 || 'Partner 2'}'s Wedding ({item.role})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <p className="text-xs font-semibold text-amber-400">No active wedding workspace yet</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Wedding</span>
            </button>

            {weddingObj && (
              <button
                onClick={handleOpenCreateEventModal}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>+ Add Ceremony</span>
              </button>
            )}

            {weddingObj && (
              <button
                onClick={handleOpenAddGuestModal}
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>+ Add Guest</span>
              </button>
            )}

            {weddingObj && (
              <button
                onClick={handleOpenAddVendorModal}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Gift className="w-4 h-4 text-amber-400" />
                <span>+ Add Vendor</span>
              </button>
            )}

            {weddingObj && (
              <button
                onClick={handleOpenPhotoUpload}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <Camera className="w-4 h-4 text-rose-400" />
                <span>+ Upload Photo</span>
              </button>
            )}

            {weddingObj && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Invite Partner</span>
              </button>
            )}

            <button
              onClick={() => setShowAcceptModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Join with Code</span>
            </button>
          </div>
        </div>

        {/* Wedding Overview Top Banner */}
        {!weddingObj ? (
          <div className="bg-slate-900/60 backdrop-blur-2xl border border-dashed border-rose-500/30 rounded-3xl p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-center mx-auto text-2xl font-bold">
              💍
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="font-serif text-2xl font-bold text-slate-100">No Wedding Workspace Created Yet</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create a new wedding workspace to start managing multi-event timelines, guest RSVPs, task assignments, vendor budgets, and photo galleries.
              </p>
            </div>
            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/25 transition flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Wedding</span>
              </button>
              <button
                onClick={() => setShowAcceptModal(true)}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition flex items-center space-x-2"
              >
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Enter Partner Code</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-900/90 to-rose-950/40 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs font-semibold mb-1">
                  <SparklesIcon />
                  <span>Active Workspace • {role} Access</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100">
                  {weddingObj.partnerNames?.partner1 || 'Partner 1'} & {weddingObj.partnerNames?.partner2 || 'Partner 2'}
                </h1>
                <p className="text-xs text-slate-400 flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>
                    Main Wedding: {weddingObj.weddingDate ? new Date(weddingObj.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'} • {weddingObj.primaryLocation?.venueName || 'Venue TBD'}, {weddingObj.primaryLocation?.city || 'City TBD'}
                  </span>
                </p>
              </div>

              {/* Quick Action Shortcuts */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                  <span>{copiedLink ? 'Website Link Copied!' : 'Copy Website Link'}</span>
                </button>

                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-semibold flex items-center space-x-2 transition shadow-md"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>Invite Partner</span>
                </button>
              </div>
            </div>

            {/* Real-Time Ticking Countdown Clock Banner */}
            <CountdownTimer targetDate={weddingObj.weddingDate} />
          </div>
        )}

        {/* 4 KPI Summary Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Guest RSVPs</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-slate-100">342 / 450</h3>
              <p className="text-[11px] text-emerald-400 font-medium">82% Confirmed • 18 Pending</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 w-[82%]"></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Scheduled Events</span>
              <Calendar className="w-4 h-4 text-rose-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-slate-100">Multi-Functions</h3>
              <p className="text-[11px] text-rose-300">Haldi, Sangeet, Pheras & Reception</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 w-[100%]"></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Task Progress</span>
              <CheckCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-slate-100">{completedTasksCount} / {tasksList.length} Done</h3>
              <p className="text-[11px] text-amber-400 font-medium">{tasksList.length - completedTasksCount} Pending Tasks</p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${tasksList.length > 0 ? (completedTasksCount / tasksList.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Budget Tracker</span>
              <Gift className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-slate-100">
                ₹{(totalVendorPaid / 100000).toFixed(1)}L / ₹{(totalVendorAgreed / 100000).toFixed(1)}L
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">
                ₹{(totalVendorRemaining / 100000).toFixed(1)} Lakhs Due ({vendorsList.length} Vendors)
              </p>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${budgetPaidPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* MOD-04 Master Ceremonies Itinerary Timeline Section */}
        {weddingObj && (
          <div id="events-section">
            <EventTimelineWidget
              weddingId={weddingObj._id}
              canManage={canManage}
              onOpenCreateModal={handleOpenCreateEventModal}
              onOpenEditModal={handleOpenEditEventModal}
              refreshTrigger={eventRefreshKey}
            />
          </div>
        )}

        {/* MOD-05 Master Guest List Roster & E-Vites Section */}
        {weddingObj && (
          <div id="guests-section">
            <GuestListWidget
              weddingId={weddingObj._id}
              weddingObj={weddingObj}
              canManage={canManage}
              onOpenAddGuestModal={handleOpenAddGuestModal}
              onOpenEditGuestModal={handleOpenEditGuestModal}
              refreshTrigger={guestRefreshKey}
            />
          </div>
        )}

        {/* MOD-07 Task Planner & Master Checklist Section */}
        {weddingObj && (
          <div id="tasks-section">
            <TaskPlannerWidget
              tasks={tasksList}
              loading={taskLoading}
              onAddTask={handleOpenAddTaskModal}
              onEditTask={handleOpenEditTaskModal}
              onDeleteTask={handleDeleteTask}
              onToggleStatus={handleToggleTaskStatus}
            />
          </div>
        )}

        {/* MOD-08 Vendor Directory & Budget Tracking Section */}
        {weddingObj && (
          <div id="budget-section">
            <VendorBudgetWidget
              vendors={vendorsList}
              loading={vendorLoading}
              onAddVendor={handleOpenAddVendorModal}
              onEditVendor={handleOpenEditVendorModal}
              onDeleteVendor={handleDeleteVendor}
              onRecordPayment={handleRecordPayment}
            />
          </div>
        )}

        {/* MOD-09 Private Photo Gallery & Shared Memories Section */}
        {weddingObj && (
          <div id="photos-section">
            <PhotoGalleryWidget
              photos={photosList}
              loading={photoLoading}
              onUploadPhoto={handleOpenPhotoUpload}
              onOpenLightbox={handleOpenLightbox}
              onToggleLike={handleToggleLikePhoto}
              onDeletePhoto={handleDeletePhoto}
            />
          </div>
        )}

        {/* Organizers List Widget Section */}
        <div className="grid grid-cols-1 gap-8">
          <OrganizersListWidget
            weddingId={weddingObj?._id}
            canManage={canManage}
            onOpenInviteModal={handleOpenOrganizerModal}
            refreshTrigger={organizerRefreshKey}
          />
        </div>
      </main>

      {/* Modals */}
      <CreateWeddingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <InvitePartnerModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        weddingId={weddingObj?._id}
      />

      <AcceptPartnerInviteModal
        isOpen={showAcceptModal}
        onClose={() => setShowAcceptModal(false)}
      />

      <InviteOrganizerModal
        isOpen={showOrganizerModal}
        onClose={() => setShowOrganizerModal(false)}
        weddingId={weddingObj?._id}
        existingMembership={selectedOrganizerMembership}
        onRefresh={() => setOrganizerRefreshKey((k) => k + 1)}
      />

      <EventManagementModal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        weddingId={weddingObj?._id}
        existingEvent={selectedEventObj}
        onRefresh={() => setEventRefreshKey((k) => k + 1)}
      />

      <GuestManagementModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        weddingId={weddingObj?._id}
        existingGuest={selectedGuestObj}
        onRefresh={() => setGuestRefreshKey((k) => k + 1)}
      />

      <TaskManagementModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        task={selectedTaskObj}
        loading={taskLoading}
      />

      <VendorManagementModal
        isOpen={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        onSave={handleSaveVendor}
        vendor={selectedVendorObj}
        loading={vendorLoading}
      />

      <PhotoUploadModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onSave={handleSavePhoto}
        loading={photoLoading}
      />

      <LightboxViewerModal
        isOpen={lightboxOpen}
        photos={photosList}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : photosList.length - 1))}
        onNext={() => setLightboxIndex((prev) => (prev < photosList.length - 1 ? prev + 1 : 0))}
        onToggleLike={handleToggleLikePhoto}
      />
    </div>
  );
}

function SparklesIcon() {
  return <span className="text-amber-300 font-bold text-xs">✨</span>;
}

