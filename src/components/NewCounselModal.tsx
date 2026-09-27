import React, { useState } from 'react';
import { X, Sparkles, Send, Dices, HeartHandshake, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Counsel } from '../types/counsel';

interface NewCounselModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (studentName: string, content: string, category: Counsel['category']) => Promise<void>;
}

const RANDOM_NICKNAMES = [
  '익명의 다람쥐',
  '새벽 감성 토끼',
  '지친 카피바라',
  '방황하는 뱁새',
  '도서관 북극곰',
  '꿈꾸는 푸른고래',
  '따뜻한 라떼',
  '고민 많은 판다',
  '달빛 여우',
  '조용한 밤하늘',
  '희망찬 펭귄',
  '봄날의 새싹',
];

const CATEGORIES: Counsel['category'][] = [
  '학업/시험',
  '진로/미래',
  '교우관계',
  '가족/가정',
  '연애/짝사랑',
  '기타',
];

export const NewCounselModal: React.FC<NewCounselModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [studentName, setStudentName] = useState(RANDOM_NICKNAMES[0]);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Counsel['category']>('학업/시험');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRandomizeNickname = () => {
    const randomIndex = Math.floor(Math.random() * RANDOM_NICKNAMES.length);
    setStudentName(RANDOM_NICKNAMES[randomIndex]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(studentName.trim(), content.trim(), category);

      // Cheerful confetti for bravery in speaking out
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#fbbf24', '#f43f5e', '#10b981'],
      });

      setContent('');
      onClose();
    } catch (err) {
      console.error('Failed to submit counsel:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base sm:text-lg">
                마음 속 고민 털어놓기
              </h2>
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-600" />
                100% 익명으로 안전하게 공유됩니다
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Nickname / student_name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-stone-700 flex items-center gap-1">
                <span>작성자 이름 / 닉네임</span>
                <span className="font-mono text-amber-700 text-[11px]">(student_name)</span>
              </label>
              <button
                type="button"
                onClick={handleRandomizeNickname}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 transition-colors"
              >
                <Dices className="w-3 h-3" />
                랜덤 닉네임
              </button>
            </div>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="예: 익명의 다람쥐, 방황하는 고3"
              maxLength={20}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs text-stone-800 font-medium"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-stone-700 mb-1.5">
              고민 분야 (카테고리)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Content / content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-stone-700 flex items-center gap-1">
                <span>고민 내용</span>
                <span className="font-mono text-amber-700 text-[11px]">(content)</span>
              </label>
              <span className="text-[11px] text-stone-400">{content.length} / 500자</span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={500}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="어떤 고민이든 괜찮아요. 혼자 끙끙 앓지 말고 가볍게 털어놓아 보세요. 친구들과 상담소가 따뜻하게 들어줄게요 🌿"
              className="w-full p-3.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs text-stone-800 leading-relaxed resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !studentName.trim() || !content.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? '등록 중...' : '익명으로 등록하기'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
