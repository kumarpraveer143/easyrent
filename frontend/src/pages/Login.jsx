import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Alert } from "../components/UI";
import { loginSchema } from "../lib/validation";
import useForm from "../lib/useForm";

export default function Login() {
  const navigate = useNavigate();

  const { field, handleSubmit, submitting, formError } = useForm({
    schema: loginSchema,
    initialValues: { email: "", password: "" },
    onSubmit: async (data, { setServerErrors }) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/users/login`,
          data,
          { withCredentials: true }
        );

        toast.success("Signed in");
        // The API no longer returns the password hash (SEC-08), but stay
        // defensive in case an older server is on the other end.
        const { password: _drop, ...user } = res.data.user ?? {};
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      } catch (err) {
        const body = err.response?.data;
        // The API returns { errors: { field: message } } for validation
        // failures — merge those onto the right inputs rather than dumping one
        // generic banner.
        setServerErrors({
          ...(body?.errors ?? {}),
          ...(body?.errors ? {} : { _: body?.message ?? "We couldn't sign you in. Check your email and password." }),
        });
      }
    },
  });

  return (
    <main id="main" className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-display text-ink">Sign in</h1>
      <p className="mt-1 text-body text-ink-faint">Manage your rooms, tenants and rent.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
        {formError && <Alert tone="danger">{formError}</Alert>}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...field("email")}
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          {...field("password")}
        />

        <Button type="submit" variant="primary" loading={submitting} className="mt-1">
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-5 flex flex-col gap-1.5 border-t border-line pt-5 text-body text-ink-faint">
        <p>
          New here?{" "}
          <Link to="/signup" className="font-medium text-accent hover:text-accent-hover">
            Create an account
          </Link>
        </p>
        <p>
          <Link to="/forget-password" className="font-medium text-accent hover:text-accent-hover">
            Forgot your password?
          </Link>
        </p>
      </div>
    </main>
  );
}
