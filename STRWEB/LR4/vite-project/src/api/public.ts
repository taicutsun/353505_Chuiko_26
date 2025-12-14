import api from "./index";

export interface PublicClient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicEmployee {
  _id: string;
  name: string;
  email: string;
  position: string;
  department: string;
  phone: string;
  hireDate: string;
  salary: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicProperty {
  _id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicNews {
  _id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  tags: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ClientsResponse {
  clients: PublicClient[];
  pagination: PaginationInfo;
}

export interface EmployeesResponse {
  employees: PublicEmployee[];
  pagination: PaginationInfo;
}

export interface PropertiesResponse {
  properties: PublicProperty[];
  pagination: PaginationInfo;
}

export interface NewsResponse {
  news: PublicNews[];
  pagination: PaginationInfo;
}

export const publicApi = {
  // Public clients endpoint
  getClients: (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) =>
    api.get<ClientsResponse>("/public/clients", {
      params,
    }),

  // Public employees endpoint
  getEmployees: (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) =>
    api.get<EmployeesResponse>("/public/employees", {
      params,
    }),

  // Public properties endpoint
  getProperties: (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
  }) =>
    api.get<PropertiesResponse>("/public/properties", {
      params,
    }),

  // Public news endpoint (only published news)
  getNews: (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    category?: string;
  }) =>
    api.get<NewsResponse>("/public/news", {
      params,
    }),
};
