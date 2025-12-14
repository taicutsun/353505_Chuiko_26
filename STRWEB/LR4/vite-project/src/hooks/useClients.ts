import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateClientRequest } from "../api/clients";
import { clientsApi } from "../api/clients";

export const useClients = (params?: {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () => clientsApi.getAll(params).then((res) => res.data),
  });
};

export const useClient = (id: string) => {
  return useQuery({
    queryKey: ["client", id],
    queryFn: () => clientsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (client: CreateClientRequest) =>
      clientsApi.create(client).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      client,
    }: {
      id: string;
      client: Partial<CreateClientRequest>;
    }) => clientsApi.update(id, client).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", id] });
    },
  });
};

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
