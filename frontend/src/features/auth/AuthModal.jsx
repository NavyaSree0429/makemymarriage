import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { forgotPasswordApi } from '../../services/authService';
import { Mail, Lock, User, Phone, Sparkles, KeyRound, AlertCircle, ArrowRight, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, signup } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register' | 'forgot'
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [otpNotice, setOtpNotice] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (tab === 'login') {
        await login(formData.email, formData.password);
        onClose();
      } else if (tab === 'register') {
        await signup(formData.fullName, formData.email, formData.password, formData.phone);
        onClose();
      } else if (tab === 'forgot') {
        const res = await forgotPasswordApi(formData.email);
        setSuccessMsg('If an account exists, password reset OTP has been sent.');
        if (res.data?.devOtp) {
          setOtpNotice(`Dev OTP Generated: ${res.data.devOtp}`);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-rose-950/30 overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MakeMyMarriage Account</span>
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-rose-300 to-amber-200 bg-clip-text text-transparent">
            {tab === 'login' ? 'Welcome Back' : tab === 'register' ? 'Create Account' : 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {tab === 'login'
              ? 'Log in as Couple Owner, Partner, or Organizer'
              : tab === 'register'
              ? 'Join to plan and manage your wedding workspace'
              : 'Enter your account email to receive a reset OTP'}
          </p>
        </div>

        {/* Navigation Tabs */}
        {tab !== 'forgot' && (
          <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-800 mb-6">
            <button
              onClick={() => { setTab('login'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                tab === 'login' ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMsg(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                tab === 'register' ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            {successMsg}
          </div>
        )}
        {otpNotice && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            {otpNotice}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Rahul Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                name="email"
                required
                placeholder="couple@makemymarriage.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setErrorMsg(''); }}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
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
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-sm shadow-lg shadow-rose-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : tab === 'login' ? 'Sign In' : tab === 'register' ? 'Create Account' : 'Send Reset OTP'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {tab === 'forgot' && (
          <button
            onClick={() => setTab('login')}
            className="w-full mt-4 text-xs text-center text-slate-400 hover:text-white block"
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
}
