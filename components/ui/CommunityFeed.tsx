"use client";

import React, { useEffect, useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { DiaryEntry } from '@/components/ReadingDiary';

// Mock Data for "Other Users"
const MOCK_COMMUNITY_POSTS: DiaryEntry[] = [
    {
        id: 'mock-1',
        date: new Date().toLocaleDateString(),
        bookTitle: "아주 작은 습관의 힘",
        rating: 5,
        content: "작은 변화가 정말 큰 차이를 만드네요. 아침 루틴을 완전히 바꿨습니다. 습관을 만들고 싶은 분들께 강추합니다!",
        isPublic: true,
        author: "Sarah K.",
        timestamp: Date.now() - 3600000 // 1 hour ago
    },
    {
        id: 'mock-2',
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        bookTitle: "프로젝트 헤일메리",
        rating: 5,
        content: "방금 다 읽었는데 진짜 대박입니다. 라키 너무 귀여워요! 🕷️🚀 SF 좋아하시면 무조건 읽으세요.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80",
        isPublic: true,
        author: "Devin M.",
        timestamp: Date.now() - 86400000
    },
    {
        id: 'mock-3',
        date: new Date(Date.now() - 172800000).toLocaleDateString(),
        bookTitle: "돈의 심리학",
        rating: 4,
        content: "돈은 숫자가 아니라 사람의 심리라는 말이 와닿네요. 자산 관리에 대해 다시 생각하게 된 책입니다.",
        isPublic: true,
        author: "Alex J.",
        timestamp: Date.now() - 172800000
    }
];

interface CommunityFeedProps {
    onBack: () => void;
}

export function CommunityFeed({ onBack }: CommunityFeedProps) {
    const [posts, setPosts] = useState<DiaryEntry[]>([]);

    useEffect(() => {
        // Load user's local "Shared" posts
        const localData = localStorage.getItem('reading-diary');
        let userSharedPosts: DiaryEntry[] = [];
        if (localData) {
            try {
                const parsed: DiaryEntry[] = JSON.parse(localData);
                // Filter only public posts
                userSharedPosts = parsed.filter(entry => entry.isPublic);
            } catch (e) { }
        }

        // Merge Mock Data + User Shared Data
        // Sort by timestamp descending (newest first)
        const allPosts = [...MOCK_COMMUNITY_POSTS, ...userSharedPosts].sort((a, b) => b.timestamp - a.timestamp);

        setPosts(allPosts);
    }, []);

    return (
        <GlassPanel className="w-full h-full p-0 flex flex-col relative overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-1 -ml-2 hover:bg-white/10 rounded-full transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h2 className="text-lg font-light">커뮤니티</h2>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">소통 & 공유</p>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    {/* Fake user avatars */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="size-8 rounded-full bg-white/10 border-2 border-[#221a10] flex items-center justify-center text-xs">
                            <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                    ))}
                    <div className="size-8 rounded-full bg-primary border-2 border-[#221a10] flex items-center justify-center text-[10px] text-black font-bold">
                        +99
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        {/* Header: Author & Book */}
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex gap-3 items-center">
                                <div className="size-8 rounded-full bg-gradient-to-tr from-primary/80 to-purple-500/80 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                                    {(post.author === "Me" ? "나" : post.author.charAt(0))}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{post.author === "Me" ? "나" : post.author}</p>
                                    <p className="text-[10px] text-white/40">{post.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-primary font-medium line-clamp-1 max-w-[120px]">{post.bookTitle}</p>
                                <div className="text-[10px] text-primary/80">
                                    {"★".repeat(post.rating)}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-xs text-white/80 leading-relaxed mb-3">
                            {post.content}
                        </p>

                        {/* Image Attachment */}
                        {post.image && (
                            <div className="w-full rounded-xl overflow-hidden mb-3 border border-white/10">
                                <img src={post.image} alt="Post attachment" className="w-full h-auto max-h-64 object-cover" />
                            </div>
                        )}

                        {/* Actions (Mock) */}
                        <div className="flex gap-4 border-t border-white/5 pt-3">
                            <button className="flex items-center gap-1 text-white/40 hover:text-red-400 transition-colors text-xs group">
                                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">favorite</span>
                                <span>좋아요</span>
                            </button>
                            <button className="flex items-center gap-1 text-white/40 hover:text-primary transition-colors text-xs group">
                                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">chat_bubble</span>
                                <span>댓글</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </GlassPanel>
    );
}
