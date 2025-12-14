import api from "./index";

export interface Employee {
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

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  position: string;
  department: string;
  phone: string;
  hireDate: string;
  salary: number;
  isActive?: boolean;
}

export const employeesApi = {
  getAll: (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
  }) => api.get("/employees", { params }),

  getById: (id: string) => api.get(`/employees/${id}`),

  create: (data: CreateEmployeeRequest) =>
    api.post<Employee>("/employees", data),

  update: (id: string, data: Partial<CreateEmployeeRequest>) =>
    api.put<Employee>(`/employees/${id}`, data),

  delete: (id: string) => api.delete(`/employees/${id}`),
};
