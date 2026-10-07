import React, { useState, useEffect } from 'react';

function calculateTimeLeft(targetDate) {
  if (!targetDate) {
    // Default fallback to 120 days from now if target date is not set
    const fallbackDate = new Date(Date.now() + 120 * 24 * 60 * 60 * 1000);
    return calculateTimeLeft(fallbackDate);
  }

  const difference = +new Date(targetDate) - +new Date();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isCompleted: false,
  };
}

export default function CountdownTimer({ targetDate, title = "COUNTDOWN TO MAIN VOWS" }) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n) => (n < 10 ? `0${n}` : n);

  return (
    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
        <span>{title}</span>
      </span>

      {timeLeft.isCompleted ? (
        <div className="text-rose-300 font-serif font-bold text-lg">
          🎉 The Special Day Has Arrived!
        </div>
      ) : (
        <div className="flex items-center space-x-3 text-center">
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 min-w-[54px]">
            <span className="font-serif font-bold text-xl text-rose-300">{pad(timeLeft.days)}</span>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase">Days</span>
          </div>
          <span className="text-slate-600 font-bold text-lg">:</span>
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 min-w-[54px]">
            <span className="font-serif font-bold text-xl text-rose-300">{pad(timeLeft.hours)}</span>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase">Hours</span>
          </div>
          <span className="text-slate-600 font-bold text-lg">:</span>
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 min-w-[54px]">
            <span className="font-serif font-bold text-xl text-rose-300">{pad(timeLeft.minutes)}</span>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase">Mins</span>
          </div>
          <span className="text-slate-600 font-bold text-lg">:</span>
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 min-w-[54px]">
            <span className="font-serif font-bold text-xl text-amber-300 animate-pulse">{pad(timeLeft.seconds)}</span>
            <span className="block text-[9px] text-slate-500 font-semibold uppercase">Secs</span>
          </div>
        </div>
      )}
    </div>
  );
}
