"use client";

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface DiaryEntry {
    id: string;
    date: string;
    bookTitle: string;
    rating: number;
    content: string;
}

export function ReadingDiary() {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [isWriting, setIsWriting] = useState(false);

    // Form State
    const [bookTitle, setBookTitle] = useState('');
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('reading-diary');
        if (saved) {
            setEntries(JSON.parse(saved));
        }
    }, []);

    const saveEntry = () => {
        if (!bookTitle.trim()) return;

        const newEntry: DiaryEntry = {
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            bookTitle,
            rating,
            content
        };

        const updated = [newEntry, ...entries];
        setEntries(updated);
        localStorage.setItem('reading-diary', JSON.stringify(updated));

        // Reset and close
        setBookTitle('');
        setContent('');
        setRating(5);
        setIsWriting(false);
    };

    if (isWriting) {
        return (
            <GlassPanel className="w-full h-full p-6 flex flex-col overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-light">New Entry</h3>
                        <p className="text-xs text-white/50 uppercase tracking-widest">Capture the moment</p>
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
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Book Title</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50"
                            placeholder="Enter book title"
                            value={bookTitle}
                            onChange={(e) => setBookTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Rating</label>
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
                        <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">Thoughts</label>
                        <textarea
                            rows={5}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary/50 resize-none"
                            placeholder="What resonates with you?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </div>
                </div>

                <button
                    onClick={saveEntry}
                    className="w-full mt-6 bg-primary text-black font-bold py-3 rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg"
                >
                    Save Journal
                </button>
            </GlassPanel>
        );
    }

    return (
        <GlassPanel className="w-full h-full p-0 flex flex-col relative overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-lg font-light">Reading Log</h2>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">My Thoughts</p>
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
                        <p className="text-sm">No entries yet.</p>
                    </div>
                ) : (
                    entries.map((entry) => (
                        <div key={entry.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-primary line-clamp-1">{entry.bookTitle}</h4>
                                <span className="text-[10px] text-white/40">{entry.date}</span>
                            </div>
                            <div className="flex text-primary text-xs mb-2">
                                {"★".repeat(entry.rating)}{"☆".repeat(5 - entry.rating)}
                            </div>
                            <p className="text-xs text-white/70 line-clamp-3 leading-relaxed">
                                {entry.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </GlassPanel>
    );
}
