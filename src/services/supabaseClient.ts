import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Counsel, CounselComment, SupabaseConfig } from '../types/counsel';

const CONFIG_STORAGE_KEY = 'counsels_app_supabase_config';
const LOCAL_POSTS_STORAGE_KEY = 'counsels_app_local_posts';
const LOCAL_META_STORAGE_KEY = 'counsels_app_posts_meta';

// Default connection from build-time env vars (e.g. Vercel Environment Variables),
// so every visitor connects without entering the settings manually.
const ENV_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL ?? '').trim();
const ENV_SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim();

// Initial mock data if no local data exists yet
const INITIAL_MOCK_COUNSELS: Counsel[] = [
  {
    id: 1,
    student_name: '익명의 다람쥐',
    content: '요즘 시험 기간인데 공부가 손에 잘 안 잡혀서 너무 불안해요 ㅠㅠ 목표 점수는 높은데 책상에만 앉으면 졸리고 다른 생각만 납니다. 다들 슬럼프 올 때 어떻게 극복하시나요?',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    category: '학업/시험',
    cheer_count: 14,
    comments: [
      {
        id: 'c1',
        author: '따뜻한 라떼',
        content: '너무 조급해하지 말고 25분 집중하고 5분 쉬는 뽀모도로 타이머 써보세요! 저도 효과 많이 봤어요.',
        created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: 'c2',
        author: '지나가던 수험생',
        content: '불안한 건 그만큼 잘해내고 싶다는 증거예요. 오늘 하루도 고생 많았어요!',
        created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      }
    ]
  },
  {
    id: 2,
    student_name: '새벽 감성 토끼',
    content: '친구 무리에서 저만 약간 겉도는 느낌이 들어요. 같이 밥 먹고 대화도 하지만, 단톡방에서 다른 친구들끼리만 아는 이야기할 때 소외감이 밀려오네요. 먼저 물어봐야 할까요?',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    category: '교우관계',
    cheer_count: 22,
    comments: [
      {
        id: 'c3',
        author: '토닥토닥 고양이',
        content: '인간관계에서 소외감 느끼면 정말 외롭죠.. 하지만 내가 부족해서가 아니에요. 자연스럽게 "그거 무슨 얘기야? 나도 알려줘!"하고 가볍게 다가가 봐도 좋아요.',
        created_at: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
      }
    ]
  },
  {
    id: 3,
    student_name: '꿈꾸는 고래',
    content: '부모님은 안정적인 공무원이나 교사가 되길 원하시는데, 저는 코딩이랑 디자인 쪽으로 스타트업에 가고 싶어요. 어떻게 부모님을 설득해야 할지 막막합니다.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    category: '진로/미래',
    cheer_count: 31,
    comments: [
      {
        id: 'c4',
        author: '취준 멘토',
        content: '내가 만든 포트폴리오나 관심 분야에 대한 구체적인 로드맵을 정리해서 보여드리면 부모님도 진정성을 느끼실 거예요. 응원합니다!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      }
    ]
  }
];

class SupabaseService {
  private client: SupabaseClient | null = null;
  private config: SupabaseConfig = {
    url: '',
    anonKey: '',
    isConnected: false,
  };

  constructor() {
    this.loadConfig();
  }

  public getConfig(): SupabaseConfig {
    return { ...this.config };
  }

  public loadConfig(): void {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.url && parsed.anonKey) {
          this.config = {
            url: parsed.url,
            anonKey: parsed.anonKey,
            isConnected: true,
          };
          this.client = createClient(parsed.url, parsed.anonKey);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load Supabase config:', e);
    }
    this.useEnvConfig();
  }

  private useEnvConfig(): void {
    if (ENV_SUPABASE_URL && ENV_SUPABASE_ANON_KEY) {
      this.config = {
        url: ENV_SUPABASE_URL,
        anonKey: ENV_SUPABASE_ANON_KEY,
        isConnected: true,
      };
      this.client = createClient(ENV_SUPABASE_URL, ENV_SUPABASE_ANON_KEY);
    }
  }

  public setConfig(url: string, anonKey: string): void {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();

    if (trimmedUrl && trimmedKey) {
      this.config = {
        url: trimmedUrl,
        anonKey: trimmedKey,
        isConnected: true,
      };
      this.client = createClient(trimmedUrl, trimmedKey);
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
    } else {
      this.config = {
        url: '',
        anonKey: '',
        isConnected: false,
      };
      this.client = null;
      localStorage.removeItem(CONFIG_STORAGE_KEY);
      this.useEnvConfig();
    }
  }

  public async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.client) {
      return { success: false, message: 'Supabase URL과 Anon Key를 먼저 입력해주세요.' };
    }

    try {
      // Try to select 1 item from counsels table
      const { data, error } = await this.client
        .from('counsels')
        .select('id')
        .limit(1);

      if (error) {
        return {
          success: false,
          message: `테이블 조회 오류: ${error.message} (counsels 테이블이 생성되었는지, RLS SELECT 정책이 허용되었는지 확인해주세요)`,
        };
      }

      return {
        success: true,
        message: 'Supabase 연결 성공! counsels 테이블과 성공적으로 통신할 수 있습니다.',
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `연결 실패: ${errMsg}`,
      };
    }
  }

  // Fetch counsels
  public async getCounsels(): Promise<Counsel[]> {
    // If Supabase is connected
    if (this.client) {
      try {
        // 1. Fetch comments from Supabase if counsel_comments table exists
        let supabaseCommentsByCounselId: Record<number, CounselComment[]> = {};
        try {
          const { data: commentsData, error: commentsErr } = await this.client
            .from('counsel_comments')
            .select('id, counsel_id, author, content, created_at')
            .order('created_at', { ascending: true });

          if (!commentsErr && commentsData) {
            commentsData.forEach((c: any) => {
              const cid = Number(c.counsel_id);
              if (!supabaseCommentsByCounselId[cid]) {
                supabaseCommentsByCounselId[cid] = [];
              }
              supabaseCommentsByCounselId[cid].push({
                id: String(c.id),
                counsel_id: cid,
                author: c.author,
                content: c.content,
                created_at: c.created_at,
              });
            });
          }
        } catch (cErr) {
          console.warn('counsel_comments table not queried or not yet created:', cErr);
        }

        // 2. Fetch counsels from Supabase (with cheer_count)
        const { data, error } = await this.client
          .from('counsels')
          .select('id, created_at, student_name, content, cheer_count')
          .order('created_at', { ascending: false });

        if (error) {
          // If cheer_count column not added yet, fallback to selecting without cheer_count
          console.warn('Selecting with cheer_count failed, falling back to 4 base columns:', error.message);
          const fallbackRes = await this.client
            .from('counsels')
            .select('id, created_at, student_name, content')
            .order('created_at', { ascending: false });

          if (fallbackRes.error) {
            throw fallbackRes.error;
          }

          const localMeta = this.getLocalMetadata();
          return (fallbackRes.data || []).map((item) => {
            const meta = localMeta[item.id] || {};
            const dbComments = supabaseCommentsByCounselId[item.id];
            return {
              id: item.id,
              created_at: item.created_at,
              student_name: item.student_name,
              content: item.content,
              category: meta.category || '기타',
              cheer_count: meta.cheer_count || 0,
              comments: dbComments && dbComments.length > 0 ? dbComments : (meta.comments || []),
            };
          });
        }

        // Successfully loaded from Supabase with cheer_count column!
        const localMeta = this.getLocalMetadata();
        return (data || []).map((item: any) => {
          const meta = localMeta[item.id] || {};
          const cheerCount = item.cheer_count !== null && item.cheer_count !== undefined
            ? Number(item.cheer_count)
            : (meta.cheer_count || 0);

          const dbComments = supabaseCommentsByCounselId[item.id];
          return {
            id: item.id,
            created_at: item.created_at,
            student_name: item.student_name,
            content: item.content,
            category: meta.category || '기타',
            cheer_count: cheerCount,
            comments: dbComments && dbComments.length > 0 ? dbComments : (meta.comments || []),
          };
        });
      } catch (err) {
        console.warn('Falling back to local data due to Supabase error:', err);
      }
    }

    // Local fallback
    return this.getLocalCounsels();
  }

  // Create counsel
  public async createCounsel(
    student_name: string,
    content: string,
    category: Counsel['category'] = '기타'
  ): Promise<Counsel> {
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('counsels')
          .insert([{ student_name, content }])
          .select('id, created_at, student_name, content')
          .single();

        if (error) {
          throw error;
        }

        const newCounsel: Counsel = {
          id: data.id,
          created_at: data.created_at,
          student_name: data.student_name,
          content: data.content,
          category,
          cheer_count: 0,
          comments: [],
        };

        // Save local meta for category
        this.updateLocalMeta(data.id, { category, cheer_count: 0, comments: [] });

        return newCounsel;
      } catch (err) {
        console.error('Supabase insert failed, saving locally:', err);
      }
    }

    // Local fallback creation
    const current = this.getLocalCounsels();
    const nextId = current.length > 0 ? Math.max(...current.map((c) => c.id)) + 1 : 1;
    const newCounsel: Counsel = {
      id: nextId,
      created_at: new Date().toISOString(),
      student_name,
      content,
      category,
      cheer_count: 0,
      comments: [],
    };

    const updated = [newCounsel, ...current];
    this.saveLocalCounsels(updated);
    return newCounsel;
  }

  // Delete counsel
  public async deleteCounsel(id: number): Promise<boolean> {
    if (this.client) {
      try {
        const { error } = await this.client.from('counsels').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase delete error:', err);
      }
    }

    const current = this.getLocalCounsels();
    const updated = current.filter((c) => c.id !== id);
    this.saveLocalCounsels(updated);
    return true;
  }

  // Empathy Cheer
  public async addCheer(counselId: number): Promise<number> {
    const meta = this.getLocalMetadata();
    const postMeta = meta[counselId] || {};
    const newCount = (postMeta.cheer_count || 0) + 1;
    this.updateLocalMeta(counselId, { cheer_count: newCount });

    // Also update local counsels list
    const current = this.getLocalCounsels();
    const updated = current.map((c) => (c.id === counselId ? { ...c, cheer_count: newCount } : c));
    this.saveLocalCounsels(updated);

    // If Supabase is connected, attempt to update cheer_count in counsels table or call RPC
    if (this.client) {
      try {
        // Try direct column update if cheer_count column exists
        const { error } = await this.client
          .from('counsels')
          .update({ cheer_count: newCount })
          .eq('id', counselId);

        if (error) {
          console.warn('Supabase cheer_count update note:', error.message);
        }
      } catch (err) {
        console.warn('Supabase DB update failed (will remain in client state):', err);
      }
    }

    return newCount;
  }

  // Add Comment (saves to Supabase counsel_comments table if available, with local backup)
  public async addComment(counselId: number, author: string, text: string): Promise<CounselComment> {
    const trimmedAuthor = author.trim() || '익명의 친구';
    const trimmedText = text.trim();

    // 1. If Supabase is connected, try saving to DB
    if (this.client) {
      try {
        const { data, error } = await this.client
          .from('counsel_comments')
          .insert([
            {
              counsel_id: counselId,
              author: trimmedAuthor,
              content: trimmedText,
            },
          ])
          .select('id, counsel_id, author, content, created_at')
          .single();

        if (!error && data) {
          const dbComment: CounselComment = {
            id: String(data.id),
            counsel_id: Number(data.counsel_id),
            author: data.author,
            content: data.content,
            created_at: data.created_at,
          };

          // Also backup in local meta
          const meta = this.getLocalMetadata();
          const postMeta = meta[counselId] || {};
          const comments = [...(postMeta.comments || []), dbComment];
          this.updateLocalMeta(counselId, { comments });

          return dbComment;
        } else if (error) {
          console.warn('Supabase counsel_comments insert error:', error.message);
        }
      } catch (err) {
        console.warn('Supabase comment insert failed, saving locally:', err);
      }
    }

    // 2. Fallback to local storage
    const newComment: CounselComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      counsel_id: counselId,
      author: trimmedAuthor,
      content: trimmedText,
      created_at: new Date().toISOString(),
    };

    const meta = this.getLocalMetadata();
    const postMeta = meta[counselId] || {};
    const comments = [...(postMeta.comments || []), newComment];
    this.updateLocalMeta(counselId, { comments });

    // Also update local counsels list
    const current = this.getLocalCounsels();
    const updated = current.map((c) => (c.id === counselId ? { ...c, comments } : c));
    this.saveLocalCounsels(updated);

    return newComment;
  }

  // Reset to initial mock data
  public resetToSampleData(): Counsel[] {
    localStorage.removeItem(LOCAL_POSTS_STORAGE_KEY);
    localStorage.removeItem(LOCAL_META_STORAGE_KEY);
    return [...INITIAL_MOCK_COUNSELS];
  }

  // --- Local storage helpers ---
  private getLocalCounsels(): Counsel[] {
    try {
      const data = localStorage.getItem(LOCAL_POSTS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(LOCAL_POSTS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_COUNSELS));
        return [...INITIAL_MOCK_COUNSELS];
      }
      return JSON.parse(data);
    } catch {
      return [...INITIAL_MOCK_COUNSELS];
    }
  }

  private saveLocalCounsels(items: Counsel[]): void {
    try {
      localStorage.setItem(LOCAL_POSTS_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  private getLocalMetadata(): Record<number, Partial<Counsel>> {
    try {
      const data = localStorage.getItem(LOCAL_META_STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private updateLocalMeta(id: number, metaPatch: Partial<Counsel>): void {
    try {
      const allMeta = this.getLocalMetadata();
      allMeta[id] = { ...(allMeta[id] || {}), ...metaPatch };
      localStorage.setItem(LOCAL_META_STORAGE_KEY, JSON.stringify(allMeta));
    } catch (e) {
      console.error('Failed to save metadata:', e);
    }
  }
}

export const supabaseService = new SupabaseService();
