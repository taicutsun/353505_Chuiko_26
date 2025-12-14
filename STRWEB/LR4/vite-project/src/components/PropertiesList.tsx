import React from "react";
import { useProperties, useDeleteProperty } from "../hooks/useProperties";
import type { Property } from "../api/properties";

const PropertiesList: React.FC = () => {
  const { data, isLoading, error } = useProperties();
  const deleteProperty = useDeleteProperty();

  // Ensure we always have an array, even if data is undefined or not an array
  const properties = Array.isArray(data) ? data : [];

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deleteProperty.mutate(id);
    }
  };

  if (isLoading) return <div>Loading properties...</div>;
  if (error) return <div>Error loading properties</div>;

  return (
    <div>
      <h2>Properties</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {properties?.map((property: Property) => (
          <div
            key={property._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{property.title}</h3>
            <p style={{ margin: "4px 0", color: "#666" }}>
              {property.description}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Type:</strong> {property.type}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Price:</strong> ${property.price}
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Area:</strong> {property.area} sq ft
            </p>
            <p style={{ margin: "4px 0" }}>
              <strong>Location:</strong> {property.location.city},{" "}
              {property.location.country}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "12px",
              }}
            >
              <span
                style={{
                  backgroundColor:
                    property.status === "available" ? "#4CAF50" : "#ff9800",
                  color: "white",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {property.status}
              </span>
              <button
                onClick={() => handleDelete(property._id)}
                style={{
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertiesList;
