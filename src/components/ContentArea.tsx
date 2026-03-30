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
  const [isComplete, setIsComplete] = useState(false);
  const [greeting, setGreeting] = useState('Hey there, good morning!');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Determine greeting based on time of day
    const hour = new Date().getHours();
    let newGreeting = 'Hey there, good morning!';
    if (hour < 12) newGreeting = 'Hey there, good morning!';
    else if (hour < 18) newGreeting = 'Hello there, good afternoon!';
    else if (hour < 21) newGreeting = 'Good evening!';
    else newGreeting = 'Night owl alert!';

    setGreeting(newGreeting);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < greeting.length) {
        setDisplayedText((prev) => prev + greeting[index]);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [greeting, mounted]);

  return (
    <h1 className="text-4xl font-bold text-white">
      {displayedText}
      {!isComplete && <span className="animate-pulse">|</span>}
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

  return <div className="text-sm text-blue-200 mb-2">📅 {dateStr}</div>;
}

export function ContentArea({ section, content }: ContentAreaProps) {
  const isHome = section === 'home';

  return (
    <main className="flex-1 space-y-6">
      {isHome ? (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 rounded-2xl shadow-lg overflow-hidden h-56 relative">
            {/* Background pattern effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.1%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat"></div>
            </div>

            {/* Cover Image */}
            <img
              src="/images/cover.jpg"
              alt="Cover"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>

            <div className="relative h-full flex items-start p-8 z-10">
              <div className="w-full">
                <FormattedDate />
                <TypingGreeting />
              </div>
            </div>
          </div>

          {/* Career Stats Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📈</span>
              <h2 className="text-xl font-semibold text-gray-900">Career Stats</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(careerStats as CareerStat[]).map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  </div>
                  {stat.unit && <div className="text-xs text-gray-400 ml-11">{stat.unit}</div>}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8">{content}</div>
      )}
    </main>
  );
}
