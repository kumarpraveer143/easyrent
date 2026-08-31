import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Alert } from "../components/UI";

/**
 * The old version layered a gradient wash, a dot grid and three blurred
 * animated "blobs" behind a frosted card that scaled on hover. None of it
 * helped anyone sign in.
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.success("Signed in");
        // The API no longer returns the password hash (SEC-08), but keep the
        // client defensive in case an older server is on the other end.
        const { password: _drop, ...user } = res.data.user ?? {};
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "We couldn't sign you in. Check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main" className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-display text-ink">Sign in</h1>
      <p className="mt-1 text-body text-ink-faint">
        Manage your rooms, tenants and rent.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && <Alert tone="danger">{error}</Alert>}

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" variant="primary" loading={loading} className="mt-1">
          {loading ? "Signing in…" : "Sign in"}
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
          <Link
            to="/forget-password"
            className="font-medium text-accent hover:text-accent-hover"
          >
            Forgot your password?
          </Link>
        </p>
      </div>
    </main>
  );
}
