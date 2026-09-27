export const SQL_SNIPPETS = {
  createTable: `-- 1. counsels (익명 고민 상담소) 테이블 생성 쿼리문
-- Supabase SQL Editor에 그대로 복사하여 실행(Run)하세요.

CREATE TABLE counsels (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  student_name TEXT NOT NULL,
  content TEXT NOT NULL
);

-- 테이블 설명 및 코멘트 추가 (선택사항)
COMMENT ON TABLE counsels IS '익명 고민 상담소 게시판 테이블';
COMMENT ON COLUMN counsels.id IS '고민글 고유 번호 (자동 증가 PK)';
COMMENT ON COLUMN counsels.created_at IS '작성 시간 (기본값 현재 시각)';
COMMENT ON COLUMN counsels.student_name IS '작성자 학생 닉네임';
COMMENT ON COLUMN counsels.content IS '고민 내용 본문';`,

  insertSingle: `-- 2. 테스트용 1건 가짜 데이터 삽입 (INSERT) 쿼리문
-- id와 created_at은 기본값이 자동 입력되므로 생략 가능합니다.

INSERT INTO counsels (student_name, content)
VALUES (
  '익명의 다람쥐',
  '요즘 시험 기간인데 공부가 손에 잘 안 잡혀서 너무 불안해요 ㅠㅠ 목표 점수는 높은데 책상에만 앉으면 딴생각이 나네요. 다들 집중 어떻게 하시나요?'
);`,

  insertMultiple: `-- [추가] 다양한 카테고리의 테스트용 가짜 데이터 3건 추가
INSERT INTO counsels (student_name, content)
VALUES 
  ('새벽 감성 토끼', '친구 무리에서 저만 약간 겉도는 느낌이 들어 소외감이 들어요. 자연스럽게 다가가는 팁이 있을까요?'),
  ('꿈꾸는 고래', '부모님은 공무원을 권하시는데 저는 개발자나 디자이너 쪽으로 스타트업에 가고 싶습니다. 설득이 쉽지 않네요.'),
  ('별빛 곰돌이', '수능/내신 준비하면서 멘탈 관리가 제일 어렵네요. 스스로에게 너무 가혹해지는 것 같아 위로가 필요해요.');`,

  rlsPolicy: `-- 3. Supabase RLS (Row Level Security) 정책 설정 (필독!)
-- Supabase는 보안을 위해 RLS를 활성화하면 익명(anon) 키 사용자의 접근이 차단될 수 있습니다.
-- 익명 고민 상담소 앱에서 누구나 읽고 쓰고, '토닥토닥 힘내요' 응원 숫자를 업데이트(UPDATE)할 수 있도록 설정합니다.

-- RLS 활성화
ALTER TABLE counsels ENABLE ROW LEVEL SECURITY;

-- 1) 누구나 고민글을 조회(SELECT)할 수 있는 정책
CREATE POLICY "누구나_고민글_조회_허용"
ON counsels
FOR SELECT
TO anon, authenticated
USING (true);

-- 2) 누구나 익명으로 고민글을 작성(INSERT)할 수 있는 정책
CREATE POLICY "누구나_고민글_작성_허용"
ON counsels
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 3) '토닥토닥 힘내요' 클릭 시 숫자 증가(UPDATE) 허용 정책
CREATE POLICY "누구나_고민글_응원_수정_허용"
ON counsels
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);`,

  addCheerCountMigration: `-- [기존 테이블에 cheer_count 열 추가하기]
-- 이미 테이블을 만드셨다면 SQL Editor에서 이 쿼리를 실행하시면 '토닥토닥 힘내요' 수가 DB에 영구 저장됩니다.

ALTER TABLE counsels ADD COLUMN IF NOT EXISTS cheer_count INTEGER NOT NULL DEFAULT 0;

-- UPDATE 허용 정책 추가 (누구나 응원 버튼 클릭 시 숫자 증가 가능)
DROP POLICY IF EXISTS "누구나_고민글_응원_수정_허용" ON counsels;
CREATE POLICY "누구나_고민글_응원_수정_허용"
ON counsels FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);`,

  realtime: `-- 4. 실시간(Realtime) 구독 활성화 (선택 사항)
-- 새 고민이 등록되거나 응원 수가 올라갈 때 실시간 반영되게 하려면 실행하세요.
ALTER PUBLICATION supabase_realtime ADD TABLE counsels;`,

  addCommentTable: `-- [위로의 댓글 전용 테이블 및 RLS 설정]
-- 고민글에 달리는 위로의 댓글(작성자 아이디/이름, 댓글 내용)을 Supabase 데이터베이스에 저장합니다.
-- Supabase SQL Editor에 복사하여 [Run]을 누르세요.

CREATE TABLE IF NOT EXISTS counsel_comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  counsel_id BIGINT NOT NULL REFERENCES counsels(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 인덱스 생성 (고민글별 빠른 댓글 조회를 위해)
CREATE INDEX IF NOT EXISTS idx_counsel_comments_counsel_id ON counsel_comments(counsel_id);

-- RLS 보안 정책 활성화
ALTER TABLE counsel_comments ENABLE ROW LEVEL SECURITY;

-- 1) 누구나 댓글 조회 허용
DROP POLICY IF EXISTS "누구나_댓글_조회_허용" ON counsel_comments;
CREATE POLICY "누구나_댓글_조회_허용"
ON counsel_comments FOR SELECT
TO anon, authenticated
USING (true);

-- 2) 누구나 댓글 작성 허용
DROP POLICY IF EXISTS "누구나_댓글_작성_허용" ON counsel_comments;
CREATE POLICY "누구나_댓글_작성_허용"
ON counsel_comments FOR INSERT
TO anon, authenticated
WITH CHECK (true);`,

  allInOne: `-- [한 번에 복사해서 실행하기] 전체 SQL 스크립트 (counsels + cheer_count + counsel_comments + RLS)
-- Supabase Dashboard > SQL Editor > New query 에 붙여넣고 [Run]을 누르세요.

-- 1. 고민글 테이블 생성
CREATE TABLE IF NOT EXISTS counsels (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  student_name TEXT NOT NULL,
  content TEXT NOT NULL,
  cheer_count INTEGER NOT NULL DEFAULT 0
);

-- 혹시 기존에 생성된 테이블이라면 cheer_count 컬럼 추가
ALTER TABLE counsels ADD COLUMN IF NOT EXISTS cheer_count INTEGER NOT NULL DEFAULT 0;

-- 2. 위로의 댓글 테이블 생성 (counsel_comments)
CREATE TABLE IF NOT EXISTS counsel_comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  counsel_id BIGINT NOT NULL REFERENCES counsels(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_counsel_comments_counsel_id ON counsel_comments(counsel_id);

-- 3. RLS 보안 정책 (고민글 읽기/쓰기/응원수정 허용)
ALTER TABLE counsels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "누구나_고민글_조회_허용" ON counsels;
CREATE POLICY "누구나_고민글_조회_허용"
ON counsels FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "누구나_고민글_작성_허용" ON counsels;
CREATE POLICY "누구나_고민글_작성_허용"
ON counsels FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "누구나_고민글_응원_수정_허용" ON counsels;
CREATE POLICY "누구나_고민글_응원_수정_허용"
ON counsels FOR UPDATE TO anon, authenticated
USING (true) WITH CHECK (true);

-- 4. RLS 보안 정책 (위로의 댓글 읽기/쓰기 허용)
ALTER TABLE counsel_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "누구나_댓글_조회_허용" ON counsel_comments;
CREATE POLICY "누구나_댓글_조회_허용"
ON counsel_comments FOR SELECT TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "누구나_댓글_작성_허용" ON counsel_comments;
CREATE POLICY "누구나_댓글_작성_허용"
ON counsel_comments FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- 5. 테스트용 1건 가짜 데이터 삽입
INSERT INTO counsels (student_name, content, cheer_count)
VALUES (
  '익명의 다람쥐',
  '요즘 시험 기간인데 공부가 손에 잘 안 잡혀서 너무 불안해요 ㅠㅠ 목표 점수는 높은데 책상에만 앉으면 딴생각이 나네요. 다들 집중 어떻게 하시나요?',
  3
);

-- 6. 테스트용 1건 가짜 댓글 데이터 삽입
INSERT INTO counsel_comments (counsel_id, author, content)
VALUES (
  1,
  '따뜻한 라떼',
  '조급해하지 말고 25분 집중, 5분 휴식 타이머를 한번 써보세요! 충분히 잘해낼 수 있어요.'
);

-- 데이터 확인
SELECT * FROM counsels ORDER BY created_at DESC;`
};
