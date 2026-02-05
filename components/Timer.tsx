"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Timer() {
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const totalTime = 30 * 60;

    // Calculate progress for ring (circumference is approx 289 for r=46)
    const circumference = 289;
    const progress = ((totalTime - timeLeft) / totalTime) * circumference;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            playAlarm();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const playAlarm = () => {
        // Simple Web Audio API beep
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, ctx.currentTime); // A4
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5); // Slide up

        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2); // Fade out

        oscillator.start();
        oscillator.stop(ctx.currentTime + 2); // Stop after 2 seconds
    };


    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    return (
        <div className="flex flex-col items-center">
            <div className="relative size-72 sm:size-80">
                <div className="absolute inset-0 flex items-center justify-center z-10 flex-col">
                    <span className="text-7xl font-light tracking-tighter text-white font-display">
                        {formatTime(timeLeft)}
                    </span>
                    <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase mt-4">
                        {isActive ? 'Focusing...' : 'Focus Time'}
                    </p>
                </div>
                {/* SVG Ring */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="46" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <circle
                        cx="50" cy="50" fill="none" r="46"
                        stroke="currentColor"
                        className="text-primary transition-all duration-1000 ease-linear"
                        strokeDasharray={circumference}
                        strokeDashoffset={progress}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            {/* Play Button */}
            <button
                onClick={toggleTimer}
                className="mt-14 size-20 rounded-full flex items-center justify-center text-white bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all active:scale-95"
            >
                {isActive ? (
                    <span className="material-symbols-outlined text-4xl">pause</span>
                ) : (
                    <span className="material-symbols-outlined text-4xl fill-1 ml-1">play_arrow</span>
                )}
            </button>
        </div>
    );
}
