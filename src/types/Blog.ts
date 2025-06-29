export interface Blog {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  views: number;
  likes: number;
  featured: boolean;
  image: string;
  slug?: string;
}

export interface BlogSearchParams {
  search?: string;
  category?: string;
  sort?: 'newest' | 'popular' | 'trending';
  page?: number;
  limit?: number;
}

export interface BlogResponse {
  blogs: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 