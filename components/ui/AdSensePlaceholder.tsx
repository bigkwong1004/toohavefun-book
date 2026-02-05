"use client";

import React from 'react';

export function AdSensePlaceholder() {
    return (
        <div className="w-full h-24 mt-6 flex items-center justify-center bg-black/20 border border-white/5 rounded-xl backdrop-blur-sm overflow-hidden shrink-0">
            <div className="flex flex-col items-center gap-1 opacity-40">
                <span className="text-xs uppercase tracking-widest font-bold">Advertisement</span>
                <span className="text-[10px] text-white/50">Space reserved for Google AdSense</span>
            </div>
        </div>
    );
}
