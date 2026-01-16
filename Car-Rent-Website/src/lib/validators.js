import { z } from "zod";

function validateLuhn(cardNumber) {
  const testCards = [
    "4111111111111111", // Visa
    "5555555555554444", // Mastercard
    "378282246310005", // American Express
    "6011111111111117", // Discover
    "3530111333300000", // JCB
  ];

  const digitsOnly = cardNumber.replace(/\D/g, "");

  if (testCards.includes(digitsOnly)) {
    return true;
  }

  const digits = digitsOnly.split("").reverse();
  let sum = 0;

  for (let i = 0; i < digits.length; i++) {
    let digit = parseInt(digits[i], 10);

    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
  }

  return sum % 10 === 0;
}

function validateExpiry(expiryDate) {
  const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);

  if (month < 1 || month > 12) return false;

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYearLastTwo = currentYear % 100;

  if (year < currentYearLastTwo) return false;
  if (year === currentYearLastTwo && month < currentMonth) return false;

  return true;
}

function validatePhone(phone) {
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length === 9;
}

export const checkoutValidationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),

  fullName: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Full name must be at least 3 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine(validatePhone, "Phone number must be 9 digits"),

  cardName: z
    .string()
    .min(1, "Cardholder name is required")
    .min(3, "Cardholder name must be at least 3 characters")
    .regex(
      /^[a-zA-Z\s]+$/,
      "Cardholder name can only contain letters and spaces"
    ),

  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^[\d\s]{16,19}$/, "Card number must be 16 digits")
    .refine((value) => {
      const digitsOnly = value.replace(/\D/g, "");
      return digitsOnly.length === 16;
    }, "Card number must be 16 digits")
    .refine(validateLuhn, "Invalid card number"),

  cardExpiry: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^\d{2}\/\d{2}$/, "Expiry date must be in MM/YY format")
    .refine(validateExpiry, "Card has expired or invalid date"),

  cardCVC: z
    .string()
    .min(1, "CVC is required")
    .regex(/^\d{3,4}$/, "CVC must be 3-4 digits"),
});

export function validateField(
  fieldName,
  value,
  schema = checkoutValidationSchema
) {
  try {
    const fieldSchema = schema.pick({ [fieldName]: true });
    fieldSchema.parse({ [fieldName]: value });
    return { valid: true, error: null };
  } catch (error) {
    let errorMessage = "Validation error";

    if (error && typeof error === "object") {
      const issues = error.issues || error.errors || [];
      if (Array.isArray(issues) && issues.length > 0) {
        errorMessage = issues[0].message;
      }
    }

    return { valid: false, error: errorMessage };
  }
}

export function validateCheckoutForm(formData) {
  try {
    checkoutValidationSchema.parse(formData);
    return { valid: true, errors: {} };
  } catch (error) {
    const errors = {};

    if (error && typeof error === "object") {
      const issues = error.issues || error.errors || [];
      if (Array.isArray(issues)) {
        issues.forEach((issue) => {
          const fieldName = issue.path?.[0];
          if (fieldName) {
            errors[fieldName] = issue.message;
          }
        });
      }
    }

    return {
      valid: false,
      errors:
        Object.keys(errors).length > 0
          ? errors
          : { general: "Validation error" },
    };
  }
}

export function formatCardNumber(value) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
  return digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatExpiry(value) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
  if (digitsOnly.length >= 2) {
    return digitsOnly.slice(0, 2) + "/" + digitsOnly.slice(2, 4);
  }
  return digitsOnly;
}

export function formatPhone(value) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 9);
  if (digitsOnly.length <= 3) return digitsOnly;
  if (digitsOnly.length <= 6) {
    return digitsOnly.slice(0, 3) + "-" + digitsOnly.slice(3);
  }
  return (
    digitsOnly.slice(0, 3) +
    "-" +
    digitsOnly.slice(3, 6) +
    "-" +
    digitsOnly.slice(6)
  );
}

export const authValidationSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export function validateAuthForm(formData) {
  try {
    authValidationSchema.parse(formData);
    return { valid: true, errors: {} };
  } catch (error) {
    const errors = {};

    if (error && typeof error === "object" && "issues" in error) {
      const issues = error.issues || error.errors || [];
      if (Array.isArray(issues)) {
        issues.forEach((issue) => {
          const fieldName = issue.path?.[0];
          if (fieldName) {
            errors[fieldName] = issue.message;
          }
        });
      }
    } else if (
      error &&
      typeof error === "object" &&
      "errors" in error &&
      Array.isArray(error.errors)
    ) {
      error.errors.forEach((err) => {
        const fieldName = err.path?.[0];
        if (fieldName) {
          errors[fieldName] = err.message;
        }
      });
    }

    return {
      valid: false,
      errors:
        Object.keys(errors).length > 0
          ? errors
          : { general: "Validation error" },
    };
  }
}
