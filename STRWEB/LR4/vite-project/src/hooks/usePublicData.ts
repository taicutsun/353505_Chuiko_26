import { useQuery } from "@tanstack/react-query";
import { publicApi } from "../api/public";

export const usePublicClients = (params?: {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["public-clients", params],
    queryFn: () => publicApi.getClients(params).then((res) => res.data),
    staleTime: 60000, // Cache for 1 minute
  });
};

export const usePublicEmployees = (params?: {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["public-employees", params],
    queryFn: () => publicApi.getEmployees(params).then((res) => res.data),
    staleTime: 60000,
  });
};

export const usePublicProperties = (params?: {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  return useQuery({
    queryKey: ["public-properties", params],
    queryFn: () => publicApi.getProperties(params).then((res) => res.data),
    staleTime: 60000,
  });
};

export const usePublicNews = (params?: {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  category?: string;
}) => {
  return useQuery({
    queryKey: ["public-news", params],
    queryFn: () => publicApi.getNews(params).then((res) => res.data),
    staleTime: 60000,
  });
};
