export interface Counsel {
  id: number;
  created_at: string;
  student_name: string;
  content: string;
  // Extra client enhancements (stored in local metadata or calculated)
  category?: '학업/시험' | '진로/미래' | '교우관계' | '가족/가정' | '연애/짝사랑' | '기타';
  cheer_count?: number;
  comments?: CounselComment[];
}

export interface CounselComment {
  id: string;
  counsel_id?: number;
  author: string;
  content: string;
  created_at: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}
