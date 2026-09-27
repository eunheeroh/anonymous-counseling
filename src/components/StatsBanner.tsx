import React from 'react';
import { Sparkles, MessageSquareHeart, Users, HeartHandshake, Code } from 'lucide-react';
import { Counsel } from '../types/counsel';

interface StatsBannerProps {
  counsels: Counsel[];
  onOpenSqlModal: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  counsels,
  onOpenSqlModal,
}) => {
  const totalCheers = counsels.reduce((sum, c) => sum + (c.cheer_count || 0), 0);
  const totalComments = counsels.reduce((sum, c) => sum + (c.comments?.length || 0), 0);

  return (
    <div className="space-y-4">
      {/* Warm Welcome Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 via-orange-50 to-amber-50 border border-amber-200/80 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-200/70 text-amber-900 border border-amber-300/50">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>오늘도 혼자 고민하지 마세요</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            마음 속 무거운 짐을 털어놓는<br className="hidden sm:inline" />
            <span className="text-amber-800"> 따뜻한 익명 상담소</span>
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
            학업, 진로, 친구 관계 등 누구에게도 털어놓기 힘든 고민이 있다면 편하게 적어주세요. 
            모든 글은 익명으로 안전하게 전해지며 서로에게 위로와 힘이 되어줍니다.
          </p>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 rounded-full bg-amber-300/20 blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <MessageSquareHeart className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-stone-900">{counsels.length}개</div>
            <div className="text-[11px] text-stone-500">나눈 고민글</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-stone-900">{totalCheers}번</div>
            <div className="text-[11px] text-stone-500">보낸 따뜻한 응원</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-stone-900">{totalComments}개</div>
            <div className="text-[11px] text-stone-500">위로의 댓글</div>
          </div>
        </div>
      </div>
    </div>
  );
};
