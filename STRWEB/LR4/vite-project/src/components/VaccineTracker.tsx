import React, { Component } from "react";

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

interface VaccineTrackerState {
  vaccines: Vaccine[];
  procedures: Procedure[];
  petName: string;
  showAddVaccine: boolean;
  showAddProcedure: boolean;
  selectedVaccine: Vaccine | null;
  selectedProcedure: Procedure | null;
}

interface VaccineTrackerProps {
  onVaccineTrack?: (vaccines: Vaccine[], procedures: Procedure[]) => void;
  onAppointmentBook?: (date: string, type: "vaccine" | "procedure") => void;
  onReminder?: (item: Vaccine | Procedure, daysUntil: number) => void;
  initialPetName?: string;
  initialVaccines?: Vaccine[];
  initialProcedures?: Procedure[];
}

class VaccineTracker extends Component<
  VaccineTrackerProps,
  VaccineTrackerState
> {
  static defaultProps = {
    initialPetName: "",
    initialVaccines: [],
    initialProcedures: [],
  };

  constructor(props: VaccineTrackerProps) {
    super(props);

    this.state = {
      vaccines: props.initialVaccines || [],
      procedures: props.initialProcedures || [],
      petName: props.initialPetName || "",
      showAddVaccine: false,
      showAddProcedure: false,
      selectedVaccine: null,
      selectedProcedure: null,
    };
  }

  componentDidMount() {
    this.checkUpcomingReminders();
  }

  componentDidUpdate(prevProps: VaccineTrackerProps) {
    if (
      this.state.vaccines !== this.props.initialVaccines ||
      this.state.procedures !== this.props.initialProcedures
    ) {
      this.props.onVaccineTrack?.(this.state.vaccines, this.state.procedures);
      this.checkUpcomingReminders();
    }
  }

  checkUpcomingReminders = () => {
    const today = new Date();
    const allItems = [...this.state.vaccines, ...this.state.procedures];

    allItems.forEach((item) => {
      const nextDueDate =
        "nextDue" in item ? new Date(item.nextDue) : new Date(item.date);
      const daysUntil = Math.ceil(
        (nextDueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntil <= 30 && daysUntil > 0) {
        this.props.onReminder?.(item, daysUntil);
      }
    });
  };

  handleAddVaccine = (vaccine: Omit<Vaccine, "id">) => {
    const newVaccine: Vaccine = {
      ...vaccine,
      id: Date.now().toString(),
    };

    this.setState((prevState) => ({
      vaccines: [...prevState.vaccines, newVaccine],
      showAddVaccine: false,
    }));
  };

  handleAddProcedure = (procedure: Omit<Procedure, "id">) => {
    const newProcedure: Procedure = {
      ...procedure,
      id: Date.now().toString(),
    };

    this.setState((prevState) => ({
      procedures: [...prevState.procedures, newProcedure],
      showAddProcedure: false,
    }));
  };

  handleDeleteVaccine = (id: string) => {
    this.setState((prevState) => ({
      vaccines: prevState.vaccines.filter((v) => v.id !== id),
    }));
  };

  handleDeleteProcedure = (id: string) => {
    this.setState((prevState) => ({
      procedures: prevState.procedures.filter((p) => p.id !== id),
    }));
  };

  handleBookAppointment = (date: string, type: "vaccine" | "procedure") => {
    this.props.onAppointmentBook?.(date, type);
  };

  renderVaccineForm = () => {
    return (
      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "1rem",
          borderRadius: "0.375rem",
          marginBottom: "1rem",
        }}
      >
        <h4 style={{ color: "#374151", marginBottom: "1rem" }}>
          Add New Vaccine
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            this.handleAddVaccine({
              name: formData.get("name") as string,
              date: formData.get("date") as string,
              nextDue: formData.get("nextDue") as string,
              veterinarian: formData.get("veterinarian") as string,
              notes: formData.get("notes") as string,
            });
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <input
              name="name"
              type="text"
              placeholder="Vaccine Name"
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
            <input
              name="date"
              type="date"
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
            <input
              name="nextDue"
              type="date"
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
            <input
              name="veterinarian"
              type="text"
              placeholder="Veterinarian"
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
          </div>
          <textarea
            name="notes"
            placeholder="Notes"
            rows={2}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Add Vaccine
            </button>
            <button
              type="button"
              onClick={() => this.setState({ showAddVaccine: false })}
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                padding: "0.5rem 1rem",
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
    );
  };

  renderProcedureForm = () => {
    return (
      <div
        style={{
          backgroundColor: "#f9fafb",
          padding: "1rem",
          borderRadius: "0.375rem",
          marginBottom: "1rem",
        }}
      >
        <h4 style={{ color: "#374151", marginBottom: "1rem" }}>
          Add New Procedure
        </h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            this.handleAddProcedure({
              name: formData.get("name") as string,
              date: formData.get("date") as string,
              veterinarian: formData.get("veterinarian") as string,
              notes: formData.get("notes") as string,
              cost: parseFloat(formData.get("cost") as string),
            });
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <input
              name="name"
              type="text"
              placeholder="Procedure Name"
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
            <input
              name="date"
              type="date"
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
            <input
              name="veterinarian"
              type="text"
              placeholder="Veterinarian"
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
            <input
              name="cost"
              type="number"
              placeholder="Cost"
              step="0.01"
              required
              style={{
                padding: "0.5rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
              }}
            />
          </div>
          <textarea
            name="notes"
            placeholder="Notes"
            rows={2}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              marginBottom: "1rem",
            }}
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Add Procedure
            </button>
            <button
              type="button"
              onClick={() => this.setState({ showAddProcedure: false })}
              style={{
                backgroundColor: "#f3f4f6",
                color: "#374151",
                padding: "0.5rem 1rem",
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
    );
  };

  render() {
    const { vaccines, procedures, petName, showAddVaccine, showAddProcedure } =
      this.state;

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
          Vaccine & Procedure Tracker
        </h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <input
            type="text"
            placeholder="Pet Name"
            value={petName}
            onChange={(e) => this.setState({ petName: e.target.value })}
            style={{
              padding: "0.5rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.375rem",
              marginRight: "1rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ color: "#374151" }}>Vaccinations</h3>
            <button
              onClick={() => this.setState({ showAddVaccine: true })}
              style={{
                backgroundColor: "#059669",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Add Vaccine
            </button>
          </div>

          {showAddVaccine && this.renderVaccineForm()}

          {vaccines.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No vaccines recorded</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {vaccines.map((vaccine) => (
                <div
                  key={vaccine.id}
                  style={{
                    backgroundColor: "#f0fdf4",
                    padding: "1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <h4 style={{ color: "#166534", marginBottom: "0.5rem" }}>
                        {vaccine.name}
                      </h4>
                      <p style={{ color: "#15803d", margin: "0.25rem 0" }}>
                        Date: {vaccine.date}
                      </p>
                      <p style={{ color: "#15803d", margin: "0.25rem 0" }}>
                        Next Due: {vaccine.nextDue}
                      </p>
                      <p style={{ color: "#15803d", margin: "0.25rem 0" }}>
                        Veterinarian: {vaccine.veterinarian}
                      </p>
                      {vaccine.notes && (
                        <p style={{ color: "#15803d", margin: "0.25rem 0" }}>
                          Notes: {vaccine.notes}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() =>
                          this.handleBookAppointment(vaccine.nextDue, "vaccine")
                        }
                        style={{
                          backgroundColor: "#2563eb",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Book
                      </button>
                      <button
                        onClick={() => this.handleDeleteVaccine(vaccine.id)}
                        style={{
                          backgroundColor: "#dc2626",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ color: "#374151" }}>Procedures</h3>
            <button
              onClick={() => this.setState({ showAddProcedure: true })}
              style={{
                backgroundColor: "#059669",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
              }}
            >
              Add Procedure
            </button>
          </div>

          {showAddProcedure && this.renderProcedureForm()}

          {procedures.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No procedures recorded</p>
          ) : (
            <div style={{ display: "grid", gap: "1rem" }}>
              {procedures.map((procedure) => (
                <div
                  key={procedure.id}
                  style={{
                    backgroundColor: "#fef3c7",
                    padding: "1rem",
                    borderRadius: "0.375rem",
                    border: "1px solid #fde68a",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <h4 style={{ color: "#92400e", marginBottom: "0.5rem" }}>
                        {procedure.name}
                      </h4>
                      <p style={{ color: "#b45309", margin: "0.25rem 0" }}>
                        Date: {procedure.date}
                      </p>
                      <p style={{ color: "#b45309", margin: "0.25rem 0" }}>
                        Cost: ${procedure.cost.toFixed(2)}
                      </p>
                      <p style={{ color: "#b45309", margin: "0.25rem 0" }}>
                        Veterinarian: {procedure.veterinarian}
                      </p>
                      {procedure.notes && (
                        <p style={{ color: "#b45309", margin: "0.25rem 0" }}>
                          Notes: {procedure.notes}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={() =>
                          this.handleBookAppointment(
                            procedure.date,
                            "procedure"
                          )
                        }
                        style={{
                          backgroundColor: "#2563eb",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Book
                      </button>
                      <button
                        onClick={() => this.handleDeleteProcedure(procedure.id)}
                        style={{
                          backgroundColor: "#dc2626",
                          color: "white",
                          padding: "0.25rem 0.5rem",
                          border: "none",
                          borderRadius: "0.25rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default VaccineTracker;
