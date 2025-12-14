import mongoose, { Document } from "mongoose";

interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  location: {
    address: string;
    city: string;
    country: string;
  };
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new mongoose.Schema<IProperty>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["apartment", "house", "villa", "commercial", "land"],
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  bedrooms: {
    type: Number,
    min: 0,
    default: 0,
  },
  bathrooms: {
    type: Number,
    min: 0,
    default: 0,
  },
  area: {
    type: Number,
    required: true,
    min: 0,
  },
  location: {
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  status: {
    type: String,
    enum: ["available", "sold", "rented", "pending"],
    default: "available",
  },
  images: [
    {
      type: String,
      trim: true,
    },
  ],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Property = mongoose.model("Property", propertySchema);
