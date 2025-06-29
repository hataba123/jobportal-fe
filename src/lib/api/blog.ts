import axiosInstance from "@/lib/axiosInstance";
import { Blog, BlogSearchParams, BlogResponse } from "@/types/Blog";

// Get all blogs with search, pagination, and filtering
export const getBlogs = async (params: BlogSearchParams = {}): Promise<BlogResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params.search) searchParams.append('search', params.search);
  if (params.category) searchParams.append('category', params.category);
  if (params.sort) searchParams.append('sort', params.sort);
  if (params.page) searchParams.append('page', params.page.toString());
  if (params.limit) searchParams.append('limit', params.limit.toString());

  const response = await axiosInstance.get(`/blogs?${searchParams.toString()}`);
  return response.data;
};

// Get featured blogs
export const getFeaturedBlogs = async (): Promise<Blog[]> => {
  const response = await axiosInstance.get('/blogs/featured');
  return response.data;
};

// Get blog by ID
export const getBlogById = async (id: number): Promise<Blog> => {
  const response = await axiosInstance.get(`/blogs/${id}`);
  return response.data;
};

// Get blog by slug
export const getBlogBySlug = async (slug: string): Promise<Blog> => {
  const response = await axiosInstance.get(`/blogs/slug/${slug}`);
  return response.data;
};

// Get blog categories
export const getBlogCategories = async (): Promise<{ name: string; count: number }[]> => {
  const response = await axiosInstance.get('/blogs/categories');
  return response.data;
};

// Get popular tags
export const getPopularTags = async (): Promise<string[]> => {
  const response = await axiosInstance.get('/blogs/tags');
  return response.data;
};

// Increment blog views
export const incrementBlogViews = async (id: number): Promise<void> => {
  await axiosInstance.post(`/blogs/${id}/views`);
};

// Like/Unlike blog
export const toggleBlogLike = async (id: number): Promise<{ likes: number; isLiked: boolean }> => {
  const response = await axiosInstance.post(`/blogs/${id}/like`);
  return response.data;
}; 