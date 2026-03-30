'use client';

import { careerStats } from '@/data/content';
import React, { useState, useEffect } from 'react';

interface CareerStat {
  icon: string;
  label: string;
  value: string;
  unit: string;
}

interface ContentAreaProps {
  section: string;
  content: React.ReactNode;
}

function TypingGreeting() {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Hardcoded target text to eliminate any dynamic string computation errors
  const greetingText = "HELLO THERE, GOOD AFTERNOON!";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (index < greetingText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + greetingText[index]);
        setIndex((prev) => prev + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [index, mounted, greetingText]);

  if (!mounted) return <div className="h-10" />;

  return (
    <h1 className="text-4xl font-black text-white uppercase tracking-tighter" suppressHydrationWarning>
      {displayedText}
      {index < greetingText.length && <span className="animate-pulse">|</span>}
    </h1>
  );
}

function FormattedDate() {
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formatted = now.toLocaleDateString('en-US', options);
    setDateStr(formatted);
  }, []);

  return <div className="text-[10px] font-black uppercase text-blue-200 mb-2 tracking-widest flex items-center gap-2">
    <span className="w-4 h-4 rounded bg-blue-500/20 flex items-center justify-center text-[10px]">📅</span>
    {dateStr}
  </div>;
}

export function ContentArea({ section, content }: ContentAreaProps) {
  const isHome = section === 'home';
  const isAbout = section === 'about';

  return (
    <main className="flex-1 overflow-y-auto h-full pr-2 space-y-6">
      {isHome ? (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-2xl shadow-lg overflow-hidden h-56 relative border border-white/10 group">
            {/* Background pattern effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.1%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
            </div>

            {/* Cover Image */}
            <img
              src="/images/cover.jpg"
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            <div className="relative h-full flex items-center p-12 z-10">
              <div className="w-full">
                <FormattedDate />
                <TypingGreeting />
                <p className="text-blue-200/60 text-xs font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                   Professional Portfolio <span className="w-1 h-1 rounded-full bg-blue-400 animate-ping"></span> Carlo Baclao
                </p>
              </div>
            </div>
          </div>

          {/* Career Stats Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm border border-blue-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
              <div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">Career Overview</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Real-time stats based on current portfolio</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(careerStats as CareerStat[]).map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50/50 rounded-bl-full -mr-8 -mt-8 group-hover:scale-110 transition-transform"></div>
                  <div className="flex flex-col gap-4 relative z-10">
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <div className="text-xl font-black text-gray-900 leading-none uppercase tracking-tighter">{stat.value}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : isAbout ? (
        <>{content}</>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-10 border border-gray-100">{content}</div>
      )}
    </main>
  );
}
