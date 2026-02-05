"use client";

import React from 'react';
import { useAudio, SOUNDS } from '@/components/providers/AudioProvider';
import { cn } from '@/lib/utils';
import { GlassPanel } from '@/components/ui/GlassPanel';

export function ThemeSelector() {
    const { selectSound, currentSound, isPlaying } = useAudio();

    return (
        <GlassPanel className="rounded-full px-6 py-3 flex gap-6 overflow-x-auto no-scrollbar max-w-full mx-auto">
            {SOUNDS.map((sound) => {
                const isActive = currentSound?.id === sound.id;
                return (
                    <button
                        key={sound.id}
                        onClick={() => selectSound(sound)}
                        className={cn(
                            "group relative flex flex-col items-center justify-center transition-all duration-300 min-w-[3rem]",
                            isActive && isPlaying ? "text-primary scale-110" : "text-white/50 hover:text-white/80 hover:scale-105"
                        )}
                        title={sound.name}
                    >
                        <span className="text-2xl mb-1 filter drop-shadow-md">{sound.icon}</span>
                        {isActive && (
                            <span className="absolute -bottom-2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                        )}
                    </button>
                );
            })}
        </GlassPanel>
    );
}
