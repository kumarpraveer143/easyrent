import { useCallback, useMemo, useState } from "react";
import { fieldErrors } from "./validation.js";

/** Read/write a possibly-nested path like "homeAddress.city". */
const getPath = (obj, path) =>
  path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);

const setPath = (obj, path, value) => {
  const keys = path.split(".");
  const next = Array.isArray(obj) ? [...obj] : { ...obj };
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cursor[k] = cursor[k] && typeof cursor[k] === "object" ? { ...cursor[k] } : {};
    cursor = cursor[k];
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
};

/**
 * A small zod-backed form hook. Deliberately not react-hook-form: this app
 * has a handful of forms and one more dependency isn't worth it.
 *
 * Behaviour that matters:
 *  - a field shows its error only after it's been BLURRED or submit attempted,
 *    so you aren't scolded while typing your email
 *  - once a field has an error, it re-validates on every keystroke, so the
 *    error clears the moment it's fixed
 *  - `setServerErrors` merges the API's field errors into the same shape, so
 *    server-side rules the client doesn't mirror still land on the right input
 */
export function useForm({ schema, initialValues, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServer] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const clientErrors = useMemo(() => {
    const result = schema.safeParse(values);
    return result.success ? {} : fieldErrors(result.error);
  }, [schema, values]);

  const errors = useMemo(
    () => ({ ...clientErrors, ...serverErrors }),
    [clientErrors, serverErrors]
  );

  const showError = useCallback(
    (path) => (submitted || touched[path] ? errors[path] : undefined),
    [submitted, touched, errors]
  );

  const setValue = useCallback((path, value) => {
    setValues((v) => setPath(v, path, value));
    // A server error is stale the moment the user edits that field.
    setServer((s) => {
      if (!(path in s)) return s;
      const { [path]: _drop, ...rest } = s;
      return rest;
    });
  }, []);

  /** Spread onto an input: `{...field("email")}` wires value, change and blur. */
  const field = useCallback(
    (path) => ({
      name: path,
      value: getPath(values, path) ?? "",
      error: showError(path),
      onChange: (e) => setValue(path, e.target.value),
      onBlur: () => setTouched((t) => ({ ...t, [path]: true })),
    }),
    [values, showError, setValue]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setSubmitted(true);

      const result = schema.safeParse(values);
      if (!result.success) {
        // Put focus on the first thing that's wrong.
        const first = result.error.issues[0]?.path.join(".");
        if (first) {
          document.querySelector(`[name="${CSS.escape(first)}"]`)?.focus();
        }
        return;
      }

      setSubmitting(true);
      try {
        await onSubmit(result.data, { setServerErrors: setServer });
      } finally {
        setSubmitting(false);
      }
    },
    [schema, values, onSubmit]
  );

  return {
    values,
    setValue,
    field,
    errors,
    showError,
    submitting,
    handleSubmit,
    setServerErrors: setServer,
    formError: serverErrors._ ?? (submitted ? errors._ : undefined),
  };
}

export default useForm;
