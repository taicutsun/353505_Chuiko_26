import api from "./index";

export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const clientsApi = {
  getAll: (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => api.get("/clients", { params }),

  getById: (id: string) => api.get(`/clients/${id}`),

  create: (data: CreateClientRequest) => api.post<Client>("/clients", data),

  update: (id: string, data: Partial<CreateClientRequest>) =>
    api.put<Client>(`/clients/${id}`, data),

  delete: (id: string) => api.delete(`/clients/${id}`),
};
