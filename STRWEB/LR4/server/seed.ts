import mongoose from "mongoose";
import { Client } from "./models/Client.js";
import { Employee } from "./models/Employee.js";
import { Property } from "./models/Property.js";
import { News } from "./models/News.js";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://admin:password123@localhost:27017/strweb?authSource=admin";

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Client.deleteMany({});
    await Employee.deleteMany({});
    await Property.deleteMany({});
    await News.deleteMany({});

    console.log("Cleared existing data");

    // Create sample clients
    const clients = await Client.create([
      {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        address: "123 Main St, New York, NY",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+0987654321",
        address: "456 Oak Ave, Los Angeles, CA",
      },
      {
        name: "Bob Johnson",
        email: "bob@example.com",
        phone: "+1122334455",
        address: "789 Pine Rd, Chicago, IL",
      },
    ]);

    // Create sample employees
    const employees = await Employee.create([
      {
        name: "Alice Wilson",
        email: "alice@company.com",
        position: "Senior Agent",
        department: "Sales",
        phone: "+1111111111",
        hireDate: new Date("2022-01-15"),
        salary: 75000,
        isActive: true,
      },
      {
        name: "Charlie Brown",
        email: "charlie@company.com",
        position: "Property Manager",
        department: "Management",
        phone: "+2222222222",
        hireDate: new Date("2021-06-20"),
        salary: 65000,
        isActive: true,
      },
      {
        name: "Diana Prince",
        email: "diana@company.com",
        position: "Marketing Specialist",
        department: "Marketing",
        phone: "+3333333333",
        hireDate: new Date("2023-03-10"),
        salary: 55000,
        isActive: false,
      },
    ]);

    // Create sample properties
    const properties = await Property.create([
      {
        title: "Luxury Downtown Apartment",
        description: "Beautiful 2-bedroom apartment in the heart of downtown",
        price: 450000,
        area: 1200,
        location: {
          address: "123 City Center Blvd",
          city: "New York",
          country: "USA",
        },
        type: "apartment",
        status: "available",
      },
      {
        title: "Suburban Family House",
        description: "Spacious 4-bedroom house with garden",
        price: 750000,
        area: 2500,
        location: {
          address: "456 Suburban St",
          city: "Los Angeles",
          country: "USA",
        },
        type: "house",
        status: "sold",
      },
      {
        title: "Modern Office Space",
        description: "Prime commercial space for lease",
        price: 250000,
        area: 800,
        location: {
          address: "789 Business Park",
          city: "Chicago",
          country: "USA",
        },
        type: "commercial",
        status: "available",
      },
    ]);

    // Create sample news (published)
    const news = await News.create([
      {
        title: "New Property Listings Available",
        content:
          "We are excited to announce several new property listings in prime locations. These properties offer excellent value and investment opportunities.",
        summary: "New property listings now available in prime locations",
        category: "property",
        author: "Marketing Team",
        tags: ["new listings", "investment", "prime locations"],
        isPublished: true,
        publishedAt: new Date("2024-01-15"),
      },
      {
        title: "Company Expansion Announcement",
        content:
          "Our company is expanding to better serve our clients. We are opening new offices in key metropolitan areas.",
        summary: "Company expansion with new offices in key areas",
        category: "announcement",
        author: "CEO",
        tags: ["expansion", "growth", "new offices"],
        isPublished: true,
        publishedAt: new Date("2024-01-10"),
      },
      {
        title: "Market Analysis Report",
        content:
          "The latest market analysis shows positive trends in the real estate sector. Prices are expected to rise in the coming months.",
        summary: "Positive trends in real estate market analysis",
        category: "market",
        author: "Research Team",
        tags: ["market analysis", "trends", "real estate"],
        isPublished: true,
        publishedAt: new Date("2024-01-05"),
      },
    ]);

    console.log(`Created ${clients.length} clients`);
    console.log(`Created ${employees.length} employees`);
    console.log(`Created ${properties.length} properties`);
    console.log(`Created ${news.length} news items`);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
