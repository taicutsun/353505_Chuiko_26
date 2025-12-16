import React, { useState, useContext } from "react";
import {
  useProperties,
  useDeleteProperty,
  useCreateProperty,
  useUpdateProperty,
} from "../hooks/useProperties";
import type { Property, CreatePropertyRequest } from "../api/properties";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/components.css";

const PropertiesList: React.FC = () => {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated || false;

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<CreatePropertyRequest>({
    title: "",
    description: "",
    type: "apartment",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    location: {
      address: "",
      city: "",
      country: "",
    },
    status: "available",
    images: [],
    isAvailable: true,
  });

  const { data, isLoading, error, refetch } = useProperties({
    search,
    sortBy,
    sortOrder,
    limit,
  });

  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty();
  const deleteMutation = useDeleteProperty();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProperty) {
        await updateMutation.mutateAsync({
          id: editingProperty._id,
          property: formData,
        });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setShowForm(false);
      setEditingProperty(null);
      setFormData({
        title: "",
        description: "",
        type: "apartment",
        price: 0,
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        location: {
          address: "",
          city: "",
          country: "",
        },
        status: "available",
        images: [],
        isAvailable: true,
      });
      refetch();
    } catch (error) {
      console.error("Error saving property:", error);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      description: property.description,
      type: property.type,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      location: property.location,
      status: property.status,
      images: property.images,
      isAvailable: property.isAvailable,
    });
    setShowForm(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else if (name === "isAvailable") {
      setFormData((prev) => ({
        ...prev,
        isAvailable: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "price" ||
          name === "bedrooms" ||
          name === "bathrooms" ||
          name === "area"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => refetch(),
      });
    }
  };

  if (isLoading) return <div className="loading">Loading properties...</div>;
  if (error) return <div className="error">Error loading properties</div>;

  return (
    <div className="container">
      <div className="header">
        <h2>Properties</h2>
        {isAuthenticated && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            Add New Property
          </button>
        )}
      </div>

      {/* Search and Sort Controls */}
      <div className="search-controls">
        <input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="createdAt">Created Date</option>
          <option value="price">Price</option>
          <option value="title">Title</option>
          <option value="area">Area</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          className="sort-select"
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingProperty ? "Edit Property" : "Add New Property"}</h3>
            <form onSubmit={handleSubmit} className="property-form">
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type:</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bedrooms:</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    min="0"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Bathrooms:</label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    min="0"
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Area (sq ft):</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    min="0"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address:</label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City:</label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Country:</label>
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    required
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status:</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleChange}
                    />
                    Available
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProperty(null);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="btn btn-primary"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingProperty
                    ? "Update Property"
                    : "Add Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Properties Grid */}
      <div className="properties-grid">
        {Array.isArray(data)
          ? data.map((property: Property) => (
              <div key={property._id} className="property-card">
                <h3>{property.title}</h3>
                <p className="property-description">{property.description}</p>
                <div className="property-details">
                  <p>
                    <strong>Type:</strong> {property.type}
                  </p>
                  <p>
                    <strong>Price:</strong> ${property.price}
                  </p>
                  <p>
                    <strong>Area:</strong> {property.area} sq ft
                  </p>
                  <p>
                    <strong>Location:</strong> {property.location.city},{" "}
                    {property.location.country}
                  </p>
                </div>
                <div className="property-footer">
                  <span className={`status-badge ${property.status}`}>
                    {property.status}
                  </span>
                  <div className="property-actions">
                    {isAuthenticated && (
                      <button
                        onClick={() => handleEdit(property)}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </button>
                    )}
                    {isAuthenticated && (
                      <button
                        onClick={() => handleDelete(property._id)}
                        className="btn btn-sm btn-danger"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default PropertiesList;
