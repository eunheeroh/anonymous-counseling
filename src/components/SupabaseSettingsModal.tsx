import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Globe, ExternalLink, HelpCircle } from 'lucide-react';
import { SupabaseConfig } from '../types/counsel';
import { supabaseService } from '../services/supabaseClient';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SupabaseConfig;
  onConfigUpdated: () => void;
  onOpenSqlGuide: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onConfigUpdated,
  onOpenSqlGuide,
}) => {
  const [url, setUrl] = useState(config.url || '');
  const [anonKey, setAnonKey] = useState(config.anonKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveAndTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    supabaseService.setConfig(url, anonKey);
    const result = await supabaseService.testConnection();
    setTestResult(result);
    setIsTesting(false);
    onConfigUpdated();
  };

  const handleResetToLocal = () => {
    setUrl('');
    setAnonKey('');
    supabaseService.setConfig('', '');
    setTestResult({
      success: true,
      message: '로컬 시뮬레이션 모드로 전환되었습니다. 브라우저 내에서 안전하게 테스트할 수 있습니다.',
    });
    onConfigUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base sm:text-lg">
                Supabase 연동 설정
              </h2>
              <p className="text-xs text-stone-500">
                내 Supabase 데이터베이스와 실시간으로 연결합니다
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
        <form onSubmit={handleSaveAndTest} className="p-5 sm:p-6 space-y-4 text-xs">
          
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-800 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                Supabase 키 확인 위치
              </span>
              <button
                type="button"
                onClick={onOpenSqlGuide}
                className="text-amber-700 font-bold hover:underline"
              >
                테이블 생성 SQL 보기 &rarr;
              </button>
            </div>
            <p className="text-stone-600 leading-relaxed text-[11px]">
              Supabase 콘솔 &gt; <strong>Project Settings</strong> &gt; <strong>Data API (또는 API Keys)</strong>에서 <strong>Project URL</strong>과 <strong>anon public</strong> 키를 복사해 붙여넣으세요.
            </p>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              Project URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://abcdefghijklmn.supabase.co"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 font-mono text-xs text-stone-800"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-stone-500" />
              Anon (Public) Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 font-mono text-xs text-stone-800"
            />
          </div>

          {/* Test connection result notice */}
          {testResult && (
            <div
              className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold text-xs">{testResult.success ? '연결 성공' : '연결 확인 필요'}</p>
                <p className="text-[11px] leading-relaxed">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="submit"
              disabled={isTesting || !url || !anonKey}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  연결 확인 중...
                </>
              ) : (
                <>
                  <Database className="w-3.5 h-3.5" />
                  저장 및 Supabase 연결 테스트
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleResetToLocal}
              className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              로컬 모드로 전환
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="px-5 py-3.5 bg-stone-50/90 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
          <span>입력하신 키는 브라우저 로컬 저장소에만 안전하게 보관됩니다.</span>
          <button onClick={onClose} className="font-bold text-stone-700 hover:text-stone-900">
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
