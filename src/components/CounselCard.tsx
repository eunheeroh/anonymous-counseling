import React, { useState } from 'react';
import { Heart, MessageCircle, MoreVertical, Copy, Trash2, Send, Clock, User, Check, Sparkles } from 'lucide-react';
import { Counsel } from '../types/counsel';

interface CounselCardProps {
  counsel: Counsel;
  onCheer: (id: number) => void;
  onAddComment: (id: number, author: string, text: string) => void;
  onDelete: (id: number) => void;
}

const EMOJI_MAP: Record<string, string> = {
  다람쥐: '🐿️',
  토끼: '🐰',
  카피바라: '🥔',
  뱁새: '🐤',
  북극곰: '🐻‍❄️',
  고래: '🐳',
  라떼: '☕',
  판다: '🐼',
  여우: '🦊',
  고양이: '🐱',
  강아지: '🐶',
  펭귄: '🐧',
  새싹: '🌱',
};

function getAvatarEmoji(name: string): string {
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (name.includes(key)) return emoji;
  }
  const defaults = ['🌿', '🍀', '✨', '🌻', '🌸', '🍂', '🍁'];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return defaults[hash % defaults.length];
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  } catch {
    return '최근';
  }
}

export const CounselCard: React.FC<CounselCardProps> = ({
  counsel,
  onCheer,
  onAddComment,
  onDelete,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentAuthor, setCommentAuthor] = useState('따뜻한 이웃');
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isCheering, setIsCheering] = useState(false);

  const emoji = getAvatarEmoji(counsel.student_name);
  const timeStr = formatRelativeTime(counsel.created_at);

  const handleCheerClick = () => {
    setIsCheering(true);
    onCheer(counsel.id);
    setTimeout(() => {
      setIsCheering(false);
    }, 400);
  };

  const handleCopySqlInsert = () => {
    // Generate clean INSERT SQL for this specific item
    const sql = `INSERT INTO counsels (student_name, content)
VALUES ('${counsel.student_name.replace(/'/g, "''")}', '${counsel.content.replace(/'/g, "''")}');`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => {
      setCopiedSql(false);
      setShowMenu(false);
    }, 1800);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(counsel.id, commentAuthor.trim() || '익명의 친구', commentText.trim());
    setCommentText('');
  };

  return (
    <article className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-100 shadow-xs hover:shadow-md transition-shadow relative">
      
      {/* Top row: Avatar, Name, Category, Date, Menu */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-xl shadow-2xs select-none">
            {emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                {counsel.student_name}
              </h3>
              <span className="text-[11px] font-mono text-stone-400">#{counsel.id}</span>
              {counsel.category && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  {counsel.category}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-0.5">
              <Clock className="w-3 h-3" />
              <time dateTime={counsel.created_at}>{timeStr}</time>
            </div>
          </div>
        </div>

        {/* More Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 p-1.5 text-xs animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={handleCopySqlInsert}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-stone-700 hover:bg-amber-50 hover:text-amber-900 transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold text-emerald-700">SQL 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" />
                    <span>이 글의 INSERT SQL 복사</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(counsel.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>게시글 삭제</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-line my-3">
        {counsel.content}
      </div>

      {/* Footer bar: Empathy Cheers & Comments */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3 text-xs">
        
        {/* Cheer Empathy Button */}
        <button
          onClick={handleCheerClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border active:scale-95 transition-all shadow-2xs cursor-pointer select-none ${
            isCheering
              ? 'bg-rose-100 text-rose-700 border-rose-300 scale-105'
              : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200/60'
          }`}
          title="클릭하여 토닥토닥 응원 숫자 1 증가"
        >
          <Heart
            className={`w-4 h-4 fill-rose-500 text-rose-500 transition-transform ${
              isCheering ? 'scale-135 text-rose-600' : 'hover:scale-110'
            }`}
          />
          <span>토닥토닥 힘내요</span>
          <span className={`font-bold ml-0.5 transition-transform ${isCheering ? 'scale-120' : ''}`}>
            {(counsel.cheer_count || 0)}
          </span>
        </button>

        {/* Comment toggle button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
            showComments
              ? 'bg-stone-200 text-stone-800'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>위로의 댓글</span>
          <span className="font-bold">{(counsel.comments || []).length}</span>
        </button>

      </div>

      {/* Comments Drawer / List */}
      {showComments && (
        <div className="mt-4 pt-3.5 border-t border-amber-100 space-y-3 animate-in fade-in duration-200">
          
          {/* Comments list */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {(counsel.comments || []).length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-3 bg-stone-50 rounded-xl">
                아직 위로의 한마디가 없어요. 첫 번째 따뜻한 응원을 남겨보세요 💬
              </p>
            ) : (
              (counsel.comments || []).map((comment) => (
                <div key={comment.id} className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100/70 text-xs">
                  <div className="flex items-center justify-between text-stone-500 text-[11px] mb-1">
                    <span className="font-bold text-stone-700 flex items-center gap-1">
                      <User className="w-3 h-3 text-stone-400" />
                      {comment.author}
                    </span>
                    <span>{formatRelativeTime(comment.created_at)}</span>
                  </div>
                  <p className="text-stone-800 leading-normal">{comment.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="pt-2 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold px-0.5">
              <span>작성자 아이디 / 닉네임</span>
              <span>위로 내용 ({commentText.length}/200자)</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={commentAuthor}
                onChange={(e) => setCommentAuthor(e.target.value)}
                placeholder="아이디/닉네임"
                maxLength={15}
                className="sm:w-36 px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-hidden focus:border-amber-500 bg-white"
              />
              <div className="flex-1 flex gap-1.5">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="따뜻한 조언이나 응원의 한마디를 적어주세요..."
                  maxLength={200}
                  className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-hidden focus:border-amber-500 bg-white"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors shrink-0 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>댓글 등록</span>
                </button>
              </div>
            </div>
            <p className="text-[10px] text-stone-400 px-0.5">
              💡 작성한 댓글은 Supabase의 <strong>counsel_comments</strong> 테이블에 실시간 저장됩니다.
            </p>
          </form>

        </div>
      )}

    </article>
  );
};
