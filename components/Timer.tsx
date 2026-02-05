"use client";

import React, { useEffect, useState } from 'react';


export function Timer() {
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const totalTime = 30 * 60;

    // Calculate progress for ring (circumference is approx 289 for r=46)
    const circumference = 289;
    const progress = ((totalTime - timeLeft) / totalTime) * circumference;



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
            // Simple alarm pattern beep-beep-beep
            // Ideally we'd loop a buffer source, but oscillator is easier for code-only
            // We can just let it ring continuous or pulsate

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
            } catch (e) { }
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
        <div className="flex flex-col items-center">
            <div className="relative size-72 sm:size-80">
                <div className="absolute inset-0 flex items-center justify-center z-10 flex-col">
                    <span className="text-7xl font-light tracking-tighter text-white font-display">
                        {formatTime(timeLeft)}
                    </span>
                    <p className="text-[10px] font-bold text-white/40 tracking-[0.3em] uppercase mt-4">
                        {isActive ? '집중하는 중...' : '집중 시간'}
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
            {!alarmOsc ? (
                <button
                    onClick={toggleTimer}
                    className="mt-14 size-20 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 border border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.15)] group"
                >
                    {isActive ? (
                        <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">pause</span>
                    ) : (
                        <span className="material-symbols-outlined text-4xl ml-1 group-hover:scale-110 transition-transform">play_arrow</span>
                    )}
                </button>
            ) : (
                <button
                    onClick={stopAlarm}
                    className="mt-14 px-8 py-4 rounded-full flex items-center justify-center text-white bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md transition-all active:scale-95 border border-red-500/50 animate-pulse"
                >
                    <span className="material-symbols-outlined text-2xl mr-2">notifications_off</span>
                    <span className="font-bold uppercase tracking-widest text-sm">알람 끄기</span>
                </button>
            )}
        </div>
    );
}
