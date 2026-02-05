"use client";

import { AudioProvider } from "@/components/providers/AudioProvider";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Timer } from "@/components/Timer";
import { ReadingDiary } from "@/components/ReadingDiary";
import { Affirmation } from "@/components/Affirmation";
import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";

function BackgroundImage() {
  // TODO: Make this dynamic based on theme
  return (
    <div
      className="absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0 bg-fixed"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<'timer' | 'calendar' | 'diary'>('timer');

  return (
    <AudioProvider>
      <div className="relative min-h-screen flex flex-col">
        <BackgroundImage />

        <main className="relative z-10 flex-1 flex flex-col max-w-md mx-auto w-full p-6 h-screen">

          {/* Header */}
          <header className="flex flex-col items-center gap-6 mt-4 shrink-0">
            <ThemeSelector />
            <Affirmation />
          </header>

          {/* Main Content View */}
          <section className="flex-1 flex flex-col justify-center relative overflow-hidden my-4">
            {view === 'timer' && <Timer />}
            {view === 'calendar' && (
              <GlassPanel className="w-full h-full p-8 flex items-center justify-center">
                <p className="text-white/50">Calendar Coming Soon</p>
              </GlassPanel>
            )}
            {view === 'diary' && <ReadingDiary />}
          </section>

          {/* Navigation Bar */}
          <nav className="glass-nav rounded-2xl p-2 mt-auto shrink-0 mb-4">
            <ul className="flex justify-around items-center">
              <li className="flex-1">
                <button
                  onClick={() => setView('timer')}
                  className={`w-full py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${view === 'timer' ? 'text-primary bg-white/5' : 'text-white/40'}`}
                >
                  <span className="material-symbols-outlined text-2xl">timer</span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Timer</span>
                </button>
              </li>
              <li className="flex-1">
                <button
                  onClick={() => setView('calendar')}
                  className={`w-full py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${view === 'calendar' ? 'text-primary bg-white/5' : 'text-white/40'}`}
                >
                  <span className="material-symbols-outlined text-2xl">calendar_month</span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter">History</span>
                </button>
              </li>
              <li className="flex-1">
                <button
                  onClick={() => setView('diary')}
                  className={`w-full py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${view === 'diary' ? 'text-primary bg-white/5' : 'text-white/40'}`}
                >
                  <span className="material-symbols-outlined text-2xl">auto_stories</span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter">Diary</span>
                </button>
              </li>
            </ul>
          </nav>

        </main>
      </div>
    </AudioProvider>
  );
}
