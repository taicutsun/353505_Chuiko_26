import { useState, useCallback } from "react";

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
    custom?: (value: unknown) => boolean | string;
  };
  message?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateField = (
  value: unknown,
  rule: ValidationRule
): ValidationError | null => {
  const errors: string[] = [];

  // Check if field exists
  if (
    rule.rules.required &&
    (value === undefined || value === null || value === "")
  ) {
    errors.push(rule.message || `${rule.field} is required`);
    return { field: rule.field, message: errors.join(", ") };
  }

  // Skip validation if field is not required and empty
  if (
    !rule.rules.required &&
    (value === undefined || value === null || value === "")
  ) {
    return null;
  }

  // Type guard for string operations
  const stringValue = String(value);

  // Type validations
  if (rule.rules.minLength && stringValue.length < rule.rules.minLength) {
    errors.push(
      `${rule.field} must be at least ${rule.rules.minLength} characters`
    );
  }

  if (rule.rules.maxLength && stringValue.length > rule.rules.maxLength) {
    errors.push(
      `${rule.field} must not exceed ${rule.rules.maxLength} characters`
    );
  }

  if (rule.rules.pattern && !rule.rules.pattern.test(stringValue)) {
    errors.push(rule.message || `${rule.field} format is invalid`);
  }

  if (rule.rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
    errors.push(`${rule.field} must be a valid email address`);
  }

  if (rule.rules.numeric && !/^\d+$/.test(stringValue)) {
    errors.push(`${rule.field} must contain only numbers`);
  }

  if (rule.rules.alpha && !/^[a-zA-Z]+$/.test(stringValue)) {
    errors.push(`${rule.field} must contain only letters`);
  }

  if (rule.rules.alphaNumeric && !/^[a-zA-Z0-9]+$/.test(stringValue)) {
    errors.push(`${rule.field} must contain only letters and numbers`);
  }

  if (rule.rules.custom) {
    const customResult = rule.rules.custom(value);
    if (customResult !== true) {
      errors.push(
        typeof customResult === "string"
          ? customResult
          : `${rule.field} is invalid`
      );
    }
  }

  return errors.length > 0
    ? { field: rule.field, message: errors.join(", ") }
    : null;
};

export const validateForm = (
  data: Record<string, unknown>,
  rules: ValidationRule[]
): ValidationResult => {
  const errors: ValidationError[] = [];

  for (const rule of rules) {
    const error = validateField(data[rule.field], rule);
    if (error) {
      errors.push(error);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Common validation schemas
export const clientValidationRules: ValidationRule[] = [
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
      pattern: /^\+?[\d\s\-()]+$/,
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

export const petValidationRules: ValidationRule[] = [
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
      custom: (value: unknown) => {
        const age = parseInt(String(value));
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
      custom: (value: unknown) => {
        const weight = parseFloat(String(value));
        return weight > 0 && weight <= 200;
      },
    },
    message: "Weight must be a positive number (max 200kg)",
  },
];

export const emergencyValidationRules: ValidationRule[] = [
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
      pattern: /^\+?[\d\s\-()]+$/,
    },
    message: "Valid contact information is required",
  },
  {
    field: "type",
    rules: {
      required: true,
      custom: (value: unknown) =>
        ["critical", "urgent", "warning"].includes(String(value)),
    },
    message: "Emergency type must be critical, urgent, or warning",
  },
];

export const appointmentValidationRules: ValidationRule[] = [
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
      custom: (value: unknown) => {
        const date = new Date(String(value));
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

// React Hook for form validation
export const useFormValidation = (
  initialData: Record<string, unknown>,
  rules: ValidationRule[]
) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback(() => {
    const result = validateForm(data, rules);
    setErrors(result.errors);
    return result.isValid;
  }, [data, rules]);

  const setFieldValue = useCallback(
    (field: string, value: unknown) => {
      setData((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));

      // Validate field on change
      const rule = rules.find((r) => r.field === field);
      if (rule) {
        const error = validateField(value, rule);
        setErrors((prev) => {
          const filtered = prev.filter((e) => e.field !== field);
          return error ? [...filtered, error] : filtered;
        });
      }
    },
    [rules]
  );

  const setFieldTouched = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const getFieldError = useCallback(
    (field: string) => {
      return errors.find((e) => e.field === field)?.message;
    },
    [errors]
  );

  const resetForm = useCallback(() => {
    setData(initialData);
    setErrors([]);
    setTouched({});
  }, [initialData]);

  return {
    data,
    errors,
    touched,
    validate,
    setFieldValue,
    setFieldTouched,
    getFieldError,
    resetForm,
    isValid: errors.length === 0,
  };
};
