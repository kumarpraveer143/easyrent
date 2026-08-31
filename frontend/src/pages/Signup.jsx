import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Button, Input, Select, Alert, Section } from "../components/UI";
import { signupSchema } from "../lib/validation";
import useForm from "../lib/useForm";

/**
 * The old signup was 451 lines of gradient wash, blurred blobs and hand-rolled
 * inputs with no validation beyond `required` — so a 3-digit phone number or a
 * date of birth in 1823 reached the API and came back as a mongoose
 * ValidationError string.
 *
 * Every field now validates against the same rules the server enforces, and
 * says what's wrong the moment you leave the field.
 */
export default function Signup() {
  const navigate = useNavigate();

  const { field, handleSubmit, submitting, formError } = useForm({
    schema: signupSchema,
    initialValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      dateOfBirth: "",
      houseName: "",
      userType: "renter",
      homeAddress: { street: "", city: "", state: "", zipCode: "" },
    },
    onSubmit: async (data, { setServerErrors }) => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, data, {
          withCredentials: true,
        });
        toast.success("Account created — sign in to continue.");
        navigate("/login");
      } catch (err) {
        const body = err.response?.data;
        setServerErrors({
          ...(body?.errors ?? {}),
          ...(body?.errors
            ? {}
            : { _: body?.message ?? "We couldn't create your account. Try again." }),
        });
      }
    },
  });

  const isLandowner = field("userType").value === "landowner";

  return (
    <main id="main" className="mx-auto w-full max-w-xl px-4 py-12">
      <h1 className="text-display text-ink">Create an account</h1>
      <p className="mt-1 text-body text-ink-faint">
        One account, whether you&rsquo;re renting a room or listing one.
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8">
        {formError && <Alert tone="danger" className="mb-5">{formError}</Alert>}

        <Section title="You">
          <div className="flex flex-col gap-4">
            <Select label="I want to" required {...field("userType")}>
              <option value="renter">Rent a room</option>
              <option value="landowner">List a room</option>
            </Select>

            <Input label="Full name" required autoComplete="name" {...field("name")} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                {...field("email")}
              />
              <Input
                label="Mobile number"
                type="tel"
                required
                autoComplete="tel"
                inputMode="numeric"
                placeholder="9876543210"
                hint="10 digits, starting 6–9"
                {...field("phoneNumber")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Date of birth"
                type="date"
                required
                autoComplete="bday"
                {...field("dateOfBirth")}
              />
              <Input
                label="Password"
                type="password"
                required
                autoComplete="new-password"
                hint="At least 8 characters, with a letter and a number"
                {...field("password")}
              />
            </div>

            {isLandowner && (
              <Input
                label="Property name"
                hint="Optional — shown to your tenants"
                placeholder="e.g. Iyer Nilayam"
                {...field("houseName")}
              />
            )}
          </div>
        </Section>

        <Section title="Your address">
          <div className="flex flex-col gap-4">
            <Input
              label="Street address"
              required
              autoComplete="street-address"
              {...field("homeAddress.street")}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="City" required autoComplete="address-level2" {...field("homeAddress.city")} />
              <Input label="State" required autoComplete="address-level1" {...field("homeAddress.state")} />
              <Input
                label="PIN code"
                required
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="560001"
                {...field("homeAddress.zipCode")}
              />
            </div>
          </div>
        </Section>

        <div className="flex items-center gap-3 border-t border-line pt-5">
          <Button type="submit" variant="primary" loading={submitting}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
          <p className="text-body text-ink-faint">
            Already have one?{" "}
            <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}
