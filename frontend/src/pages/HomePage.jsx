import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CountdownTimer from '../components/CountdownTimer';
import {
  Sparkles, Calendar, Users, Shield, CheckCircle, Clock, Heart, ArrowRight,
  Gift, MapPin, Video, Check, Share2, Layers, Award, Globe, MessageSquare
} from 'lucide-react';

export default function HomePage() {
  const [roleTab, setRoleTab] = useState('couples'); // 'couples' | 'organizers' | 'guests'

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-4 lg:px-8 overflow-hidden">
        {/* Warm Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Centralized Multi-Event Wedding Workspace</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none">
              Your Entire Wedding Journey, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                Unified in One Shared Space.
              </span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              From Haldi to Reception — effortlessly coordinate multi-event schedules, accountless guest RSVPs, digital invitations, vendor budgets, and private photo galleries with your partner and trusted planners.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-sm shadow-xl shadow-rose-500/25 transition-all flex items-center justify-center space-x-2 group"
              >
                <span>Create Your Wedding Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-semibold text-sm transition flex items-center justify-center space-x-2"
              >
                <span>Explore Live Demo</span>
              </Link>
            </div>

            {/* Quick Metrics Badge */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center lg:justify-start space-x-8 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Accountless Guest RSVP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Granular Permissions</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-rose-400" />
                <span>Indian Languages Ready</span>
              </div>
            </div>
          </div>

          {/* Hero Right Showcase Mockup Card */}
          <div className="lg:col-span-5 z-10">
            <div className="relative bg-slate-900/70 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-rose-950/40 space-y-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-rose-400 to-transparent"></div>

              {/* Couple Info */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white font-serif font-bold text-lg shadow-md shadow-rose-500/20">
                    R&P
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-100">Rahul & Priya</h3>
                    <p className="text-xs text-slate-400">December 15, 2026 • Royal Palace, Jaipur</p>
                  </div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2.5 py-1 rounded-full font-semibold">
                  Active Wedding
                </span>
              </div>

              {/* Real-Time Ticking Countdown Component */}
              <CountdownTimer targetDate="2026-12-15" title="COUNTDOWN TO THE BIG DAY" />

              {/* Multi-Event Pills */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Scheduled Ceremonies</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-3 py-1 rounded-full">Haldi & Mehendi</span>
                  <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-full">Sangeet Night</span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full">Traditional Pheras</span>
                  <span className="bg-slate-800 border border-slate-700 text-slate-300 px-3 py-1 rounded-full">Reception</span>
                </div>
              </div>

              {/* RSVP Progress */}
              <div className="bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">RSVP Summary</span>
                  <p className="font-semibold text-slate-200">342 / 450 Guests Confirmed (82%)</p>
                </div>
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-rose-500 to-emerald-400 w-[82%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Interactive Switcher */}
      <section className="py-16 px-4 lg:px-8 bg-slate-950/40 border-y border-slate-800">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold">Tailored Experience for Everyone</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Select your role to explore how MakeMyMarriage simplifies planning for couples, organizers, and guests.
            </p>
          </div>

          <div className="inline-flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setRoleTab('couples')}
              className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition ${
                roleTab === 'couples' ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              💍 For Couples
            </button>
            <button
              onClick={() => setRoleTab('organizers')}
              className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition ${
                roleTab === 'organizers' ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              📋 For Organizers
            </button>
            <button
              onClick={() => setRoleTab('guests')}
              className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition ${
                roleTab === 'guests' ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              🎉 For Guests
            </button>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 text-left max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleTab === 'couples' && (
              <>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">Shared Workspace</h4>
                  <p className="text-xs text-slate-400">Manage everything together with your partner in real-time sync.</p>
                </div>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">Budget Tracker</h4>
                  <p className="text-xs text-slate-400">Track planned vs. actual vendor expenses across all ceremonies.</p>
                </div>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <Share2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">Wedding Website</h4>
                  <p className="text-xs text-slate-400">Share your personalized website link (/w/rahul-priya) with guests.</p>
                </div>
              </>
            )}
            {roleTab === 'organizers' && (
              <>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <Shield className="w-5 h-5 text-rose-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">Granular Permissions</h4>
                  <p className="text-xs text-slate-400">Control view/edit access per module for planners and family members.</p>
                </div>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">Multi-Wedding Switcher</h4>
                  <p className="text-xs text-slate-400">Professional planners can manage multiple weddings from one account.</p>
                </div>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">Task Assignments</h4>
                  <p className="text-xs text-slate-400">Assign tasks to team members with priorities, due dates, and alerts.</p>
                </div>
              </>
            )}
            {roleTab === 'guests' && (
              <>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <CheckCircle className="w-5 h-5 text-rose-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">No Account Needed</h4>
                  <p className="text-xs text-slate-400">RSVP instantly using a secure 1-click tokenized invitation link.</p>
                </div>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">Venue Navigation</h4>
                  <p className="text-xs text-slate-400">Access Google Maps directions, dress codes, and ceremony timings.</p>
                </div>
                <div className="bg-slate-950/40 p-5 rounded-2xl border border-slate-800 space-y-2">
                  <Video className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-semibold text-slate-200 text-sm">Live Streaming</h4>
                  <p className="text-xs text-slate-400">Watch ceremonies remotely via embedded YouTube Live stream.</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white">
              <Heart className="w-4 h-4 fill-white" />
            </div>
            <span className="font-serif font-bold text-slate-300 text-sm">MakeMyMarriage</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Support</span>
            <span className="text-emerald-400">Multilingual Ready (6 Languages)</span>
          </div>
          <p>© 2026 MakeMyMarriage. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
