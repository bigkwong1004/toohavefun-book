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
  subway: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1920&q=80", // Updated: Moody Subway
  beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
  fire: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1920&q=80", // Updated: Cozy Campfire
  cafe: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1920&q=80",
  rain: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1920&q=80",
  forest: "https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?auto=format&fit=crop&w=1920&q=80",
};

function BackgroundImage() {
  const { currentSound } = useAudio();
  const bgImage = currentSound ? BACKGROUNDS[currentSound.id] : BACKGROUNDS['rain']; // Default to rain/window

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
    <GlassPanel className="w-full p-4 mt-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 bg-white/15">
      <button
        onClick={togglePlay}
        className="size-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
      >
        <span className="material-symbols-outlined text-xl">
          {isPlaying ? 'pause' : 'play_arrow'}
        </span>
      </button>

      <button
        onClick={toggleLoop}
        className={`p-2 rounded-full transition-colors shrink-0 ${isLooping ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/10 text-white/70'}`}
        title="반복 재생"
      >
        <span className="material-symbols-outlined text-sm">repeat</span>
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={toggleMute}
          className={`p-2 rounded-full transition-colors shrink-0 ${isMuted ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-white/10 text-white/90 border border-white/10'}`}
          title={isMuted ? "음소거 해제" : "음소거"}
        >
          <span className="material-symbols-outlined text-sm">
            {isMuted ? 'volume_off' : (volume === 0 ? 'volume_mute' : 'volume_up')}
          </span>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
        />
      </div>
    </GlassPanel>
  );
}

// Theme Colors Mapping
const THEME_COLORS: Record<string, string> = {
  library: "#D4AF37", // Gold
  subway: "#3B82F6",  // Blue
  beach: "#06B6D4",   // Cyan
  fire: "#EF4444",    // Red
  cafe: "#8B4513",    // Brown
  rain: "#60A5FA",    // Light Blue
  forest: "#10B981",  // Green
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
      className="relative h-[100dvh] w-full bg-cover bg-center overflow-hidden flex flex-col"
      style={{ "--color-primary": themeColor } as React.CSSProperties}
    >
      <BackgroundImage />

      {/* [1] 상단: 카테고리 아이콘 영역 */}
      <header className="relative z-10 w-full px-6 pt-12 pb-4 flex-none">
        <div className="flex justify-center w-full">
          <ThemeSelector />
        </div>
      </header>

      {/* [2] 메인 컨텐츠 영역 (Flex-grow로 남은 공간 모두 차지 + 스크롤 가능) */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto overflow-y-auto min-h-0 no-scrollbar">

        {/* 명언 영역 */}
        <div className="mb-4 shrink-0">
          <Affirmation />
        </div>

        {/* 메인 뷰 (타이머 등) */}
        <section className="w-full flex flex-col items-center justify-center shrink-0">
          {view === 'timer' && <Timer />}
          {view === 'calendar' && <Calendar />}
          {view === 'diary' && <ReadingDiary onBack={() => setView('timer')} />}
          {view === 'community' && <CommunityFeed onBack={() => setView('timer')} />}
        </section>

        {/* 광고 영역 (중간에 배치하되, 메인 컨텐츠 내부에 포함) */}
        <div className="mt-6 w-full px-6 shrink-0 mb-8">
          <AdSensePlaceholder />
        </div>

      </main>

      {/* [3] 하단 영역: 오디오 컨트롤 + 내비게이션 */}
      <footer className="relative z-10 w-full flex-none pb-safe-bottom">

        {/* 오디오 컨트롤 */}
        <div className="w-full max-w-md mx-auto px-6 mb-2">
          <div className="scale-90 origin-bottom">
            <AudioControls />
          </div>
        </div>

        {/* 하단 내비게이션 바 */}
        <div className="w-full h-auto bg-black/80 backdrop-blur-xl rounded-t-3xl border-t border-white/10 px-6 py-4 flex justify-between items-center text-white/60">
          <button
            onClick={() => setView('timer')}
            className={`flex flex-col items-center gap-1 w-1/4 transition-colors ${view === 'timer' ? 'text-orange-400' : 'hover:text-white'}`}
          >
            <span className="text-xl material-symbols-outlined">timer</span>
            <span className="text-[10px]">타이머</span>
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex flex-col items-center gap-1 w-1/4 transition-colors ${view === 'calendar' ? 'text-orange-400' : 'hover:text-white'}`}
          >
            <span className="text-xl material-symbols-outlined">calendar_month</span>
            <span className="text-[10px]">히스토리</span>
          </button>
          <button
            onClick={() => setView('diary')}
            className={`flex flex-col items-center gap-1 w-1/4 transition-colors ${view === 'diary' ? 'text-orange-400' : 'hover:text-white'}`}
          >
            <span className="text-xl material-symbols-outlined">auto_stories</span>
            <span className="text-[10px]">다이어리</span>
          </button>
          <button
            onClick={() => setView('community')}
            className={`flex flex-col items-center gap-1 w-1/4 transition-colors ${view === 'community' ? 'text-orange-400' : 'hover:text-white'}`}
          >
            <span className="text-xl material-symbols-outlined">groups</span>
            <span className="text-[10px]">커뮤니티</span>
          </button>
        </div>
      </footer>

    </div>
  );
}
