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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
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
            <div className="sticky top-8">
              <div className="veterinary-card">
                <h3 className="text-gray-800 mb-4">Notifications</h3>
                <div className="veterinary-notifications static max-w-none">
                  {notifications.length === 0 ? (
                    <p className="text-gray-500 text-sm">No notifications</p>
                  ) : (
                    notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="veterinary-notification veterinary-notification--info static"
                        style={{ animation: "none" }}
                      >
                        {notification}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                <h3 className="text-gray-800 mb-4 text-lg">Quick Stats</h3>
                <div className="grid gap-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pet Profiles:</span>
                    <span className="text-gray-800 font-semibold">
                      {petProfiles.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Appointments:</span>
                    <span className="text-gray-800 font-semibold">
                      {appointments.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prescriptions:</span>
                    <span className="text-gray-800 font-semibold">
                      {prescriptions.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="text-gray-800 mb-4 text-lg">
                  Recent Appointments
                </h3>
                {appointments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No appointments</p>
                ) : (
                  <div className="grid gap-2">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-2 bg-gray-50 border-gray-200 rounded-md"
                      >
                        <div className="font-semibold text-gray-800">
                          {appointment.petName}
                        </div>
                        <div className="text-gray-500">
                          {appointment.date} - {appointment.time}
                        </div>
                        <div className="text-gray-500">{appointment.type}</div>
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
