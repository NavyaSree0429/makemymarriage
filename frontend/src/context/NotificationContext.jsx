import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useWedding } from './WeddingContext';
import { getSocket, joinWeddingRoom, leaveWeddingRoom } from '../services/socketService';
import {
  getNotificationsApi,
  markNotificationsReadApi,
  deleteNotificationApi,
  clearAllNotificationsApi,
  sendTestNotificationApi,
} from '../services/notificationService';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { accessToken } = useAuth();
  const { activeWedding } = useWedding();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [liveToast, setLiveToast] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const weddingId = activeWedding?.wedding?._id;

  // Play subtle royal synthesizer chime using Web Audio API
  const playChimeSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {
      // Audio autoplay policy fallback
    }
  }, [soundEnabled]);

  // Fetch notifications from REST API
  const fetchNotifications = useCallback(async () => {
    if (!accessToken || !weddingId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await getNotificationsApi(accessToken, weddingId);
      const data = res.data || {};
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.warn('Failed to fetch notifications:', err.message);
    } finally {
      setLoading(false);
    }
  }, [accessToken, weddingId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Socket.IO Room Subscription & Real-Time Event Listeners
  useEffect(() => {
    if (!weddingId) return;

    const socket = getSocket();

    const handleConnect = () => {
      setSocketConnected(true);
      joinWeddingRoom(weddingId);
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleNotificationReceived = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((c) => c + 1);
      playChimeSound();
    };

    const handleLiveToast = (toast) => {
      setLiveToast(toast);
      playChimeSound();
    };

    if (socket.connected) {
      setSocketConnected(true);
      joinWeddingRoom(weddingId);
    } else {
      socket.connect();
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('notification_received', handleNotificationReceived);
    socket.on('live_toast', handleLiveToast);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('notification_received', handleNotificationReceived);
      socket.off('live_toast', handleLiveToast);
      leaveWeddingRoom(weddingId);
    };
  }, [weddingId, playChimeSound]);

  const markAllAsRead = async () => {
    if (!accessToken || !weddingId) return;
    try {
      await markNotificationsReadApi(accessToken, weddingId);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (notificationId) => {
    if (!accessToken || !weddingId) return;
    try {
      await markNotificationsReadApi(accessToken, weddingId, notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!accessToken || !weddingId) return;
    try {
      await deleteNotificationApi(accessToken, weddingId, notificationId);
      setNotifications((prev) => {
        const item = prev.find((n) => n._id === notificationId);
        if (item && !item.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n._id !== notificationId);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const clearAll = async () => {
    if (!accessToken || !weddingId) return;
    try {
      await clearAllNotificationsApi(accessToken, weddingId);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const sendTestNotification = async (customData = {}) => {
    if (!accessToken || !weddingId) return;
    try {
      await sendTestNotificationApi(accessToken, weddingId, customData);
    } catch (err) {
      console.error(err);
    }
  };

  const dismissToast = () => {
    setLiveToast(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        socketConnected,
        isNotificationOpen,
        setIsNotificationOpen,
        liveToast,
        dismissToast,
        markAllAsRead,
        markAsRead,
        deleteNotification,
        clearAll,
        sendTestNotification,
        soundEnabled,
        setSoundEnabled,
        refetch: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return ctx;
}
