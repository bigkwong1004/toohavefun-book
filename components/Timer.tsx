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
        <div className="flex flex-col items-center justify-center py-4 w-full">
            {/* 거대한 시간 텍스트 (원형 제거) */}
            <div className="text-white text-[6rem] sm:text-[7rem] leading-none font-thin tracking-tighter drop-shadow-2xl font-mono tabular-nums">
                {formatTime(timeLeft)}
            </div>
            <span className="text-orange-300/80 text-sm tracking-[0.3em] uppercase mt-3">
                {isActive ? '집중 중...' : 'Focus Time'}
            </span>

            {/* 재생 버튼 */}
            <div className="mt-8">
                {!alarmOsc ? (
                    <button
                        onClick={toggleTimer}
                        className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        <span className="text-white text-3xl ml-1">
                            {isActive ? '⏸' : '▶'}
                        </span>
                    </button>
                ) : (
                    <button
                        onClick={stopAlarm}
                        className="px-8 py-3 rounded-full bg-red-500/90 hover:bg-red-600 text-white animate-pulse font-bold text-base shadow-lg"
                    >
                        알람 끄기
                    </button>
                )}
            </div>
        </div>
    );
}
