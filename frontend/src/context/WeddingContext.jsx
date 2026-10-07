import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import {
  createWeddingApi,
  getMyWeddingsApi,
  invitePartnerApi,
  acceptPartnerInviteApi,
} from '../services/weddingService';

const WeddingContext = createContext(null);

export function WeddingProvider({ children }) {
  const { user, accessToken } = useAuth();
  const [myWeddings, setMyWeddings] = useState([]);
  const [activeWedding, setActiveWedding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user weddings when authenticated
  useEffect(() => {
    async function fetchWeddings() {
      if (!accessToken || !user) {
        setMyWeddings([]);
        setActiveWedding(null);
        return;
      }
      setLoading(true);
      try {
        const res = await getMyWeddingsApi(accessToken);
        const list = res.data || [];
        setMyWeddings(list);
        if (list.length > 0) {
          // Default active wedding to first
          setActiveWedding(list[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeddings();
  }, [accessToken, user]);

  const createWedding = async (weddingData) => {
    setError(null);
    try {
      const res = await createWeddingApi(accessToken, weddingData);
      const newEntry = {
        wedding: res.data.wedding,
        role: res.data.membership.role,
        permissions: res.data.membership.permissions,
        joinedAt: res.data.membership.joinedAt,
      };
      setMyWeddings((prev) => [newEntry, ...prev]);
      setActiveWedding(newEntry);
      return newEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const invitePartner = async (weddingId) => {
    try {
      const res = await invitePartnerApi(accessToken, weddingId);
      return res.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const acceptPartnerInvite = async (inviteCode) => {
    try {
      const res = await acceptPartnerInviteApi(accessToken, inviteCode);
      const newEntry = {
        wedding: res.data.wedding,
        role: res.data.membership.role,
        permissions: res.data.membership.permissions,
        joinedAt: res.data.membership.joinedAt,
      };
      setMyWeddings((prev) => [newEntry, ...prev]);
      setActiveWedding(newEntry);
      return newEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const switchWedding = (weddingId) => {
    const found = myWeddings.find((item) => String(item.wedding?._id) === String(weddingId));
    if (found) {
      setActiveWedding(found);
    }
  };

  return (
    <WeddingContext.Provider
      value={{
        myWeddings,
        activeWedding,
        loading,
        error,
        createWedding,
        invitePartner,
        acceptPartnerInvite,
        switchWedding,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding() {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
}
