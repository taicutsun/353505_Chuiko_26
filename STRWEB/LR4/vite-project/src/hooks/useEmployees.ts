import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateEmployeeRequest } from "../api/employees";
import { employeesApi } from "../api/employees";

export const useEmployees = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: () => employeesApi.getAll().then((res) => res.data),
  });
};

export const useEmployee = (id: string) => {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => employeesApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee: CreateEmployeeRequest) =>
      employeesApi.create(employee).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      employee,
    }: {
      id: string;
      employee: Partial<CreateEmployeeRequest>;
    }) => employeesApi.update(id, employee).then((res) => res.data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee", id] });
    },
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};
