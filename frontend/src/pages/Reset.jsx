import React from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Input, Alert } from "../components/UI";
import { resetPasswordSchema } from "../lib/validation";
import useForm from "../lib/useForm";

export default function Reset() {
  const { token } = useParams();
  const navigate = useNavigate();

  const { field, handleSubmit, submitting, formError } = useForm({
    schema: resetPasswordSchema,
    initialValues: { password: "", confirmPassword: "" },
    onSubmit: async (data, { setServerErrors }) => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/users/password/reset/${token}`,
          data
        );
        toast.success("Password changed. Sign in with your new one.");
        navigate("/login");
      } catch (err) {
        const body = err.response?.data;
        setServerErrors({
          ...(body?.errors ?? {}),
          ...(body?.errors
            ? {}
            : {
                _:
                  body?.message ??
                  "That reset link is invalid or has expired. Request a new one.",
              }),
        });
      }
    },
  });

  return (
    <main id="main" className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="text-display text-ink">Set a new password</h1>
      <p className="mt-1 text-body text-ink-faint">
        At least 8 characters, with a letter and a number.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        {formError && <Alert tone="danger">{formError}</Alert>}

        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          {...field("password")}
        />
        <Input
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          {...field("confirmPassword")}
        />

        <Button type="submit" variant="primary" loading={submitting}>
          {submitting ? "Saving…" : "Change password"}
        </Button>
      </form>

      <p className="mt-6 border-t border-line pt-5 text-body text-ink-faint">
        Link expired?{" "}
        <Link to="/forget-password" className="font-medium text-accent hover:text-accent-hover">
          Request a new one
        </Link>
      </p>
    </main>
  );
}
