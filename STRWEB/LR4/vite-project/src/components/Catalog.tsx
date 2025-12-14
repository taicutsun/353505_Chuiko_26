import { Link } from "react-router-dom";

interface CatalogItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const mockCatalogItems: CatalogItem[] = [
  {
    id: 1,
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    category: "Electronics",
    image: "https://via.placeholder.com/300x200/2563eb/ffffff?text=Laptop",
  },
  {
    id: 2,
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse with long battery life",
    price: 49.99,
    category: "Accessories",
    image: "https://via.placeholder.com/300x200/10b981/ffffff?text=Mouse",
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with cherry switches",
    price: 149.99,
    category: "Accessories",
    image: "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Keyboard",
  },
  {
    id: 4,
    name: "4K Monitor",
    description: "27-inch 4K UHD monitor with HDR",
    price: 399.99,
    category: "Electronics",
    image: "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Monitor",
  },
  {
    id: 5,
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with multiple ports",
    price: 79.99,
    category: "Accessories",
    image: "https://via.placeholder.com/300x200/ef4444/ffffff?text=Hub",
  },
  {
    id: 6,
    name: "Webcam HD",
    description: "1080p HD webcam with auto-focus",
    price: 89.99,
    category: "Electronics",
    image: "https://via.placeholder.com/300x200/06b6d4/ffffff?text=Webcam",
  },
];

const Catalog = () => {
  return (
    <div style={{ padding: "0 2rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#1f2937" }}>
        Product Catalog
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        {mockCatalogItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              overflow: "hidden",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "1rem" }}>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                }}
              >
                {item.category}
              </div>

              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  color: "#1f2937",
                }}
              >
                {item.name}
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  marginBottom: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                {item.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#059669",
                  }}
                >
                  ${item.price}
                </span>

                <Link
                  to={`/catalog/${item.id}`}
                  style={{
                    backgroundColor: "#2563eb",
                    color: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.375rem",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#1d4ed8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                  }}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
