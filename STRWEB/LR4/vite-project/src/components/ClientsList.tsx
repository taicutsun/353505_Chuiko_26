import React, { useState } from "react";
import {
  useClients,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from "../hooks/useClients";
import type { Client } from "../api/clients";
import "../styles/ClientsList.css";

const ClientsList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { data, isLoading, error, refetch } = useClients({
    search,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      phone: "",
      address: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      errors.phone = "Invalid phone format";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    setFormErrors(errors);
    return !errors.name && !errors.email && !errors.phone && !errors.address;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingClient) {
        await updateMutation.mutateAsync({
          id: editingClient._id,
          client: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingClient(null);
      setFormData({ name: "", email: "", phone: "", address: "" });
      refetch();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
    });
    setFormErrors({ name: "", email: "", phone: "", address: "" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await deleteMutation.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingClient(null);
    setFormData({ name: "", email: "", phone: "", address: "" });
    setFormErrors({ name: "", email: "", phone: "", address: "" });
  };

  const totalPages = data?.pagination?.pages || 1;

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h2 className="clients-title">Clients Management</h2>
        <button className="btn-add-client" onClick={() => setShowForm(true)}>
          Add New Client
        </button>
      </div>

      <div className="search-filter-section">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="createdAt">Created Date</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as "asc" | "desc");
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">
              {editingClient ? "Edit Client" : "Add New Client"}
            </h3>
            <form onSubmit={handleSubmit} className="client-form">
              <div className="form-group">
                <label className="form-label">Name:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className={`form-input ${formErrors.name ? "error" : ""}`}
                />
                {formErrors.name && (
                  <div className="error-message">{formErrors.name}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className={`form-input ${formErrors.email ? "error" : ""}`}
                />
                {formErrors.email && (
                  <div className="error-message">{formErrors.email}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Phone:</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className={`form-input ${formErrors.phone ? "error" : ""}`}
                />
                {formErrors.phone && (
                  <div className="error-message">{formErrors.phone}</div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Address:</label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  required
                  rows={3}
                  className={`form-textarea ${
                    formErrors.address ? "error" : ""
                  }`}
                />
                {formErrors.address && (
                  <div className="error-message">{formErrors.address}</div>
                )}
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="btn-submit"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && <div className="loading-message">Loading clients...</div>}
      {error && (
        <div className="error-message-container">Error loading clients</div>
      )}

      {data && (
        <>
          <div className="clients-table-container">
            <table className="clients-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(Array.isArray(data?.clients) ? data.clients : []).map(
                  (client: Client) => (
                    <tr key={client._id}>
                      <td>{client.name}</td>
                      <td>{client.email}</td>
                      <td>{client.phone}</td>
                      <td>{client.address}</td>
                      <td>{new Date(client.createdAt).toLocaleDateString()}</td>
                      <td className="action-buttons">
                        <button
                          onClick={() => handleEdit(client)}
                          className="btn-edit"
                        >handleDelete
                          Edit
                        </button>
                        <button
                          onClick={() => (client._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {data.pagination && (
            <div className="pagination-container">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>

              <span className="pagination-info">
                Page {page} of {totalPages} ({data.pagination.total} total)
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientsList;
