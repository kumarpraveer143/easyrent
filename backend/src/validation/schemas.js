import { z } from "zod";

/**
 * The API contract, enforced.
 *
 * Every controller used to read `req.body` raw. That is how `userType: "admin"`
 * reached the User model, how a Stripe amount of 1 reached checkout, and how a
 * malformed ObjectId reached mongoose and came back as a 500 instead of a 400.
 *
 * These schemas are the authoritative definition. `frontend/src/lib/validation.js`
 * mirrors them for inline field errors, but the server is what enforces —
 * the client copy is a convenience, never a control.
 */

// ---------------------------------------------------------------- shared ----

export const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "That id isn't valid.");

const email = z.email("Enter a valid email address.").toLowerCase().trim();

const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(128, "That's too long.")
  .refine((v) => /[a-zA-Z]/.test(v), "Include at least one letter.")
  .refine((v) => /[0-9]/.test(v), "Include at least one number.");

const phoneNumber = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number.");

const zipCode = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter a 6-digit PIN code.");

const addressSchema = z.object({
  street: z.string().trim().min(3, "Enter the street address.").max(200),
  city: z.string().trim().min(2, "Enter the city.").max(100),
  state: z.string().trim().min(2, "Enter the state.").max(100),
  zipCode,
});

/** Must be a real past date, and the person must be an adult. */
const dateOfBirth = z.coerce
  .date({ error: "Enter a valid date of birth." })
  .refine((d) => d < new Date(), "Date of birth can't be in the future.")
  .refine((d) => {
    const eighteen = new Date();
    eighteen.setFullYear(eighteen.getFullYear() - 18);
    return d <= eighteen;
  }, "You must be at least 18.")
  .refine((d) => d.getFullYear() > 1900, "Enter a valid date of birth.");

// ------------------------------------------------------------------ user ----

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(100),
  email,
  password,
  phoneNumber,
  dateOfBirth,
  homeAddress: addressSchema,
  houseName: z.string().trim().max(120).optional(),
  // Only these two are selectable. "admin" is a real value in the mongoose
  // enum, and accepting it from the request body is SEC-03.
  userType: z.enum(["renter", "landowner"], {
    error: "Choose whether you're renting or listing.",
  }),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const editProfileSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name.").max(100).optional(),
    phoneNumber: phoneNumber.optional(),
    dateOfBirth: dateOfBirth.optional(),
    homeAddress: addressSchema.optional(),
    houseName: z.string().trim().max(120).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, "Nothing to update.");

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    error: "Both passwords must match.",
    path: ["confirmPassword"],
  });

// ------------------------------------------------------------------ room ----

export const ROOM_TYPES = ["single", "shared", "studio", "apartment", "house"];

export const createRoomSchema = z.object({
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

/** Same fields, all optional — but `owner` and `isAvailable` are never accepted. */
export const updateRoomSchema = createRoomSchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, "Nothing to update.");

export const roomIdParam = z.object({ id: objectId });
export const roomIdParamAlt = z.object({ roomId: objectId });

export const availableRoomQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
});

export const searchQuery = z
  .object({
    state: z.string().trim().min(2).max(100).optional(),
    city: z.string().trim().min(2).max(100).optional(),
    district: z.string().trim().min(2).max(100).optional(),
  })
  .refine(
    (v) => v.state || v.city || v.district,
    "Give us at least a state, city or district to search by."
  );

// --------------------------------------------------------- relationships ----

export const acceptSchema = z.object({
  roomId: objectId,
  renterId: objectId,
});

export const rejectSchema = acceptSchema;

export const roomIdBody = z.object({ roomId: objectId });
export const relationIdBody = z.object({ relationId: objectId });
export const relationIdParam = z.object({ relationId: objectId });

// --------------------------------------------------------------- history ----

export const createHistorySchema = z.object({
  rentPaid: z.coerce
    .number({ error: "Enter the amount paid." })
    .min(1, "Amount must be more than zero.")
    .max(10000000, "That amount looks wrong — check it."),
  date: z.coerce
    .date({ error: "Enter a valid date." })
    .refine((d) => d <= new Date(), "A payment can't be dated in the future."),
  paymentMethod: z.enum(["Cash", "Online", "other"]).default("other"),
  remarks: z.string().trim().max(500, "Keep remarks under 500 characters.").optional(),
});

export const updateHistorySchema = createHistorySchema
  .partial()
  .refine((v) => Object.keys(v).length > 0, "Nothing to update.");

export const historyIdParam = z.object({ historyId: objectId });

// --------------------------------------------------------------- payment ----

/**
 * Note what is NOT here: `amount`. The charge is derived server-side from the
 * unit's rent — accepting it from the browser was SEC-04.
 */
export const checkoutSchema = z.object({
  relationId: objectId,
});

export const sessionIdParam = z.object({
  sessionId: z.string().trim().min(8).max(200),
});

// ------------------------------------------------------------------ chat ----

export const chatReadSchema = z.object({ relationId: objectId });

// --------------------------------------------------------- notifications ----

export const notificationIdParam = z.object({ id: objectId });
