"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

// Sound Data
const basePath = process.env.NODE_ENV === 'production' ? '/toohavefun-book' : '';

export const SOUNDS = [
    { id: "library", name: "도서관", icon: "📚", file: `${basePath}/sounds/library.mp3` },
    { id: "subway", name: "지하철", icon: "🚇", file: `${basePath}/sounds/subway.mp3` },
    { id: "beach", name: "해변", icon: "🏖️", file: `${basePath}/sounds/beach.mp3` },
    { id: "fire", name: "모닥불", icon: "🔥", file: `${basePath}/sounds/fire.mp3` },
    { id: "cafe", name: "카페", icon: "☕", file: `${basePath}/sounds/cafe.mp3` },
    { id: "rain", name: "비 오는 날", icon: "☔", file: `${basePath}/sounds/rain.mp3` },
    { id: "forest", name: "깊은 숲속", icon: "🌲", file: `${basePath}/sounds/forest.mp3` },
];

type Sound = typeof SOUNDS[number];

interface AudioContextType {
    currentSound: Sound | null;
    isPlaying: boolean;
    volume: number;
    isLooping: boolean;
    isMuted: boolean;
    togglePlay: () => void;
    toggleLoop: () => void;
    toggleMute: () => void;
    setVolume: (vol: number) => void;
    selectSound: (sound: Sound) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

    const [currentSound, setCurrentSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const [isLooping, setIsLooping] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    // Initialize Web Audio API
    const initAudioContext = () => {
        if (!audioRef.current || audioCtxRef.current) return;

        try {
            const CtxClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new CtxClass();
            const gainNode = ctx.createGain();

            // Create source from the audio element
            // NOTE: This can only be called once per element
            const source = ctx.createMediaElementSource(audioRef.current);

            source.connect(gainNode);
            gainNode.connect(ctx.destination);

            audioCtxRef.current = ctx;
            gainNodeRef.current = gainNode;
            sourceNodeRef.current = source;

            // Apply initial volume
            const effectiveVolume = isMuted ? 0 : volume;
            gainNode.gain.setValueAtTime(effectiveVolume, ctx.currentTime);
        } catch (error) {
            console.error("Failed to init AudioContext:", error);
        }
    };

    // Ensure AudioContext is resumed on interaction
    const resumeAudioContext = async () => {
        if (audioCtxRef.current?.state === 'suspended') {
            await audioCtxRef.current.resume();
        }
    };

    // Volume Effect (uses GainNode)
    useEffect(() => {
        if (gainNodeRef.current && audioCtxRef.current) {
            // Smooth volume transition prevents clicking
            const now = audioCtxRef.current.currentTime;
            const targetVolume = isMuted ? 0 : Math.max(0, Math.min(1, volume));

            gainNodeRef.current.gain.cancelScheduledValues(now);
            gainNodeRef.current.gain.linearRampToValueAtTime(targetVolume, now + 0.1);
        }
        // Fallback or native sync
        if (audioRef.current) {
            // Keep native volume at 1.0 so GainNode handles attenuation.
            audioRef.current.volume = 1.0;
        }
    }, [volume, isMuted]);

    // Loop Effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLooping;
        }
    }, [isLooping]);

    // Playback Trigger Effect
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSound) return;

        const playSound = async () => {
            try {
                // Ensure context is ready
                initAudioContext();
                await resumeAudioContext();

                audio.src = currentSound.file;
                audio.load();

                if (isPlaying) {
                    await audio.play();
                }
            } catch (err) {
                console.error("Audio playback error:", err);
            }
        };

        playSound();
    }, [currentSound]);

    // Play/Pause Effect
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSound) return;

        const togglePlayback = async () => {
            if (isPlaying) {
                initAudioContext();
                await resumeAudioContext();
                audio.play().catch(e => console.error("Resume failed", e));
            } else {
                audio.pause();
            }
        };
        togglePlayback();

    }, [isPlaying]);


    const togglePlay = () => {
        if (!currentSound) return;
        setIsPlaying(!isPlaying);
    };

    const setVolume = (vol: number) => {
        // If user changes volume while muted, unmute
        if (isMuted && vol > 0) {
            setIsMuted(false);
        }
        setVolumeState(vol);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const selectSound = (sound: Sound) => {
        // Init context on user interaction (selection)
        initAudioContext();
        resumeAudioContext();

        if (currentSound?.id === sound.id) {
            togglePlay();
        } else {
            setCurrentSound(sound);
            setIsPlaying(true);
        }
    };

    const toggleLoop = () => setIsLooping(!isLooping);

    return (
        <AudioContext.Provider value={{ currentSound, isPlaying, volume, isLooping, isMuted, togglePlay, toggleLoop, toggleMute, setVolume, selectSound }}>
            {children}
            <audio
                ref={audioRef}
                preload="auto"
                crossOrigin="anonymous"
                onError={(e) => console.error("Audio tag error:", e)}
            />
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}
