import { useState, useEffect } from 'react';
import { Blog, BlogSearchParams, BlogResponse } from '@/types/Blog';
import { 
  getBlogs, 
  getFeaturedBlogs, 
  getBlogCategories, 
  getPopularTags 
} from '@/lib/api/blog';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [popularTags, setPopularTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchBlogs = async (params: BlogSearchParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: BlogResponse = await getBlogs({
        page: pagination.page,
        limit: pagination.limit,
        ...params,
      });
      
      setBlogs(response.blogs);
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedBlogs = async () => {
    try {
      const featured = await getFeaturedBlogs();
      setFeaturedBlogs(featured);
    } catch (err) {
      console.error('Failed to fetch featured blogs:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await getBlogCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const tags = await getPopularTags();
      setPopularTags(tags);
    } catch (err) {
      console.error('Failed to fetch popular tags:', err);
    }
  };

  const searchBlogs = (searchTerm: string) => {
    fetchBlogs({ search: searchTerm, page: 1 });
  };

  const filterByCategory = (category: string) => {
    fetchBlogs({ category, page: 1 });
  };

  const sortBlogs = (sort: 'newest' | 'popular' | 'trending') => {
    fetchBlogs({ sort, page: 1 });
  };

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchBlogs({ page: pagination.page + 1 });
    }
  };

  const goToPage = (page: number) => {
    fetchBlogs({ page });
  };

  useEffect(() => {
    fetchBlogs();
    fetchFeaturedBlogs();
    fetchCategories();
    fetchPopularTags();
  }, []);

  return {
    blogs,
    featuredBlogs,
    categories,
    popularTags,
    loading,
    error,
    pagination,
    searchBlogs,
    filterByCategory,
    sortBlogs,
    loadMore,
    goToPage,
    refetch: () => fetchBlogs(),
  };
}; 