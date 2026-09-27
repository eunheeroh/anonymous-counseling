import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, ShieldCheck, Database, Layers, Sparkles } from 'lucide-react';
import { SQL_SNIPPETS } from '../data/sqlSnippets';

interface SqlGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlGuideModal: React.FC<SqlGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'create' | 'insert' | 'cheer' | 'comments' | 'rls' | 'code'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base sm:text-lg flex items-center gap-2">
                Supabase SQL 에디터 복사용 쿼리문
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                  SQL Editor 지원
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                요청하신 4개 열(id, created_at, student_name, content) 기반 생성 및 테스트 쿼리
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 sm:px-5 pt-3 border-b border-stone-200 overflow-x-auto text-xs font-semibold bg-stone-50/40">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'border-amber-500 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            전체 통합 실행 (추천)
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'border-amber-500 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            1. CREATE TABLE
          </button>
          <button
            onClick={() => setActiveTab('insert')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'insert'
                ? 'border-amber-500 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            2. INSERT 가짜 데이터
          </button>
          <button
            onClick={() => setActiveTab('cheer')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'cheer'
                ? 'border-rose-500 text-rose-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span className="text-rose-500">❤️</span>
            3. '토닥토닥' 컬럼
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-orange-500 text-orange-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <span className="text-orange-500">💬</span>
            4. '위로의 댓글' 테이블
          </button>
          <button
            onClick={() => setActiveTab('rls')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'rls'
                ? 'border-amber-500 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            5. RLS 보안 정책
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-amber-500 text-amber-900 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            React 연동 코드 예시
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {/* Columns Specifications Table */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4">
            <h3 className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5">
              <span>📋</span> counsels 테이블 컬럼(열) 구성
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="font-mono font-bold text-amber-800">id</span>
                <span className="block text-[11px] text-stone-500">BIGINT (PK)</span>
                <p className="text-[11px] text-stone-700 mt-1">고유번호 (자동 증가)</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="font-mono font-bold text-amber-800">created_at</span>
                <span className="block text-[11px] text-stone-500">TIMESTAMPTZ</span>
                <p className="text-[11px] text-stone-700 mt-1">작성시간 (DEFAULT NOW())</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="font-mono font-bold text-amber-800">student_name</span>
                <span className="block text-[11px] text-stone-500">TEXT (NOT NULL)</span>
                <p className="text-[11px] text-stone-700 mt-1">학생 닉네임 / 이름</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-2xs">
                <span className="font-mono font-bold text-amber-800">content</span>
                <span className="block text-[11px] text-stone-500">TEXT (NOT NULL)</span>
                <p className="text-[11px] text-stone-700 mt-1">고민 내용 본문</p>
              </div>
              <div className="bg-rose-50/70 p-2.5 rounded-xl border border-rose-200 shadow-2xs col-span-2 sm:col-span-1">
                <span className="font-mono font-bold text-rose-800">cheer_count</span>
                <span className="block text-[11px] text-rose-600">INTEGER (DEFAULT 0)</span>
                <p className="text-[11px] text-rose-800 mt-1">토닥토닥 힘내요 응원수</p>
              </div>
            </div>
          </div>

          {/* Active Tab View */}
          {activeTab === 'all' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600 font-medium">
                  Supabase 대시보드 <strong>SQL Editor</strong>에서 새 쿼리를 열고 바로 실행하시면 테이블 생성, RLS 권한 부여, 1건 테스트 데이터가 한 번에 완성됩니다!
                </p>
                <button
                  onClick={() => handleCopy(SQL_SNIPPETS.allInOne, 'all')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-xs transition-colors shrink-0 ml-3"
                >
                  {copiedKey === 'all' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>전체 복사</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
                <code>{SQL_SNIPPETS.allInOne}</code>
              </pre>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  <strong>counsels 테이블 생성 쿼리</strong>입니다. id는 identity로 자동 채번되며, created_at은 현재 시간이 기본으로 기록됩니다.
                </p>
                <button
                  onClick={() => handleCopy(SQL_SNIPPETS.createTable, 'create')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shrink-0 ml-3"
                >
                  {copiedKey === 'create' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'create' ? '복사 완료' : '쿼리 복사'}</span>
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
                <code>{SQL_SNIPPETS.createTable}</code>
              </pre>
            </div>
          )}

          {activeTab === 'insert' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  <strong>테스트용 1건 가짜 데이터 삽입</strong> 쿼리입니다. 고유번호(id)와 작성시간(created_at)은 자동으로 생성되므로 student_name과 content만 전달합니다.
                </p>
                <button
                  onClick={() => handleCopy(SQL_SNIPPETS.insertSingle, 'insert')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shrink-0 ml-3"
                >
                  {copiedKey === 'insert' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'insert' ? '복사 완료' : 'INSERT 쿼리 복사'}</span>
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
                <code>{SQL_SNIPPETS.insertSingle}</code>
              </pre>

              <div className="mt-4 pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-700">다양한 고민 가짜 데이터 3건 추가 버전 (옵션)</span>
                  <button
                    onClick={() => handleCopy(SQL_SNIPPETS.insertMultiple, 'insertMulti')}
                    className="flex items-center gap-1 text-xs text-amber-700 font-bold hover:underline"
                  >
                    {copiedKey === 'insertMulti' ? '복사됨' : '복사'}
                  </button>
                </div>
                <pre className="p-3 bg-stone-100 text-stone-800 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
                  <code>{SQL_SNIPPETS.insertMultiple}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'cheer' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-relaxed">
                <strong>💡 기존 데이터베이스에 '토닥토닥 힘내요' 응원 숫자 반영하기:</strong><br />
                기존에 생성해둔 <code>counsels</code> 테이블에 <code>cheer_count</code> 컬럼을 추가하고 누구나 클릭 시 숫자를 증가(UPDATE)할 수 있도록 허용하는 쿼리입니다. Supabase SQL Editor에 복사하여 실행해 주세요.
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  <strong>cheer_count 컬럼 추가 및 UPDATE 권한 허용 쿼리</strong>
                </p>
                <button
                  onClick={() => handleCopy(SQL_SNIPPETS.addCheerCountMigration, 'cheerMigrate')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shrink-0 ml-3"
                >
                  {copiedKey === 'cheerMigrate' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'cheerMigrate' ? '복사 완료' : 'ALTER TABLE 쿼리 복사'}</span>
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
                <code>{SQL_SNIPPETS.addCheerCountMigration}</code>
              </pre>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-3">
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-950 leading-relaxed">
                <strong>💬 '위로의 댓글' Supabase 데이터베이스 저장 설정:</strong><br />
                고민글 카드에서 작성한 아이디(<code>author</code>)와 위로 댓글 내용(<code>content</code>)을 실시간 저장하는 <code>counsel_comments</code> 테이블 생성 및 RLS 정책 SQL입니다.
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600">
                  <strong>counsel_comments 테이블 생성 & RLS 허용 쿼리</strong>
                </p>
                <button
                  onClick={() => handleCopy(SQL_SNIPPETS.addCommentTable, 'commentTable')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 transition-colors shrink-0 ml-3"
                >
                  {copiedKey === 'commentTable' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'commentTable' ? '복사 완료' : '댓글 테이블 SQL 복사'}</span>
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
                <code>{SQL_SNIPPETS.addCommentTable}</code>
              </pre>
            </div>
          )}

          {activeTab === 'rls' && (
            <div className="space-y-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-relaxed">
                <strong>⚠️ Supabase RLS 주의사항:</strong> Supabase는 기본적으로 Row Level Security(RLS)가 켜지면 익명(anon key) 접근이 모두 차단됩니다. 익명 상담소 앱이 정상적으로 조회(SELECT) 및 글 작성(INSERT)을 할 수 있도록 아래 보안 정책을 반드시 함께 실행해 주어야 합니다.
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">RLS 활성화 및 익명 권한 부여 쿼리</span>
                <button
                  onClick={() => handleCopy(SQL_SNIPPETS.rlsPolicy, 'rls')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors"
                >
                  {copiedKey === 'rls' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'rls' ? '복사 완료' : 'RLS 정책 복사'}</span>
                </button>
              </div>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
                <code>{SQL_SNIPPETS.rlsPolicy}</code>
              </pre>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                프론트엔드 React/TypeScript에서 <code>@supabase/supabase-js</code>를 활용해 글을 불러오고 작성하는 기본 코드입니다.
              </p>
              <pre className="p-4 bg-stone-900 text-stone-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
                <code>{`import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);

// 1. 고민 목록 불러오기
export async function getCounsels() {
  const { data, error } = await supabase
    .from('counsels')
    .select('id, created_at, student_name, content')
    .order('created_at', { ascending: false });
  return data;
}

// 2. 익명 고민 작성하기
export async function postCounsel(studentName: string, content: string) {
  const { data, error } = await supabase
    .from('counsels')
    .insert([{ student_name: studentName, content }])
    .select();
  return data;
}`}</code>
              </pre>
            </div>
          )}

          {/* Quick instructions */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 text-stone-600">
            <h4 className="font-bold text-stone-800 flex items-center gap-1.5">
              <span>🚀</span> Supabase 적용 3단계 순서
            </h4>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] sm:text-xs">
              <li>Supabase 대시보드 로그인 후 프로젝트로 들어갑니다.</li>
              <li>좌측 사이드바에서 <strong>SQL Editor</strong> 메뉴를 누르고 <strong>New query</strong>를 클릭합니다.</li>
              <li>위의 <strong>[전체 통합 실행]</strong> 코드를 붙여넣고 우측 하단 <strong>Run</strong> 버튼을 누르면 즉시 완료됩니다!</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/80 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            💡 상단의 <strong>[설정]</strong> 메뉴에서 Supabase URL과 Key를 입력해 이 앱과 실시간 연동할 수도 있습니다.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-900 text-white transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
