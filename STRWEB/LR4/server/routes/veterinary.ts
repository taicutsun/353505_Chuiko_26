import express from "express";
import type { Request, Response } from "express";
import {
  validateRequest,
  petValidation,
  emergencyValidation,
  appointmentValidation,
} from "../middleware/validation.js";

const router = express.Router();

// NOTE: Authentication removed - CRUD works without tokens

// PET MANAGEMENT ROUTES

// GET /api/veterinary/pets - Get all pets
router.get("/pets", async (req, res) => {
  try {
    // This would typically fetch from a Pet model
    // For now, return mock data
    const pets = [
      {
        id: "1",
        name: "Buddy",
        age: 3,
        type: "Dog",
        breed: "Golden Retriever",
        weight: 30,
        owner: "John Doe",
        contact: "555-0123",
        lastVisit: "2024-01-15",
        nextAppointment: "2024-02-15",
      },
    ];
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pets" });
  }
});

// POST /api/veterinary/pets - Add new pet
router.post("/pets", validateRequest(petValidation), async (req, res) => {
  try {
    const petData = req.body;
    // This would typically save to a Pet model
    const newPet = {
      id: Date.now().toString(),
      ...petData,
      createdAt: new Date().toISOString(),
    };
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: "Failed to create pet" });
  }
});

// PUT /api/veterinary/pets/:id - Update pet
router.put("/pets/:id", validateRequest(petValidation), async (req, res) => {
  try {
    const { id } = req.params;
    const petData = req.body;
    // This would typically update in a Pet model
    const updatedPet = {
      id,
      ...petData,
      updatedAt: new Date().toISOString(),
    };
    res.json(updatedPet);
  } catch (error) {
    res.status(500).json({ error: "Failed to update pet" });
  }
});

// DELETE /api/veterinary/pets/:id - Delete pet (no auth required)
router.delete("/pets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // This would typically delete from a Pet model
    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete pet" });
  }
});

// EMERGENCY ROUTES

// GET /api/veterinary/emergencies - Get all emergencies
router.get("/emergencies", async (req, res) => {
  try {
    const { status } = req.query;
    // This would typically fetch from an Emergency model
    let emergencies = [
      {
        id: "1",
        type: "critical",
        petName: "Max",
        description: "Severe bleeding from leg wound",
        location: "123 Main St",
        contactInfo: "555-0456",
        timestamp: new Date().toISOString(),
        resolved: false,
      },
    ];

    if (status === "active") {
      emergencies = emergencies.filter((e) => !e.resolved);
    } else if (status === "resolved") {
      emergencies = emergencies.filter((e) => e.resolved);
    }

    res.json(emergencies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch emergencies" });
  }
});

// POST /api/veterinary/emergencies - Create emergency alert
router.post(
  "/emergencies",
  validateRequest(emergencyValidation),
  async (req, res) => {
    try {
      const emergencyData = req.body;
      const newEmergency = {
        id: Date.now().toString(),
        ...emergencyData,
        timestamp: new Date().toISOString(),
        resolved: false,
      };
      res.status(201).json(newEmergency);
    } catch (error) {
      res.status(500).json({ error: "Failed to create emergency alert" });
    }
  }
);

// PUT /api/veterinary/emergencies/:id/resolve - Resolve emergency (no auth required)
router.put("/emergencies/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;
    // This would typically update in an Emergency model
    res.json({
      id,
      resolved: true,
      resolvedAt: new Date().toISOString(),
      resolvedBy: "system",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve emergency" });
  }
});

// APPOINTMENT ROUTES

// GET /api/veterinary/appointments - Get all appointments
router.get("/appointments", async (req, res) => {
  try {
    const { status, date } = req.query;
    // This would typically fetch from an Appointment model
    let appointments = [
      {
        id: "1",
        petName: "Buddy",
        dateTime: "2024-02-15T10:00:00Z",
        type: "Checkup",
        notes: "Annual vaccination",
        status: "scheduled",
        clientId: "1",
      },
    ];

    if (status) {
      appointments = appointments.filter((a) => a.status === status);
    }

    if (date) {
      appointments = appointments.filter((a) =>
        a.dateTime.startsWith(date as string)
      );
    }

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

// POST /api/veterinary/appointments - Create appointment
router.post(
  "/appointments",
  validateRequest(appointmentValidation),
  async (req, res) => {
    try {
      const appointmentData = req.body;
      const newAppointment = {
        id: Date.now().toString(),
        ...appointmentData,
        status: "scheduled",
        createdAt: new Date().toISOString(),
        createdBy: "system",
      };
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create appointment" });
    }
  }
);

// PUT /api/veterinary/appointments/:id - Update appointment
router.put(
  "/appointments/:id",
  validateRequest(appointmentValidation),
  async (req, res) => {
    try {
      const { id } = req.params;
      const appointmentData = req.body;
      const updatedAppointment = {
        id,
        ...appointmentData,
        updatedAt: new Date().toISOString(),
        updatedBy: "system",
      };
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  }
);

// PUT /api/veterinary/appointments/:id/cancel - Cancel appointment
router.put("/appointments/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    res.json({
      id,
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
      cancelledBy: "system",
      reason: reason || "Cancelled by user",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel appointment" });
  }
});

// HEALTH ANALYSIS ROUTES

// POST /api/veterinary/health/analyze - Analyze pet health
router.post("/health/analyze", async (req, res) => {
  try {
    const { petInfo, symptoms } = req.body;
    // This would typically use AI/ML to analyze symptoms
    const analysis = {
      id: Date.now().toString(),
      petName: petInfo.name,
      symptoms,
      analysis:
        "Based on symptoms, recommend immediate veterinary consultation",
      severity: "moderate",
      recommendations: [
        "Schedule veterinary appointment within 24 hours",
        "Monitor temperature and appetite",
        "Provide fresh water",
      ],
      analyzedAt: new Date().toISOString(),
    };
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: "Failed to analyze health" });
  }
});

// VACCINE TRACKING ROUTES

// GET /api/veterinary/vaccines - Get vaccine records
router.get("/vaccines", async (req, res) => {
  try {
    const { petId } = req.query;
    // This would typically fetch from a Vaccine model
    const vaccines = [
      {
        id: "1",
        petId: petId || "1",
        name: "Rabies",
        administeredDate: "2024-01-15",
        nextDueDate: "2025-01-15",
        veterinarian: "Dr. Smith",
      },
    ];
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vaccine records" });
  }
});

// POST /api/veterinary/vaccines - Add vaccine record
router.post("/vaccines", async (req, res) => {
  try {
    const vaccineData = req.body;
    const newVaccine = {
      id: Date.now().toString(),
      ...vaccineData,
      administeredDate: new Date().toISOString(),
      administeredBy: "system",
    };
    res.status(201).json(newVaccine);
  } catch (error) {
    res.status(500).json({ error: "Failed to add vaccine record" });
  }
});

export default router;
