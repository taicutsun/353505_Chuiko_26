import React, { useState, useEffect, useCallback } from "react";

interface Emergency {
  id: string;
  type: "critical" | "urgent" | "warning";
  petName: string;
  description: string;
  timestamp: string;
  location: string;
  contactInfo: string;
  resolved: boolean;
}

interface EmergencyAlertProps {
  onEmergencyAlert?: (emergency: Emergency) => void;
  onPetProfile?: (petName: string) => void;
  onAppointmentBook?: (emergency: Emergency) => void;
  emergencyTypes?: string[];
  initialEmergencies?: Emergency[];
}

const EmergencyAlert = ({
  onEmergencyAlert,
  onPetProfile,
  onAppointmentBook,
  emergencyTypes = [
    "Poisoning",
    "Injury/Trauma",
    "Difficulty Breathing",
    "Seizures",
    "Heat Stroke",
    "Bloat",
    "Severe Bleeding",
  ],
  initialEmergencies = [],
}: EmergencyAlertProps) => {
  const [emergencies, setEmergencies] =
    useState<Emergency[]>(initialEmergencies);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertType, setAlertType] = useState<"critical" | "urgent" | "warning">(
    "urgent"
  );
  const [formData, setFormData] = useState({
    petName: "",
    description: "",
    location: "",
    contactInfo: "",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setEmergencies((prev) =>
        prev.map((emergency) => {
          const emergencyTime = new Date(emergency.timestamp);
          const minutesElapsed =
            (now.getTime() - emergencyTime.getTime()) / (1000 * 60);

          if (
            minutesElapsed > 5 &&
            emergency.type === "critical" &&
            !emergency.resolved
          ) {
            onEmergencyAlert?.(emergency);
          }

          return emergency;
        })
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [onEmergencyAlert]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.petName || !formData.description) {
        alert("Please fill in pet name and description");
        return;
      }

      const newEmergency: Emergency = {
        id: Date.now().toString(),
        type: alertType,
        petName: formData.petName,
        description: formData.description,
        timestamp: new Date().toISOString(),
        location: formData.location || "Unknown",
        contactInfo: formData.contactInfo || "No contact info",
        resolved: false,
      };

      setEmergencies((prev) => [newEmergency, ...prev]);
      onEmergencyAlert?.(newEmergency);

      setFormData({
        petName: "",
        description: "",
        location: "",
        contactInfo: "",
      });
      setShowAlertForm(false);
    },
    [formData, alertType, onEmergencyAlert]
  );

  const handleResolve = useCallback((id: string) => {
    setEmergencies((prev) =>
      prev.map((emergency) =>
        emergency.id === id ? { ...emergency, resolved: true } : emergency
      )
    );
  }, []);

  const handleDelete = useCallback((id: string) => {
    setEmergencies((prev) => prev.filter((emergency) => emergency.id !== id));
  }, []);

  const handlePetProfile = useCallback(
    (petName: string) => {
      onPetProfile?.(petName);
    },
    [onPetProfile]
  );

  const handleBookEmergencyAppointment = useCallback(
    (emergency: Emergency) => {
      onAppointmentBook?.(emergency);
    },
    [onAppointmentBook]
  );

  const getTypeColor = (type: Emergency["type"]) => {
    switch (type) {
      case "critical":
        return "#ff0000";
        return "#dc2626";
      case "urgent":
        return "#ea580c";
      case "warning":
        return "#d97706";
      default:
        return "#6b7280";
    }
  };

  const getTypeBgColor = (type: Emergency["type"]) => {
    switch (type) {
      case "critical":
        return "#fef2f2";
      case "urgent":
        return "#fff7ed";
      case "warning":
        return "#fef3c7";
      default:
        return "#f9fafb";
    }
  };

  const activeEmergencies = emergencies.filter((e) => !e.resolved);
  const resolvedEmergencies = emergencies.filter((e) => e.resolved);

  return (
    <div
      style={{
        padding: "2rem",
        border: "1px solid #e5e7eb",
        borderRadius: "0.5rem",
        margin: "1rem 0",
      }}
    >
      <h2 style={{ color: "#1f2937", marginBottom: "1.5rem" }}>
        Emergency Alert System
      </h2>

      <div style={{ marginBottom: "2rem" }}>
        <button
          onClick={() => setShowAlertForm(true)}
          style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "600",
          }}
        >
          Report Emergency
        </button>
      </div>

      {showAlertForm && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "1.5rem",
            borderRadius: "0.375rem",
            marginBottom: "2rem",
            border: "1px solid #fecaca",
          }}
        >
          <h3 style={{ color: "#dc2626", marginBottom: "1rem" }}>
            Report Emergency
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                Emergency Type:
              </label>
              <div style={{ display: "flex", gap: "1rem" }}>
                {(["critical", "urgent", "warning"] as const).map((type) => (
                  <label
                    key={type}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="radio"
                      value={type}
                      checked={alertType === type}
                      onChange={(e) =>
                        setAlertType(e.target.value as typeof alertType)
                      }
                    />
                    <span
                      style={{
                        textTransform: "capitalize",
                        color: getTypeColor(type),
                      }}
                    >
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                Common Emergency Types:
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "0.5rem",
                }}
              >
                {emergencyTypes.map((type, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#f3f4f6",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.875rem",
                      color: "#6b7280",
                    }}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#374151",
                    fontWeight: "600",
                  }}
                >
                  Pet Name:
                </label>
                <input
                  type="text"
                  value={formData.petName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      petName: e.target.value,
                    }))
                  }
                  required
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#374151",
                    fontWeight: "600",
                  }}
                >
                  Location:
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#374151",
                    fontWeight: "600",
                  }}
                >
                  Contact Info:
                </label>
                <input
                  type="text"
                  value={formData.contactInfo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactInfo: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#374151",
                  fontWeight: "600",
                }}
              >
                Description:
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                required
                rows={3}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="submit"
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  border: "none",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                Submit Emergency Alert
              </button>
              <button
                type="button"
                onClick={() => setShowAlertForm(false)}
                style={{
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  padding: "0.75rem 1.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#374151", marginBottom: "1rem" }}>
          Active Emergencies ({activeEmergencies.length})
        </h3>
        {activeEmergencies.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No active emergencies</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {activeEmergencies.map((emergency) => (
              <div
                key={emergency.id}
                style={{
                  backgroundColor: getTypeBgColor(emergency.type),
                  padding: "1rem",
                  borderRadius: "0.375rem",
                  border: `1px solid ${getTypeColor(emergency.type)}`,
                  borderLeftWidth: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "0.5rem",
                  }}
                >
                  <div>
                    <span
                      style={{
                        backgroundColor: getTypeColor(emergency.type),
                        color: "white",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        fontWeight: "600",
                      }}
                    >
                      {emergency.type}
                    </span>
                    <h4 style={{ color: "#1f2937", margin: "0.5rem 0" }}>
                      {emergency.petName} - Emergency
                    </h4>
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    {new Date(emergency.timestamp).toLocaleString()}
                  </div>
                </div>

                <p style={{ color: "#374151", marginBottom: "0.5rem" }}>
                  {emergency.description}
                </p>
                {emergency.location && (
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Location: {emergency.location}
                  </p>
                )}
                {emergency.contactInfo && (
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "0.875rem",
                      marginBottom: "1rem",
                    }}
                  >
                    Contact: {emergency.contactInfo}
                  </p>
                )}

                <div
                  style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  <button
                    onClick={() => handleResolve(emergency.id)}
                    style={{
                      backgroundColor: "#059669",
                      color: "white",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() => handlePetProfile(emergency.petName)}
                    style={{
                      backgroundColor: "#2563eb",
                      color: "white",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    View Pet Profile
                  </button>
                  <button
                    onClick={() => handleBookEmergencyAppointment(emergency)}
                    style={{
                      backgroundColor: "#7c3aed",
                      color: "white",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Book Appointment
                  </button>
                  <button
                    onClick={() => handleDelete(emergency.id)}
                    style={{
                      backgroundColor: "#dc2626",
                      color: "white",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {resolvedEmergencies.length > 0 && (
        <div>
          <h3 style={{ color: "#374151", marginBottom: "1rem" }}>
            Resolved Emergencies ({resolvedEmergencies.length})
          </h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {resolvedEmergencies.map((emergency) => (
              <div
                key={emergency.id}
                style={{
                  backgroundColor: "#f9fafb",
                  padding: "0.75rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #e5e7eb",
                  opacity: 0.7,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      {emergency.petName} - {emergency.type}
                    </span>
                    <span
                      style={{
                        color: "#6b7280",
                        fontSize: "0.75rem",
                        marginLeft: "1rem",
                      }}
                    >
                      {new Date(emergency.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(emergency.id)}
                    style={{
                      backgroundColor: "#ef4444",
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      border: "none",
                      borderRadius: "0.25rem",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyAlert;
