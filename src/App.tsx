/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Sparkles, Plus, RefreshCw, Heart, MessageSquare, AlertCircle, ArrowUpDown } from 'lucide-react';
import { Counsel, SupabaseConfig } from './types/counsel';
import { supabaseService } from './services/supabaseClient';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { CounselCard } from './components/CounselCard';
import { SqlGuideModal } from './components/SqlGuideModal';
import { SupabaseSettingsModal } from './components/SupabaseSettingsModal';
import { NewCounselModal } from './components/NewCounselModal';

const CATEGORIES = ['전체', '학업/시험', '진로/미래', '교우관계', '가족/가정', '연애/짝사랑', '기타'];

export default function App() {
  const [counsels, setCounsels] = useState<Counsel[]>([]);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<SupabaseConfig>(supabaseService.getConfig());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  // Modals
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNewCounselModalOpen, setIsNewCounselModalOpen] = useState(false);

  // Load posts
  const loadCounsels = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getCounsels();
      setCounsels(data);
    } catch (err) {
      console.error('Failed to load counsels:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCounsels();
  }, []);

  const handleConfigUpdated = () => {
    setConfig(supabaseService.getConfig());
    loadCounsels();
  };

  // Add new counsel
  const handleCreateCounsel = async (
    studentName: string,
    content: string,
    category: Counsel['category']
  ) => {
    const created = await supabaseService.createCounsel(studentName, content, category);
    setCounsels((prev) => [created, ...prev]);
  };

  // Cheer
  const handleCheer = async (id: number) => {
    // 1. Optimistic instant UI increment for smooth feel
    setCounsels((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, cheer_count: (c.cheer_count || 0) + 1 } : c
      )
    );

    // 2. Call service to persist (both in local storage and in Supabase DB)
    try {
      const updatedCheer = await supabaseService.addCheer(id);
      setCounsels((prev) =>
        prev.map((c) => (c.id === id ? { ...c, cheer_count: updatedCheer } : c))
      );
    } catch (err) {
      console.error('Failed to update cheer count:', err);
    }
  };

  // Add Comment (stored in Supabase DB and local)
  const handleAddComment = async (id: number, author: string, text: string) => {
    // 1. Optimistic instant preview for immediate responsiveness
    const tempId = `temp-${Date.now()}`;
    const optimisticComment = {
      id: tempId,
      counsel_id: id,
      author: author.trim() || '익명의 친구',
      content: text.trim(),
      created_at: new Date().toISOString(),
    };

    setCounsels((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, comments: [...(c.comments || []), optimisticComment] }
          : c
      )
    );

    // 2. Persist to Supabase / Local storage
    try {
      const savedComment = await supabaseService.addComment(id, author, text);
      setCounsels((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                comments: (c.comments || []).map((cm) =>
                  cm.id === tempId ? savedComment : cm
                ),
              }
            : c
        )
      );
    } catch (err) {
      console.error('Failed to save comment:', err);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (window.confirm('이 고민글을 삭제하시겠습니까?')) {
      await supabaseService.deleteCounsel(id);
      setCounsels((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Reset sample data
  const handleResetData = () => {
    if (window.confirm('테스트용 기본 데이터 3건으로 복원하시겠습니까?')) {
      const reset = supabaseService.resetToSampleData();
      setCounsels(reset);
    }
  };

  // Filtered & sorted list
  const filteredCounsels = useMemo(() => {
    return counsels
      .filter((item) => {
        const matchesCategory =
          selectedCategory === '전체' || item.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') {
          return (b.cheer_count || 0) - (a.cheer_count || 0);
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [counsels, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-stone-50/60 pb-20 text-stone-800">
      {/* Top Navbar */}
      <Header
        config={config}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenNewCounselModal={() => setIsNewCounselModalOpen(true)}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Welcome Stats Banner */}
        <StatsBanner
          counsels={counsels}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
        />

        {/* Controls: Search, Category Filters, Sort */}
        <div className="bg-white p-4 rounded-3xl border border-amber-100 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="고민 내용이나 작성자 닉네임 검색..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-500 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  지우기
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl shrink-0 self-end sm:self-auto text-xs">
              <button
                onClick={() => setSortBy('latest')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                  sortBy === 'latest'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                최신순
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1 ${
                  sortBy === 'popular'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                응원 많은 순
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-stone-400 shrink-0 font-medium px-1 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              분류:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Counsel Feed List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <span>익명 고민 피드</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                {filteredCounsels.length}건
              </span>
            </h3>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <button
                onClick={loadCounsels}
                className="flex items-center gap-1 hover:text-stone-800 transition-colors"
                title="새로고침"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>새로고침</span>
              </button>
              <span>•</span>
              <button
                onClick={handleResetData}
                className="hover:text-amber-800 transition-colors"
                title="샘플 데이터 초기화"
              >
                기본 샘플 복원
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500" />
              <p className="text-sm font-semibold text-stone-600">고민 게시글을 불러오는 중입니다...</p>
            </div>
          ) : filteredCounsels.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-stone-300 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                🍃
              </div>
              <h4 className="font-bold text-stone-800 text-base">아직 등록된 고민이 없습니다</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {searchQuery || selectedCategory !== '전체'
                  ? '검색 필터 조건에 맞는 글이 없습니다. 필터를 초기화해 보세요.'
                  : '가장 먼저 마음 속 고민을 나누고 따뜻한 위로와 응원을 받아보세요.'}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsNewCounselModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors"
                >
                  첫 번째 고민 등록하기
                </button>
              </div>
            </div>
          ) : (
            filteredCounsels.map((counsel) => (
              <CounselCard
                key={counsel.id}
                counsel={counsel}
                onCheer={handleCheer}
                onAddComment={handleAddComment}
                onDelete={handleDelete}
              />
            ))
          )}
        </section>
      </main>

      {/* Floating Action Button for Mobile/Easy access */}
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={() => setIsNewCounselModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 shadow-xl shadow-orange-500/25 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>고민 작성</span>
        </button>
      </div>

      {/* Modals */}
      <SqlGuideModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <SupabaseSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onConfigUpdated={handleConfigUpdated}
        onOpenSqlGuide={() => {
          setIsSettingsModalOpen(false);
          setIsSqlModalOpen(true);
        }}
      />

      <NewCounselModal
        isOpen={isNewCounselModalOpen}
        onClose={() => setIsNewCounselModalOpen(false)}
        onSubmit={handleCreateCounsel}
      />
    </div>
  );
}
