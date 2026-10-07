import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, Sparkles, ArrowRight, CheckCircle, ShieldCheck, Heart, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('owner'); // 'owner' | 'partner' | 'organizer'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: 'Empty', score: 0, color: 'bg-slate-700' };
    if (pass.length < 6) return { label: 'Weak', score: 1, color: 'bg-rose-500' };
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) return { label: 'Strong', score: 3, color: 'bg-emerald-400' };
    return { label: 'Medium', score: 2, color: 'bg-amber-400' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await signup(formData.fullName, formData.email, formData.password, formData.phone);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Onboarding 3-Step Roadmap & Preview */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Create Your Workspace in Under 2 Minutes</span>
            </div>

            <h1 className="font-serif text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Start Planning Your <br />
              <span className="bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                Dream Wedding Today.
              </span>
            </h1>

            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Everything you need to organize your wedding lifecycle — multi-event timelines, accountless RSVPs, digital invitations, vendor budgets, and private photo galleries.
            </p>

            {/* 3-Step Roadmap Cards */}
            <div className="space-y-3 pt-2">
              <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs">1</div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs">Create Account & Role</h4>
                  <p className="text-[10px] text-slate-400">Register as Wedding Owner, Partner, or Organizer.</p>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs">2</div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs">Set Up Wedding Workspace</h4>
                  <p className="text-[10px] text-slate-400">Add partner names, wedding date, and ceremony venues.</p>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 flex items-center space-x-4">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">3</div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-xs">Invite & Collaborate</h4>
                  <p className="text-[10px] text-slate-400">Grant custom permissions to partner and trusted planners.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Glassmorphic Sign Up Form */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-rose-950/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500"></div>

              {/* Form Navigation Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 to-amber-200 bg-clip-text text-transparent">
                    Create Workspace
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Register your free MakeMyMarriage account
                  </p>
                </div>
                <Link to="/signin" className="text-xs font-semibold text-rose-400 hover:underline">
                  Already registered?
                </Link>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Role Selection Tabs */}
              <div className="mb-6 space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Select Account Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition text-center ${
                      role === 'owner' ? 'bg-rose-500/20 border-rose-500 text-rose-200' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    💍 Bride / Groom
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('partner')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition text-center ${
                      role === 'partner' ? 'bg-rose-500/20 border-rose-500 text-rose-200' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🤝 Partner
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('organizer')}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition text-center ${
                      role === 'organizer' ? 'bg-rose-500/20 border-rose-500 text-rose-200' : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    📋 Organizer
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="Priya Patel"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="priya@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-slate-300">Password</label>
                    <span className="text-[10px] text-slate-400">Strength: <strong className="text-slate-200">{strength.label}</strong></span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  {/* Strength Bar */}
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${(strength.score / 3) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mobile Phone (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-sm shadow-xl shadow-rose-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Creating Workspace...' : 'Create Wedding Workspace'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
                Guests do not need an account — RSVP is managed via unique invitation links.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
