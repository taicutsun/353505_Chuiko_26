import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateNewsRequest } from "../api/news";
import { newsApi } from "../api/news";

export const useNews = (filters?: {
  category?: string;
  isPublished?: boolean;
}) => {
  return useQuery({
    queryKey: ["news", filters],
    queryFn: () => newsApi.getAll(filters).then((res) => res.data),
  });
};

export const useNewsItem = (id: string) => {
  return useQuery({
    queryKey: ["newsItem", id],
    queryFn: () => newsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (news: CreateNewsRequest) =>
      newsApi.create(news).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useUpdateNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      news,
    }: {
      id: string;
      news: Partial<CreateNewsRequest>;
    }) => newsApi.update(id, news).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
      queryClient.invalidateQueries({ queryKey: ["newsItem", id] });
    },
  });
};

export const useDeleteNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => newsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};
