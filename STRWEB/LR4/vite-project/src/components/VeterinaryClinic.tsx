import React, { useState, useCallback } from "react";
import "../styles/veterinary.css";
import PetHealthAnalyzer from "./PetHealthAnalyzer";
import VaccineTracker from "./VaccineTracker";
import EmergencyAlert from "./EmergencyAlert";

interface PetProfile {
  name: string;
  age: number;
  type: string;
  breed?: string;
  weight?: number;
  owner: string;
  contact: string;
}

interface Appointment {
  id: string;
  petName: string;
  date: string;
  time: string;
  type: "checkup" | "emergency" | "vaccine" | "procedure";
  notes: string;
}

interface Prescription {
  id: string;
  petName: string;
  medication: string;
  dosage: string;
  instructions: string;
  date: string;
  veterinarian: string;
}

interface Vaccine {
  id: string;
  name: string;
  date: string;
  nextDue: string;
  veterinarian: string;
  notes: string;
}

interface Procedure {
  id: string;
  name: string;
  date: string;
  veterinarian: string;
  notes: string;
  cost: number;
}

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

const VeterinaryClinic: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "health" | "vaccines" | "emergency"
  >("health");
  const [petProfiles, setPetProfiles] = useState<PetProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);

  const addNotification = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setNotifications((prev) =>
      [`[${timestamp}] ${message}`, ...prev].slice(0, 5)
    );
  }, []);

  const handleHealthAnalyze = useCallback(
    (petInfo: { name: string; age: number; type: string }) => {
      addNotification(`Health analysis completed for ${petInfo.name}`);

      const existingProfile = petProfiles.find((p) => p.name === petInfo.name);
      if (!existingProfile) {
        const newProfile: PetProfile = {
          name: petInfo.name,
          age: petInfo.age,
          type: petInfo.type,
          owner: "Unknown",
          contact: "Unknown",
        };
        setPetProfiles((prev) => [...prev, newProfile]);
      }
    },
    [petProfiles, addNotification]
  );

  const handleVaccineTrack = useCallback(
    (vaccines: Vaccine[], procedures: Procedure[]) => {
      addNotification(
        `Vaccine tracking updated: ${vaccines.length} vaccines, ${procedures.length} procedures`
      );
    },
    [addNotification]
  );

  const handleEmergencyAlert = useCallback(
    (emergency: Emergency) => {
      addNotification(
        `EMERGENCY: ${emergency.petName} - ${emergency.type} - ${emergency.description}`
      );

      const emergencyAppointment: Appointment = {
        id: Date.now().toString(),
        petName: emergency.petName,
        date: new Date().toISOString().split("T")[0],
        time: "ASAP",
        type: "emergency",
        notes: emergency.description,
      };
      setAppointments((prev) => [emergencyAppointment, ...prev]);
    },
    [addNotification]
  );

  const handleAppointmentBook = useCallback(
    (date: string, type: "vaccine" | "procedure") => {
      addNotification(`Appointment booked for ${type} on ${date}`);

      const newAppointment: Appointment = {
        id: Date.now().toString(),
        petName: "Unknown",
        date,
        time: "10:00",
        type: type === "vaccine" ? "vaccine" : "procedure",
        notes: `Scheduled ${type}`,
      };
      setAppointments((prev) => [...prev, newAppointment]);
    },
    [addNotification]
  );

  const handlePrescription = useCallback(
    (diagnosis: string) => {
      addNotification(`Prescription created for diagnosis: ${diagnosis}`);

      const newPrescription: Prescription = {
        id: Date.now().toString(),
        petName: "Unknown",
        medication: "Medication based on diagnosis",
        dosage: "As prescribed",
        instructions: "Follow veterinarian instructions",
        date: new Date().toISOString().split("T")[0],
        veterinarian: "Dr. Smith",
      };
      setPrescriptions((prev) => [...prev, newPrescription]);
    },
    [addNotification]
  );

  const handlePetProfile = useCallback(
    (petName: string) => {
      addNotification(`Viewing profile for ${petName}`);
    },
    [addNotification]
  );

  const handleReminder = useCallback(
    (item: Vaccine | Procedure, daysUntil: number) => {
      const itemName = item.name;
      addNotification(`Reminder: ${itemName} due in ${daysUntil} days`);
    },
    [addNotification]
  );

  const handleBookEmergencyAppointment = useCallback(
    (emergency: Emergency) => {
      addNotification(`Emergency appointment booked for ${emergency.petName}`);
    },
    [addNotification]
  );

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="veterinary-header">
          <h1 className="veterinary-title">Veterinary Clinic Management</h1>
          <p className="veterinary-subtitle">
            Comprehensive Pet Healthcare System
          </p>
        </div>

        <div className="veterinary-tabs">
          {(["health", "vaccines", "emergency"] as const).map((tab) => (
            <button
              key={tab}
              className={`veterinary-tab ${
                activeTab === tab ? "veterinary-tab--active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "health" && "Health Analysis"}
              {tab === "vaccines" && "Vaccine Tracking"}
              {tab === "emergency" && "Emergency Alerts"}
            </button>
          ))}
        </div>

        <div className="veterinary-content">
          <div>
            {activeTab === "health" && (
              <div className="veterinary-card">
                <PetHealthAnalyzer
                  onHealthAnalyze={handleHealthAnalyze}
                  onPrescription={handlePrescription}
                  initialPetInfo={{ name: "", age: 0, type: "" }}
                />
              </div>
            )}

            {activeTab === "vaccines" && (
              <div className="veterinary-card">
                <VaccineTracker
                  onVaccineTrack={handleVaccineTrack}
                  onAppointmentBook={handleAppointmentBook}
                  onReminder={handleReminder}
                  initialPetName=""
                  initialVaccines={[]}
                  initialProcedures={[]}
                />
              </div>
            )}

            {activeTab === "emergency" && (
              <div className="veterinary-card">
                <EmergencyAlert
                  onEmergencyAlert={handleEmergencyAlert}
                  onPetProfile={handlePetProfile}
                  onAppointmentBook={handleBookEmergencyAppointment}
                  emergencyTypes={[
                    "Poisoning",
                    "Injury/Trauma",
                    "Difficulty Breathing",
                    "Seizures",
                    "Heat Stroke",
                    "Bloat",
                    "Severe Bleeding",
                  ]}
                  initialEmergencies={[]}
                />
              </div>
            )}
          </div>

          <div>
            <div style={{ position: "sticky", top: "2rem" }}>
              <div className="veterinary-card">
                <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
                  Notifications
                </h3>
                <div
                  className="veterinary-notifications"
                  style={{ position: "static", maxWidth: "none" }}
                >
                  {notifications.length === 0 ? (
                    <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="veterinary-notification veterinary-notification--info"
                        style={{ position: "static", animation: "none" }}
                      >
                        {notification}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  marginBottom: "1rem",
                }}
              >
                <h3
                  style={{
                    color: "#1f2937",
                    marginBottom: "1rem",
                    fontSize: "1.125rem",
                  }}
                >
                  Quick Stats
                </h3>
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Pet Profiles:</span>
                    <span style={{ color: "#1f2937", fontWeight: "600" }}>
                      {petProfiles.length}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Appointments:</span>
                    <span style={{ color: "#1f2937", fontWeight: "600" }}>
                      {appointments.length}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "#6b7280" }}>Prescriptions:</span>
                    <span style={{ color: "#1f2937", fontWeight: "600" }}>
                      {prescriptions.length}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "white",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <h3
                  style={{
                    color: "#1f2937",
                    marginBottom: "1rem",
                    fontSize: "1.125rem",
                  }}
                >
                  Recent Appointments
                </h3>
                {appointments.length === 0 ? (
                  <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                    No appointments
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    {appointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        style={{
                          padding: "0.5rem",
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                        }}
                      >
                        <div style={{ fontWeight: "600", color: "#1f2937" }}>
                          {appointment.petName}
                        </div>
                        <div style={{ color: "#6b7280" }}>
                          {appointment.date} - {appointment.time}
                        </div>
                        <div style={{ color: "#6b7280" }}>
                          {appointment.type}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VeterinaryClinic;
