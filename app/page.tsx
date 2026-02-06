"use client";

import { AudioProvider, useAudio } from "@/components/providers/AudioProvider";
import { ThemeSelector } from "@/components/ThemeSelector";
import { Timer } from "@/components/Timer";
import { ReadingDiary } from "@/components/ReadingDiary";
import { Affirmation } from "@/components/Affirmation";
import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Calendar } from "@/components/ui/Calendar";
import { AdSensePlaceholder } from "@/components/ui/AdSensePlaceholder";
import { CommunityFeed } from "@/components/ui/CommunityFeed";

// Background Mapping
const BACKGROUNDS: Record<string, string> = {
  library: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1920&q=80",
  subway: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1920&q=80",
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
  fire: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1920&q=80",
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80",
  rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80",
  forest: "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&w=1920&q=80",
};

function BackgroundImage() {
  const { currentSound } = useAudio();
  const bgImage = currentSound ? BACKGROUNDS[currentSound.id] : BACKGROUNDS['rain'];

  return (
    <div
      className="absolute inset-0 bg-cover bg-center transition-all duration-1000 z-0 bg-fixed"
      style={{ backgroundImage: `url('${bgImage}')` }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
    </div>
  );
}

function AudioControls() {
  const { volume, setVolume, isLooping, toggleLoop, currentSound, isPlaying, togglePlay, isMuted, toggleMute } = useAudio();

  if (!currentSound) return null;

  return (
    <GlassPanel className="w-full p-3 flex items-center gap-3 bg-white/10 text-xs">
      <button
        onClick={togglePlay}
        className="size-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
      >
        <span className="material-symbols-outlined text-base">
          {isPlaying ? 'pause' : 'play_arrow'}
        </span>
      </button>

      <button
        onClick={toggleLoop}
        className={`p-1.5 rounded-full transition-colors shrink-0 ${isLooping ? 'bg-primary text-black' : 'bg-white/10 text-white/70'}`}
        title="반복 재생"
      >
        <span className="material-symbols-outlined text-xs">repeat</span>
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={toggleMute}
          className={`p-1.5 rounded-full transition-colors shrink-0 ${isMuted ? 'bg-red-500/20 text-red-200' : 'bg-white/10 text-white/90'}`}
          title={isMuted ? "음소거 해제" : "음소거"}
        >
          <span className="material-symbols-outlined text-xs">
            {isMuted ? 'volume_off' : 'volume_up'}
          </span>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
        />
      </div>
    </GlassPanel>
  );
}

// Theme Colors Mapping
const THEME_COLORS: Record<string, string> = {
  library: "#D4AF37",
  subway: "#3B82F6",
  beach: "#06B6D4",
  fire: "#EF4444",
  cafe: "#8B4513",
  rain: "#60A5FA",
  forest: "#10B981",
};

export default function Home() {
  const [view, setView] = useState<'timer' | 'calendar' | 'diary' | 'community'>('timer');

  return (
    <AudioProvider>
      <ThemeWrapper view={view} setView={setView} />
    </AudioProvider>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ThemeWrapper({ view, setView }: { view: string, setView: any }) {
  const { currentSound } = useAudio();
  const themeColor = currentSound ? THEME_COLORS[currentSound.id] : THEME_COLORS['rain'];

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden flex flex-col"
      style={{ "--color-primary": themeColor } as React.CSSProperties}
    >
      <BackgroundImage />

      {/* ========== [1] Header: 상단 아이콘 (고정) ========== */}
      <header className="relative z-10 w-full px-6 pt-safe pt-8 pb-3 flex-none">
        <div className="flex justify-center w-full">
          <ThemeSelector />
        </div>
      </header>

      {/* ========== [2] Main: 중앙 타이머+광고 (스크롤 가능) ========== */}
      <main className="relative z-10 flex-1 overflow-y-auto min-h-0 no-scrollbar">
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto px-6">

          {/* 명언 */}
          <div className="mb-3 shrink-0">
            <Affirmation />
          </div>

          {/* 메인 뷰 */}
          <section className="w-full flex flex-col items-center justify-center shrink-0">
            {view === 'timer' && <Timer />}
            {view === 'calendar' && <Calendar />}
            {view === 'diary' && <ReadingDiary onBack={() => setView('timer')} />}
            {view === 'community' && <CommunityFeed onBack={() => setView('timer')} />}
          </section>

          {/* 광고 */}
          <div className="mt-4 w-full shrink-0 mb-4">
            <AdSensePlaceholder />
          </div>

          {/* 오디오 컨트롤 (Main 내부, 푸터 위로 밀림 방지) */}
          <div className="w-full shrink-0 mb-6">
            <AudioControls />
          </div>

        </div>
      </main>

      {/* ========== [3] Footer: 하단 버튼 (바닥 고정) ========== */}
      <footer className="relative z-10 w-full flex-none">
        <div className="w-full min-h-[80px] bg-black/80 backdrop-blur-xl rounded-t-3xl border-t border-white/10 px-6 py-4 pb-safe flex justify-between items-center text-white/60">
          <button
            onClick={() => setView('timer')}
            className={`flex flex-col items-center gap-0.5 w-1/4 transition-colors ${view === 'timer' ? 'text-orange-400' : 'hover:text-white'}`}
          >
            <span className="text-2xl material-symbols-outlined">timer</span>
            <span className="text-[9px]">타이머</span>
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex flex-col items-center gap-0.5 w-1/4 transition-colors ${view === 'calendar' ? 'text-orange-400' : 'hover:text-white'}`}
          >
            <span className="text-2xl material-symbols-outlined">calendar_month</span>
            <span className="text-[9px]">히스토리</span>
          </button>
          <button
            onClick={() => setView('diary')}
            className={`flex flex-col items-center gap-0.5 w-1/4 transition-colors ${view === 'diary' ? 'text-orange-400' : 'hover:text-white'}`}
          >
            <span className="text-2xl material-symbols-outlined">auto_stories</span>
            <span className="text-[9px]">다이어리</span>
          </button>
          <button
            onClick={() => setView('community')}
            className={`flex flex-col items-center gap-0.5 w-1/4 transition-colors ${view === 'community' ? 'text-orange-400' : 'hover:text-white'}`}
          >
            <span className="text-2xl material-symbols-outlined">groups</span>
            <span className="text-[9px]">커뮤니티</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
