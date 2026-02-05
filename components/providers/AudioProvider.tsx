"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

// Sound Data
export const SOUNDS = [
    { id: "library", name: "도서관", icon: "📚", file: "/sounds/library.mp3" },
    { id: "subway", name: "지하철", icon: "🚇", file: "/sounds/subway.mp3" },
    { id: "beach", name: "해변", icon: "🏖️", file: "/sounds/beach.mp3" },
    { id: "fire", name: "모닥불", icon: "🔥", file: "/sounds/fire.mp3" },
    { id: "cafe", name: "카페", icon: "☕", file: "/sounds/cafe.mp3" },
    { id: "rain", name: "비 오는 날", icon: "☔", file: "/sounds/rain.mp3" },
    { id: "forest", name: "깊은 숲속", icon: "🌲", file: "/sounds/forest.mp3" },
];

type Sound = typeof SOUNDS[number];

interface AudioContextType {
    currentSound: Sound | null;
    isPlaying: boolean;
    volume: number;
    isLooping: boolean;
    togglePlay: () => void;
    toggleLoop: () => void;
    setVolume: (vol: number) => void;
    selectSound: (sound: Sound) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSound, setCurrentSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const [isLooping, setIsLooping] = useState(true);

    // Audio Volume & Loop Effect
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, volume));
            audioRef.current.loop = isLooping;
        }
    }, [volume, isLooping]);

    // Playback Trigger Effect
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSound) return;

        const playSound = async () => {
            try {
                audio.src = currentSound.file;
                audio.load();
                if (isPlaying) {
                    await audio.play();
                }
            } catch (err) {
                console.error("Audio playback error:", err);
                // Optional: alert only on user interaction if needed, but console is safer for now
            }
        };

        playSound();
    }, [currentSound]); // Re-run when currentSound changes

    // Play/Pause Effect
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSound) return;

        if (isPlaying) {
            audio.play().catch(e => console.error("Resume failed", e));
        } else {
            audio.pause();
        }
    }, [isPlaying]);


    const togglePlay = () => {
        if (!currentSound) return;
        setIsPlaying(!isPlaying);
    };

    const setVolume = (vol: number) => {
        setVolumeState(vol);
    };

    const selectSound = (sound: Sound) => {
        if (currentSound?.id === sound.id) {
            togglePlay();
        } else {
            setCurrentSound(sound);
            setIsPlaying(true); // This will trigger the useEffect to play
        }
    };

    const toggleLoop = () => setIsLooping(!isLooping);

    return (
        <AudioContext.Provider value={{ currentSound, isPlaying, volume, isLooping, togglePlay, toggleLoop, setVolume, selectSound }}>
            {children}
            <audio
                ref={audioRef}
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
