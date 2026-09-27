import React from 'react';
import { Database, Code2, PenLine, Sparkles, Settings2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SupabaseConfig } from '../types/counsel';

interface HeaderProps {
  config: SupabaseConfig;
  onOpenSqlModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenNewCounselModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onOpenSqlModal,
  onOpenSettingsModal,
  onOpenNewCounselModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-300 to-rose-300 flex items-center justify-center text-xl shadow-inner shadow-white/40">
            🌱
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-stone-900 text-lg sm:text-xl tracking-tight">
                익명 고민 상담소
              </h1>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              말하지 못했던 마음 속 고민을 안전하고 따뜻하게 털어놓는 공간
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Write New Post Button */}
          <button
            onClick={onOpenNewCounselModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm shadow-orange-200 active:scale-95 transition-all"
          >
            <PenLine className="w-4 h-4" />
            <span>고민 털어놓기</span>
          </button>
        </div>
      </div>
    </header>
  );
};
