"use client";

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';

interface DiaryEntry {
    id: string;
    date: string; // Format: YYYY-M-D (matches calendar)
    bookTitle: string;
    rating: number;
    content: string;
}

export function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [entries, setEntries] = useState<DiaryEntry[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Initial load of diary entries
    useEffect(() => {
        const loadEntries = () => {
            const saved = localStorage.getItem('reading-diary');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    // Standardize date format if necessary, for now assuming locale date string is consistent-ish
                    // Ideally we'd map this to a ISO string YYYY-MM-DD for easier comparison
                    // For this MVP, we will try to match the stored date string format "YYYY. M. D." or similar depending on locale
                    setEntries(parsed);
                } catch (e) {
                    console.error("Failed to parse diary entries", e);
                }
            }
        };

        loadEntries();
        // Optional: listen for storage events if we want real-time updates across tabs/components
        window.addEventListener('storage', loadEntries);
        return () => window.removeEventListener('storage', loadEntries);
    }, []);


    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay(); // 0 = Sunday
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed

    // Formatting for display
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월",
        "7월", "8월", "9월", "10월", "11월", "12월"];

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    // Generate calendar grid
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    // Helper to check if a day has an entry
    const hasEntry = (day: number) => {
        // Construct date string to match Diary's locale format roughly
        // IMPORTANT: The Diary component uses `new Date().toLocaleDateString()`.
        // This is tricky because it depends on the user's browser locale.
        // A robust solution would use a fixed format. 
        // For this hacky MVP, we'll try to reconstruct the date object and compare locale strings

        const targetDate = new Date(year, month, day).toLocaleDateString();
        return entries.some(e => e.date === targetDate);
    };



    // Filter entries for selected date
    const selectedEntries = selectedDate
        ? entries.filter(e => e.date === selectedDate)
        : [];


    const handleDateClick = (day: number) => {
        const clickedDate = new Date(year, month, day).toLocaleDateString();
        setSelectedDate(clickedDate === selectedDate ? null : clickedDate);
    };

    return (
        <GlassPanel className="w-full h-full p-4 flex flex-col items-center">

            {/* Header */}
            <div className="flex justify-between items-center w-full mb-6 px-2">
                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
                </button>
                <div className="text-center">
                    <h2 className="text-xl font-light text-white tracking-wide">{monthNames[month]}</h2>
                    <p className="text-xs text-white/30 tracking-[0.2em] font-bold">{year}</p>
                </div>
                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
                </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 w-full mb-2 text-center">
                {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                    <div key={i} className={`text-xs font-bold ${i === 0 ? 'text-red-400/70' : 'text-white/30'}`}>
                        {d}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 w-full gap-2">
                {days.map((day, idx) => {
                    if (day === null) return <div key={`empty-${idx}`} />;

                    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
                    const entryExists = hasEntry(day);
                    const isSelected = selectedDate === new Date(year, month, day).toLocaleDateString();

                    return (
                        <button
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`
                                relative aspect-square rounded-full flex items-center justify-center text-sm transition-all
                                ${isToday ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-white/80'}
                                ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-black/50' : ''}
                            `}
                        >
                            {day}
                            {/* Dot indicator for entry */}
                            {entryExists && (
                                <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isToday ? 'bg-black' : 'bg-primary'}`} />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Selected Date Details (Footer/Pop-up area) */}
            {selectedDate && (
                <div className="w-full mt-6 bg-white/5 rounded-2xl p-4 border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-xs text-white/50 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
                        {selectedDate}
                    </h3>
                    {selectedEntries.length > 0 ? (
                        <div className="space-y-3">
                            {selectedEntries.map(entry => (
                                <div key={entry.id} className="flex gap-3 items-start">
                                    <span className="text-xl">📖</span>
                                    <div>
                                        <p className="text-sm text-primary font-medium">{entry.bookTitle}</p>
                                        <p className="text-xs text-white/60 line-clamp-2">{entry.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-white/30 italic text-center py-2">이 날의 기록이 없습니다.</p>
                    )}
                </div>
            )}

        </GlassPanel>
    );
}
