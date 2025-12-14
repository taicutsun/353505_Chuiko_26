import type { Request, Response, NextFunction } from "express";

export interface ValidationRule {
  field: string;
  rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    numeric?: boolean;
    alpha?: boolean;
    alphaNumeric?: boolean;
    custom?: (value: any) => boolean | string;
  };
  message?: string;
}

export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {};

    for (const rule of rules) {
      const value = req.body[rule.field];
      const fieldErrors: string[] = [];

      // Check if field exists
      if (
        rule.rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        fieldErrors.push(rule.message || `${rule.field} is required`);
        continue;
      }

      // Skip validation if field is not required and empty
      if (
        !rule.rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        continue;
      }

      // Type validations
      if (rule.rules.minLength && value.length < rule.rules.minLength) {
        fieldErrors.push(
          `${rule.field} must be at least ${rule.rules.minLength} characters`
        );
      }

      if (rule.rules.maxLength && value.length > rule.rules.maxLength) {
        fieldErrors.push(
          `${rule.field} must not exceed ${rule.rules.maxLength} characters`
        );
      }

      if (rule.rules.pattern && !rule.rules.pattern.test(value)) {
        fieldErrors.push(rule.message || `${rule.field} format is invalid`);
      }

      if (rule.rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        fieldErrors.push(`${rule.field} must be a valid email address`);
      }

      if (rule.rules.numeric && !/^\d+$/.test(value)) {
        fieldErrors.push(`${rule.field} must contain only numbers`);
      }

      if (rule.rules.alpha && !/^[a-zA-Z]+$/.test(value)) {
        fieldErrors.push(`${rule.field} must contain only letters`);
      }

      if (rule.rules.alphaNumeric && !/^[a-zA-Z0-9]+$/.test(value)) {
        fieldErrors.push(`${rule.field} must contain only letters and numbers`);
      }

      if (rule.rules.custom) {
        const customResult = rule.rules.custom(value);
        if (customResult !== true) {
          fieldErrors.push(
            typeof customResult === "string"
              ? customResult
              : `${rule.field} is invalid`
          );
        }
      }

      if (fieldErrors.length > 0) {
        errors[rule.field] = fieldErrors.join(", ");
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
        message: "Please check your input and try again",
      });
    }

    next();
  };
};

// Common validation schemas
export const userValidation = [
  {
    field: "name",
    rules: {
      required: true,
      minLength: 2,
      maxLength: 50,
      alpha: true,
    },
    message: "Name must be 2-50 characters and contain only letters",
  },
  {
    field: "email",
    rules: {
      required: true,
      email: true,
      maxLength: 100,
    },
    message: "Valid email address is required",
  },
  {
    field: "password",
    rules: {
      required: true,
      minLength: 8,
      maxLength: 128,
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
    message:
      "Password must be 8-128 characters with uppercase, lowercase, number, and special character",
  },
];

export const clientValidation = [
  {
    field: "name",
    rules: {
      required: true,
      minLength: 2,
      maxLength: 100,
    },
    message: "Client name is required (2-100 characters)",
  },
  {
    field: "email",
    rules: {
      required: true,
      email: true,
      maxLength: 100,
    },
    message: "Valid email address is required",
  },
  {
    field: "phone",
    rules: {
      required: true,
      pattern: /^\+?[\d\s\-\(\)]+$/,
    },
    message: "Valid phone number is required",
  },
  {
    field: "address",
    rules: {
      required: true,
      minLength: 5,
      maxLength: 200,
    },
    message: "Address is required (5-200 characters)",
  },
];

export const petValidation = [
  {
    field: "name",
    rules: {
      required: true,
      minLength: 1,
      maxLength: 50,
      alphaNumeric: true,
    },
    message: "Pet name is required (1-50 characters, letters and numbers only)",
  },
  {
    field: "age",
    rules: {
      required: true,
      numeric: true,
      custom: (value: string) => {
        const age = parseInt(value);
        return age >= 0 && age <= 50;
      },
    },
    message: "Pet age must be a number between 0 and 50",
  },
  {
    field: "type",
    rules: {
      required: true,
      minLength: 2,
      maxLength: 30,
      alpha: true,
    },
    message: "Pet type is required (2-30 characters, letters only)",
  },
  {
    field: "breed",
    rules: {
      maxLength: 50,
      alpha: true,
    },
    message: "Breed must be letters only (max 50 characters)",
  },
  {
    field: "weight",
    rules: {
      numeric: true,
      custom: (value: string) => {
        const weight = parseFloat(value);
        return weight > 0 && weight <= 200;
      },
    },
    message: "Weight must be a positive number (max 200kg)",
  },
];

export const emergencyValidation = [
  {
    field: "petName",
    rules: {
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    message: "Pet name is required",
  },
  {
    field: "description",
    rules: {
      required: true,
      minLength: 10,
      maxLength: 500,
    },
    message: "Emergency description must be 10-500 characters",
  },
  {
    field: "location",
    rules: {
      required: true,
      minLength: 5,
      maxLength: 100,
    },
    message: "Location is required (5-100 characters)",
  },
  {
    field: "contactInfo",
    rules: {
      required: true,
      pattern: /^\+?[\d\s\-\(\)]+$/,
    },
    message: "Valid contact information is required",
  },
  {
    field: "type",
    rules: {
      required: true,
      custom: (value: string) =>
        ["critical", "urgent", "warning"].includes(value),
    },
    message: "Emergency type must be critical, urgent, or warning",
  },
];

export const appointmentValidation = [
  {
    field: "petName",
    rules: {
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    message: "Pet name is required",
  },
  {
    field: "dateTime",
    rules: {
      required: true,
      custom: (value: string) => {
        const date = new Date(value);
        return !isNaN(date.getTime()) && date > new Date();
      },
    },
    message: "Valid future appointment date and time is required",
  },
  {
    field: "type",
    rules: {
      required: true,
      maxLength: 50,
    },
    message: "Appointment type is required",
  },
  {
    field: "notes",
    rules: {
      maxLength: 500,
    },
    message: "Notes must not exceed 500 characters",
  },
];
