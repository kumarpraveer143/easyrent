import { z } from "zod";

/**
 * Client-side mirror of `backend/src/validation/schemas.js`.
 *
 * These exist so a field can go red the moment you leave it, instead of after
 * a round trip. They are a CONVENIENCE, never a control — the server enforces,
 * and the server's messages win when the two disagree (see `useForm`, which
 * merges server field errors back into the same shape).
 *
 * Keep the rules here in step with the backend file. If they drift, the worst
 * case is a form that lets you submit something the API rejects — annoying,
 * never unsafe.
 */

export const email = z.email("Enter a valid email address.").trim();

export const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(128, "That's too long.")
  .refine((v) => /[a-zA-Z]/.test(v), "Include at least one letter.")
  .refine((v) => /[0-9]/.test(v), "Include at least one number.");

export const phoneNumber = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number.");

export const zipCode = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter a 6-digit PIN code.");

export const addressSchema = z.object({
  street: z.string().trim().min(3, "Enter the street address.").max(200),
  city: z.string().trim().min(2, "Enter the city.").max(100),
  state: z.string().trim().min(2, "Enter the state.").max(100),
  zipCode,
});

export const dateOfBirth = z.coerce
  .date({ error: "Enter a valid date of birth." })
  .refine((d) => d < new Date(), "Date of birth can't be in the future.")
  .refine((d) => {
    const eighteen = new Date();
    eighteen.setFullYear(eighteen.getFullYear() - 18);
    return d <= eighteen;
  }, "You must be at least 18.")
  .refine((d) => d.getFullYear() > 1900, "Enter a valid date of birth.");

export const ROOM_TYPES = ["single", "shared", "studio", "apartment", "house"];

// ------------------------------------------------------------------ forms ---

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email,
  password,
  phoneNumber,
  dateOfBirth,
  homeAddress: addressSchema,
  houseName: z.string().trim().max(120).optional().or(z.literal("")),
  userType: z.enum(["renter", "landowner"], {
    error: "Choose whether you're renting or listing.",
  }),
});

export const roomSchema = z.object({
  roomNumber: z.coerce
    .number({ error: "Enter a room number." })
    .int("Room number must be a whole number.")
    .min(0)
    .max(99999),
  address: addressSchema,
  rentPrice: z.coerce
    .number({ error: "Enter the monthly rent." })
    .min(1, "Rent must be more than zero.")
    .max(10000000, "That rent looks wrong — check the amount."),
  roomType: z.enum(ROOM_TYPES, { error: "Choose a room type." }),
  numberOfRooms: z.coerce
    .number({ error: "Enter the number of rooms." })
    .int()
    .min(1, "There must be at least one room.")
    .max(50),
  numberOfBathrooms: z.coerce
    .number({ error: "Enter the number of bathrooms." })
    .int()
    .min(1, "There must be at least one bathroom.")
    .max(50),
});

export const rentRecordSchema = z.object({
  rentPaid: z.coerce
    .number({ error: "Enter the amount paid." })
    .min(1, "Amount must be more than zero.")
    .max(10000000, "That amount looks wrong — check it."),
  date: z.coerce
    .date({ error: "Enter a valid date." })
    .refine((d) => d <= new Date(), "A payment can't be dated in the future."),
  paymentMethod: z.enum(["Cash", "Online", "other"]),
  remarks: z
    .string()
    .trim()
    .max(500, "Keep remarks under 500 characters.")
    .optional()
    .or(z.literal("")),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    error: "Both passwords must match.",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  phoneNumber,
  dateOfBirth,
  homeAddress: addressSchema,
  houseName: z.string().trim().max(120).optional().or(z.literal("")),
});

// ----------------------------------------------------------------- helpers --

/**
 * Flatten zod's issues into { "homeAddress.city": "Enter the city." } so a
 * nested field can look up its own error by path.
 */
export function fieldErrors(error) {
  const out = {};
  for (const issue of error?.issues ?? []) {
    const key = issue.path.join(".") || "_";
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Validate one field in isolation, by path, against a whole-form schema. */
export function validateField(schema, path, values) {
  const result = schema.safeParse(values);
  if (result.success) return undefined;
  return fieldErrors(result.error)[path];
}
