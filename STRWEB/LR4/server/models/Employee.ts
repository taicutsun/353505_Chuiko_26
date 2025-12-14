import mongoose, { Document } from "mongoose";

interface IEmployee extends Document {
  name: string;
  email: string;
  position: string;
  department: string;
  phone: string;
  hireDate: Date;
  salary: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new mongoose.Schema<IEmployee>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  salary: {
    type: Number,
    required: true,
    min: 0,
  },
  isActive: {
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

export const Employee = mongoose.model("Employee", employeeSchema);
