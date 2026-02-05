"use client";

import React, { useState, useEffect, useRef } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface DiaryEntry {
    id: string;
    date: string;
    bookTitle: string;
    rating: number;
    content: string;
    image?: string; // Base64 Data URL
    isPublic: boolean;
    author: string; // "Me"
    timestamp: number;
}

interface ReadingDiaryProps {
    onBack?: () => void;
}

export function ReadingDiary({ onBack }: ReadingDiaryProps) {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [isWriting, setIsWriting] = useState(false);

    // Form State
    const [bookTitle, setBookTitle] = useState('');
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load saved data
    useEffect(() => {
        const saved = localStorage.getItem('reading-diary');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setTimeout(() => setEntries(parsed), 0);
            } catch {
                // Ignore error
            }
        }
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const saveEntry = () => {
        if (!bookTitle.trim()) return;

        const newEntry: DiaryEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            bookTitle,
            rating,
            content,
            image: image || undefined,
            isPublic,
            author: "Me",
            timestamp: Date.now()
        };

        const updated = [newEntry, ...entries];
        setEntries(updated);
        // eslint-disable-next-line
        // @ts-ignore
        localStorage.setItem('reading-diary', JSON.stringify(updated));

        // Reset and close
        setBookTitle('');
        setContent('');
        setRating(5);
        setImage(null);
        setIsPublic(false);
        setIsWriting(false);
    };

    if (isWriting) {
        return (
            <GlassPanel className="w-full h-full p-6 flex flex-col overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-light">새 기록 작성</h3>
                        <p className="text-xs text-white/50 uppercase tracking-widest">이 순간을 기록하세요</p>
                    </div>
                    <button
                        onClick={() => setIsWriting(false)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-6 flex-1">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">책 제목</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50"
                            placeholder="책 제목을 입력하세요"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">평점</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? 'text-primary' : 'text-white/20'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">감상평</label>
                        <textarea
                            rows={5}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 resize-none"
                            placeholder="어떤 점이 인상 깊었나요?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>

                    {/* Image & Share Controls */}
                    <div className="flex justify-between items-end gap-4">
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <button
                                onClick={triggerFileInput}
                                className="size-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                            >
                                <span className="material-symbols-outlined text-white/60">add_photo_alternate</span>
                            </button>
                            {image && (
                                <div className="relative size-12 rounded-xl overflow-hidden border border-white/20 group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => setImage(null)}
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-xs">close</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-white/40 uppercase font-bold tracking-wider">커뮤니티 공유</span>
                            <button
                                onClick={() => setIsPublic(!isPublic)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-primary' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 left-1 size-4 rounded-full bg-white shadow-md transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                </div>

                <button
                    onClick={saveEntry}
                    className="w-full mt-6 bg-primary text-black font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg"
                >
                    저장하기
                </button>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel className="w-full h-full p-0 flex flex-col relative overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="p-1 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    )}
                    <div>
                        <h2 className="text-lg font-light">독서 기록장</h2>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">나의 생각들</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsWriting(true)}
                    className="size-10 rounded-full bg-primary text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                >
                    <span className="material-symbols-outlined font-bold text-xl">+</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {entries.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30">
                        <span className="material-symbols-outlined text-4xl mb-2">auto_stories</span>
                        <p className="text-sm">아직 작성된 기록이 없습니다.</p>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-primary line-clamp-1">{entry.bookTitle}</h4>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-white/40">{entry.date}</span>
                                    {entry.isPublic && <span className="text-[9px] text-blue-300 uppercase tracking-tight bg-blue-500/20 px-1.5 py-0.5 rounded ml-1">공유됨</span>}
                                </div>
                            </div>
                            <div className="flex text-primary text-xs mb-2">
                                {"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
                            </div>

                            {/* Content & Image Layout */}
                            <div className="flex gap-3">
                                {entry.image && (
                                    <div className="size-16 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={entry.image} alt="Note Attachment" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
                                    {entry.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </GlassPanel>
    );
}
