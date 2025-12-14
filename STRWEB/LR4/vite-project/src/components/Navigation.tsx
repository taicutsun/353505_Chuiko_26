import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      style={{
        backgroundColor: "#2563eb",
        padding: "1rem",
        marginBottom: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          MyApp
        </Link>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              color: isActive("/") ? "#fbbf24" : "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: isActive("/")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            Home
          </Link>

          <Link
            to="/catalog"
            style={{
              color: isActive("/catalog") ? "#fbbf24" : "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: isActive("/catalog")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            Catalog
          </Link>

          <Link
            to="/veterinary"
            style={{
              color: isActive("/veterinary") ? "#fbbf24" : "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: isActive("/veterinary")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            Veterinary Clinic
          </Link>

          <Link
            to="/dashboard"
            style={{
              color: isActive("/dashboard") ? "#fbbf24" : "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: isActive("/dashboard")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/login"
            style={{
              color: isActive("/login") ? "#fbbf24" : "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: isActive("/login")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            Login
          </Link>

          <Link
            to="/emergency"
            style={{
              color: isActive("/emergency") ? "#fbbf24" : "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: isActive("/emergency")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            Emergency
          </Link>

          <Link
            to="/pet-health"
            style={{
              color: isActive("/pet-health") ? "#fbbf24" : "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: isActive("/pet-health")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            Pet Health
          </Link>

          <Link
            to="/vaccine-tracker"
            style={{
              color: isActive("/vaccine-tracker") ? "#fbbf24" : "white",
              textDecoration: "none",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              backgroundColor: isActive("/vaccine-tracker")
                ? "rgba(255,255,255,0.1)"
                : "transparent",
            }}
          >
            Vaccine Tracker
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
