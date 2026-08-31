import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button, Input, Alert } from "../components/UI";
import { forgotPasswordSchema } from "../lib/validation";
import useForm from "../lib/useForm";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);

  const { field, handleSubmit, submitting, formError } = useForm({
    schema: forgotPasswordSchema,
    initialValues: { email: "" },
    onSubmit: async (data, { setServerErrors }) => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/users/password/forget`, data);
        setSent(true);
      } catch (err) {
        const body = err.response?.data;
        // A 429 here is the mail rate limit doing its job — say what it means.
        if (err.response?.status === 429) {
          setServerErrors({ _: "Too many reset attempts. Wait a few minutes and try again." });
          return;
        }
        setServerErrors({
          ...(body?.errors ?? {}),
          ...(body?.errors
            ? {}
            : { _: body?.message ?? "Couldn't send the reset link. Try again." }),
        });
      }
    },
  });

  return (
    <main id="main" className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-display text-ink">Reset your password</h1>

      {sent ? (
        <>
          <Alert tone="ok" className="mt-5">
            If an account exists for that address, we&rsquo;ve sent a reset link. It
            expires in 10 minutes.
          </Alert>
          <p className="mt-5 text-body text-ink-faint">
            Didn&rsquo;t arrive? Check spam, then{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="rounded font-medium text-accent hover:text-accent-hover"
            >
              try again
            </button>
            .
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-body text-ink-faint">
            We&rsquo;ll email you a link to set a new one.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            {formError && <Alert tone="danger">{formError}</Alert>}

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...field("email")}
            />

            <Button type="submit" variant="primary" loading={submitting}>
              {submitting ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        </>
      )}

      <p className="mt-6 border-t border-line pt-5 text-body text-ink-faint">
        Remembered it?{" "}
        <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
          Sign in
        </Link>
      </p>
    </main>
  );
}
