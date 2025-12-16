import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePropertyRequest } from "../api/properties";
import { propertiesApi } from "../api/properties";

export const useProperties = (filters?: {
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
    queryKey: ["properties", filters],
    queryFn: () => propertiesApi.getAll(filters).then((res) => res.data),
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => propertiesApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (property: CreatePropertyRequest) =>
      propertiesApi.create(property).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      property,
    }: {
      id: string;
      property: Partial<CreatePropertyRequest>;
    }) => propertiesApi.update(id, property).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["property", id] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
};
