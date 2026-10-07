import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Heart, AlertCircle, KeyRound } from 'lucide-react';
import { forgotPasswordApi } from '../services/authService';

export default function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [otpNotice, setOtpNotice] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setForgotMsg('');
    setOtpNotice('');
    try {
      const res = await forgotPasswordApi(forgotEmail);
      setForgotMsg('If an account exists, a password reset OTP has been generated.');
      if (res.data?.devOtp) {
        setOtpNotice(`Dev Password Reset OTP: ${res.data.devOtp}`);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-12 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Value Showcase & Floating Badges */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Welcome Back to MakeMyMarriage</span>
            </div>

            <h1 className="font-serif text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Access Your <br />
              <span className="bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                Shared Wedding Workspace
              </span>
            </h1>

            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Log in as a Wedding Owner, Partner, or Organizer to manage multi-event timelines, guest RSVPs, task assignments, vendor budgets, and private photo galleries.
            </p>

            {/* Floating Glass Showcase Badges */}
            <div className="space-y-4 pt-4">
              <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-300 flex items-center justify-center font-bold">
                    💍
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-xs">Rahul & Priya's Wedding</h4>
                    <p className="text-[10px] text-slate-400">120 Days Countdown • 5 Events Active</p>
                  </div>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  342 Confirmed RSVPs
                </span>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800 flex items-center space-x-3 text-xs text-slate-300">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>256-Bit Encrypted Data • Granular Permission Controls Active</span>
              </div>
            </div>
          </div>

          {/* Right Side: Glassmorphic Sign In Form */}
          <div className="lg:col-span-6 max-w-md mx-auto w-full">
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-rose-950/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500"></div>

              {/* Form Navigation Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 to-amber-200 bg-clip-text text-transparent">
                    {showForgot ? 'Reset Password' : 'Sign In'}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {showForgot ? 'Enter your email to receive a password reset OTP' : 'Enter your credentials to access your workspace'}
                  </p>
                </div>
                <Link to="/signup" className="text-xs font-semibold text-rose-400 hover:underline">
                  Need an account?
                </Link>
              </div>

              {/* Error / Notice Alerts */}
              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {forgotMsg && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  {forgotMsg}
                </div>
              )}
              {otpNotice && (
                <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  {otpNotice}
                </div>
              )}

              {/* Form Body */}
              {!showForgot ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="couple@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-slate-300">Password</label>
                      <button
                        type="button"
                        onClick={() => { setShowForgot(true); setErrorMsg(''); }}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-sm shadow-xl shadow-rose-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Registered Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        placeholder="couple@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-sm shadow-xl shadow-rose-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{loading ? 'Sending OTP...' : 'Send Password Reset OTP'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForgot(false)}
                    className="w-full text-xs text-slate-400 hover:text-white text-center block pt-2"
                  >
                    Back to Sign In
                  </button>
                </form>
              )}

              {/* Guest Reminder Note */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
                Are you a Guest? Guests do not need an account. Click your unique invitation link to RSVP.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
