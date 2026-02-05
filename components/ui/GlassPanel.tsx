import React from 'react';
import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    intensity?: 'low' | 'medium' | 'high';
}

export function GlassPanel({ children, className, intensity = 'medium', ...props }: GlassPanelProps) {
    const intensityStyles = {
        low: 'bg-white/5 backdrop-blur-sm border-white/5',
        medium: 'bg-white/10 backdrop-blur-md border-white/10',
        high: 'bg-white/20 backdrop-blur-lg border-white/20',
    };

    return (
        <div
            className={cn(
                "rounded-[2.5rem] border shadow-xl transition-all",
                intensityStyles[intensity],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
