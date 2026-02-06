"use client";

import React, { useEffect, useState } from 'react';


export function Timer() {
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const totalTime = 30 * 60;

    const [alarmCtx, setAlarmCtx] = useState<AudioContext | null>(null);
    const [alarmOsc, setAlarmOsc] = useState<OscillatorNode | null>(null);

    const playAlarm = () => {
        if (isActive) return; // Prevention

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, ctx.currentTime);

            // Loop effect: Ramp up and down rapidly
            const now = ctx.currentTime;

            // Pulsating alert sound
            oscillator.frequency.setValueAtTime(880, now);
            gainNode.gain.setValueAtTime(0.1, now);

            // LFO for pulsing
            const lfo = ctx.createOscillator();
            lfo.type = 'square';
            lfo.frequency.value = 4; // 4hz pulse
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 500;
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.start();

            oscillator.start();
            setAlarmCtx(ctx);
            setAlarmOsc(oscillator);
        } catch (e) {
            console.error("Alarm error", e);
        }
    };

    const stopAlarm = () => {
        if (alarmOsc) {
            try {
                alarmOsc.stop();
                alarmOsc.disconnect();
            } catch { }
            setAlarmOsc(null);
        }
        if (alarmCtx) {
            alarmCtx.close();
            setAlarmCtx(null);
        }
        // Also ensure timer is reset
        setIsActive(false);
        setTimeLeft(totalTime);
    };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, timeLeft]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (alarmCtx) alarmCtx.close();
        };
    }, [alarmCtx]);


    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsActive(!isActive);

    return (
        <div className="flex flex-col items-center justify-start h-full min-h-[400px] pt-24 sm:pt-32 pb-40">
            {/* Plain Text Timer */}
            <div className="flex flex-col items-center justify-center mb-10">
                <span className="text-8xl sm:text-9xl font-light tracking-tighter text-white font-display tabular-nums transition-all drop-shadow-2xl">
                    {formatTime(timeLeft)}
                </span>
                <p className="text-sm sm:text-base font-bold text-white/60 tracking-[0.5em] uppercase mt-4">
                    {isActive ? '집중하는 중...' : '집중 시간'}
                </p>
            </div>

            {/* Play Button - High Visibility update */}
            {!alarmOsc ? (
                <button
                    onClick={toggleTimer}
                    className="group relative flex items-center justify-center gap-4 px-12 py-6 rounded-full bg-white text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] z-20"
                >
                    <div className={`transition-all duration-300 ${isActive ? 'scale-90' : 'scale-100'}`}>
                        {isActive ? (
                            <span className="material-symbols-outlined text-4xl">pause</span>
                        ) : (
                            <span className="material-symbols-outlined text-4xl">play_arrow</span>
                        )}
                    </div>
                    <span className="text-xl font-bold tracking-widest uppercase">
                        {isActive ? '일시정지' : '시작하기'}
                    </span>
                </button>
            ) : (
                <button
                    onClick={stopAlarm}
                    className="px-12 py-6 rounded-full flex items-center justify-center text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 shadow-[0_0_50px_rgba(239,68,68,0.6)] animate-pulse"
                >
                    <span className="material-symbols-outlined text-3xl mr-3">notifications_off</span>
                    <span className="font-bold uppercase tracking-widest text-lg">알람 끄기</span>
                </button>
            )}
        </div>
    );
}
