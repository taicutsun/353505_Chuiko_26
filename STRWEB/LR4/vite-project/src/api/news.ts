import api from "./index";

export interface News {
  _id: string;
  title: string;
  content: string;
  summary: string;
  category: "general" | "property" | "company" | "market" | "announcement";
  author: string;
  image?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNewsRequest {
  title: string;
  content: string;
  summary: string;
  category: "general" | "property" | "company" | "market" | "announcement";
  author: string;
  image?: string;
  tags?: string[];
  isPublished?: boolean;
}

export const newsApi = {
  getAll: (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    category?: string;
    isPublished?: boolean;
  }) => api.get("/news", { params }),

  getById: (id: string) => api.get(`/news/${id}`),

  create: (data: CreateNewsRequest) => api.post<News>("/news", data),

  update: (id: string, data: Partial<CreateNewsRequest>) =>
    api.put<News>(`/news/${id}`, data),

  delete: (id: string) => api.delete(`/news/${id}`),
};
