import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWedding } from '../context/WeddingContext';
import { Heart, Sparkles, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { myWeddings, activeWedding, switchWedding } = useWedding();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-400 flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform duration-300">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-serif text-xl font-bold bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                MakeMyMarriage
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">Luxury Wedding Workspace</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wide text-slate-300">
          <Link to="/" className="hover:text-rose-300 transition">Home</Link>
          <a href="#features" className="hover:text-rose-300 transition">Multi-Events</a>
          <a href="#rsvp" className="hover:text-rose-300 transition">Digital RSVPs</a>
          <a href="#organizers" className="hover:text-rose-300 transition">Organizer Hub</a>
          <a href="#website" className="hover:text-rose-300 transition">Wedding Websites</a>
        </nav>

        {/* Action Buttons / User Profile / Workspace Dropdown */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Active Workspace Selector in Navbar if weddings exist */}
              {myWeddings.length > 0 && (
                <div className="hidden lg:flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">Workspace:</span>
                  <select
                    value={activeWedding?.wedding?._id || ''}
                    onChange={(e) => switchWedding(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-xs font-semibold text-rose-300 focus:outline-none focus:border-rose-500"
                  >
                    {myWeddings.map((item) => (
                      <option key={item.wedding?._id} value={item.wedding?._id}>
                        {item.wedding?.partnerNames?.partner1 || 'Partner 1'} & {item.wedding?.partnerNames?.partner2 || 'Partner 2'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <Link
                to="/dashboard"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition flex items-center space-x-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <div className="relative group">
                <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 cursor-pointer hover:border-slate-700 transition">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs">
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden sm:inline">{user.fullName?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs">
                    <p className="font-semibold text-slate-200">{user.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full mt-1 px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/signin"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 transition"
              >
                Create Workspace
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
