import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#1f2937" }}>
        Welcome to Our Store
      </h1>

      <p
        style={{ fontSize: "1.25rem", color: "#6b7280", marginBottom: "2rem" }}
      >
        Discover amazing products in our catalog
      </p>

      <Link
        to="/catalog"
        style={{
          display: "inline-block",
          padding: "1rem 2rem",
          backgroundColor: "#2563eb",
          color: "white",
          textDecoration: "none",
          borderRadius: "0.5rem",
          fontSize: "1.125rem",
          fontWeight: "600",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#1d4ed8";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#2563eb";
        }}
      >
        Browse Catalog
      </Link>

      <div
        style={{
          marginTop: "4rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
          maxWidth: "800px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            padding: "2rem",
            backgroundColor: "#f9fafb",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
            Quality Products
          </h3>
          <p style={{ color: "#6b7280" }}>
            Carefully selected items with premium quality
          </p>
        </div>

        <div
          style={{
            padding: "2rem",
            backgroundColor: "#f9fafb",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
            Fast Shipping
          </h3>
          <p style={{ color: "#6b7280" }}>Quick delivery to your doorstep</p>
        </div>

        <div
          style={{
            padding: "2rem",
            backgroundColor: "#f9fafb",
            borderRadius: "0.5rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
            Great Support
          </h3>
          <p style={{ color: "#6b7280" }}>24/7 customer service assistance</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
