import api from "./index";

export interface Property {
  _id: string;
  title: string;
  description: string;
  type: "apartment" | "house" | "villa" | "commercial" | "land";
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
  status: "available" | "sold" | "rented" | "pending";
  images: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  type: "apartment" | "house" | "villa" | "commercial" | "land";
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
  status?: "available" | "sold" | "rented" | "pending";
  images?: string[];
  isAvailable?: boolean;
}

export const propertiesApi = {
  getAll: (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => api.get<Property[]>("/properties", { params }),

  getById: (id: string) => api.get<Property>(`/properties/${id}`),

  create: (data: CreatePropertyRequest) =>
    api.post<Property>("/properties", data),

  update: (id: string, data: Partial<CreatePropertyRequest>) =>
    api.put<Property>(`/properties/${id}`, data),

  delete: (id: string) => api.delete(`/properties/${id}`),
};
