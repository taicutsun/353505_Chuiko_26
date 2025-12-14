import React from "react";
import { useEmployees, useDeleteEmployee } from "../hooks/useEmployees";
import type { Employee } from "../api/employees";

const EmployeesList: React.FC = () => {
  const { data, isLoading, error } = useEmployees();
  const deleteEmployee = useDeleteEmployee();

  // Ensure we always have an array, even if data is undefined or not an array
  const employees = Array.isArray(data) ? data : [];

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee.mutate(id);
    }
  };

  if (isLoading) return <div>Loading employees...</div>;
  if (error) return <div>Error loading employees</div>;

  return (
    <div>
      <h2>Employees</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Email</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Position</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Department</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Phone</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Salary</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee: Employee) => (
            <tr key={employee._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px" }}>{employee.name}</td>
              <td style={{ padding: "8px" }}>{employee.email}</td>
              <td style={{ padding: "8px" }}>{employee.position}</td>
              <td style={{ padding: "8px" }}>{employee.department}</td>
              <td style={{ padding: "8px" }}>{employee.phone}</td>
              <td style={{ padding: "8px" }}>${employee.salary}</td>
              <td style={{ padding: "8px" }}>
                <span
                  style={{
                    backgroundColor: employee.isActive ? "#4CAF50" : "#f44336",
                    color: "white",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {employee.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td style={{ padding: "8px" }}>
                <button
                  onClick={() => handleDelete(employee._id)}
                  style={{
                    backgroundColor: "#ff4444",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "8px",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesList;
