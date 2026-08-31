import { z } from "zod";

/**
 * Validates and REPLACES req.body / req.params / req.query with the parsed
 * result, so controllers downstream receive coerced, trimmed, known-shaped
 * data — and anything not in the schema is stripped rather than passed on.
 *
 * That stripping is the point. `registerUser` used to hand `req.body` straight
 * to the model, and `userType` is a real field whose enum includes "admin".
 *
 * Usage:
 *   validate({ body: registerSchema })
 *   validate({ params: roomIdParam, body: updateRoomSchema })
 */
export function validate(schemas) {
  return (req, res, next) => {
    const fieldErrors = {};

    for (const key of ["body", "params", "query"]) {
      const schema = schemas[key];
      if (!schema) continue;

      const result = schema.safeParse(req[key]);
      if (!result.success) {
        const flat = z.flattenError(result.error);
        for (const [field, messages] of Object.entries(flat.fieldErrors ?? {})) {
          if (messages?.length) fieldErrors[field] = messages[0];
        }
        // Object-level refinements (password mismatch, "nothing to update")
        // land in formErrors rather than against a field.
        if (flat.formErrors?.length) {
          fieldErrors._ = flat.formErrors[0];
        }
        continue;
      }

      // req.query is a getter on newer Express; assign defensively.
      try {
        req[key] = result.data;
      } catch {
        Object.defineProperty(req, key, { value: result.data, writable: true });
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        success: false,
        message: fieldErrors._ ?? "Please check the highlighted fields.",
        errors: fieldErrors,
      });
    }

    next();
  };
}

export default validate;
