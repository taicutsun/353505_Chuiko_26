import React from "react";
import { useAuth } from "../hooks/useAuth";
import ClientsList from "./ClientsList";
import EmployeesList from "./EmployeesList";
import PropertiesList from "./PropertiesList";
import NewsList from "./NewsList";

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login to access the dashboard</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "2px solid #eee",
          paddingBottom: "10px",
        }}
      >
        <div>
          <h1 style={{ margin: "0" }}>CRUD Dashboard</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>
            Welcome back, {user?.name}! ({user?.role})
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          {user?.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          )}
          <button
            onClick={logout}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <ClientsList />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <EmployeesList />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <PropertiesList />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <NewsList />
      </div>
    </div>
  );
};

export default Dashboard;
