"use client";

import React, { useState, useEffect } from 'react';

const QUOTES = [
    "독서는 나를 찾아 떠나는 가장 훌륭한 여행이다.",
    "책 없는 방은 영혼 없는 육체와 같다.",
    "오늘의 나를 만든 것은 동네 도서관이었다.",
    "한 권의 책을 읽음으로써 자신의 삶에서 새 시대를 본 사람이 너무나 많다.",
    "독서는 다만 지식의 재료를 공급할 뿐이며, 그것을 자기 것으로 만드는 것은 사색의 힘이다."
];

export function Affirmation() {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % QUOTES.length);
                setFade(true);
            }, 500);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-8 flex items-center justify-center overflow-hidden">
            <p className={`text-sm font-light text-white/80 text-center italic transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
                &quot;{QUOTES[index]}&quot;
            </p>
        </div>
    );
}
