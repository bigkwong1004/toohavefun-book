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
    togglePlay: () => void;
    setVolume: (vol: number) => void;
    selectSound: (sound: Sound) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSound, setCurrentSound] = useState<Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(0.5);

    useEffect(() => {
        // Cleanup function for audioRef.current
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                // No need to set audioRef.current = null as it's managed by React's ref system
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current || !currentSound) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(e => console.error("Play failed", e));
            setIsPlaying(true);
        }
    };

    const setVolume = (vol: number) => {
        setVolumeState(vol);
    };

    const selectSound = (sound: Sound) => {
        if (currentSound?.id === sound.id) {
            togglePlay();
        } else {
            setCurrentSound(sound);
            setIsPlaying(true);
            // Wait for React to update the src prop on the audio element
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.load();
                    audioRef.current.play().catch(err => {
                        console.error("Playback Error:", err);
                        alert(`오디오 재생 오류: ${err.message}\n파일 경로를 확인해주세요.`);
                        setIsPlaying(false);
                    });
                }
            }, 50);
        }
    };

    return (
        <AudioContext.Provider value={{ currentSound, isPlaying, volume, togglePlay, setVolume, selectSound }}>
            {children}
            <audio
                ref={audioRef}
                src={currentSound?.file || ""}
                loop
                onError={(e) => {
                    console.error("Audio Load Error", e);
                    if (currentSound) {
                        // Only alert if we actually tried to play something
                        console.log(`Failed to load: ${currentSound.file}`);
                    }
                }}
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
