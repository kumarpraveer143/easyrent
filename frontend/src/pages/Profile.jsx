import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Page,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Alert,
  Badge,
  Skeleton,
  LoadingAnnounce,
  date as fmtDate,
  address as fmtAddress,
} from "../components/UI";
import { profileSchema } from "../lib/validation";
import useForm from "../lib/useForm";

const API = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const { field, handleSubmit, submitting, formError } = useForm({
    schema: profileSchema,
    initialValues: {
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "",
      houseName: user?.houseName ?? "",
      homeAddress: {
        street: user?.homeAddress?.street ?? "",
        city: user?.homeAddress?.city ?? "",
        state: user?.homeAddress?.state ?? "",
        zipCode: user?.homeAddress?.zipCode ?? "",
      },
    },
    onSubmit: async (data, { setServerErrors }) => {
      try {
        const res = await axios.put(`${API}/users/editprofile`, data, {
          withCredentials: true,
        });
        const updated = res.data.user ?? {};
        // Keep only what the API returns — it no longer sends the password
        // hash, and localStorage should never hold more than it must.
        localStorage.setItem("user", JSON.stringify({ ...user, ...updated }));
        setUser((u) => ({ ...u, ...updated }));
        setEditing(false);
        toast.success("Profile updated.");
      } catch (err) {
        const body = err.response?.data;
        setServerErrors({
          ...(body?.errors ?? {}),
          ...(body?.errors
            ? {}
            : { _: body?.message ?? "Couldn't save your profile. Try again." }),
        });
      }
    },
  });

  if (loading) {
    return (
      <Page width="narrow">
        <LoadingAnnounce>Loading your profile</LoadingAnnounce>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-64 w-full" />
      </Page>
    );
  }

  if (!user) {
    return (
      <Page width="narrow">
        <Alert tone="danger">Couldn&rsquo;t read your profile. Try signing in again.</Alert>
      </Page>
    );
  }

  return (
    <Page width="narrow">
      <PageHeader
        title="Profile"
        description="Your details, as your landlord or tenants see them."
        actions={
          !editing && (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )
        }
      />

      {!editing ? (
        <Card>
          <CardHeader
            title={user.name}
            description={user.email}
            action={
              <Badge tone="neutral">
                {user.userType === "landowner" ? "Landlord" : "Renter"}
              </Badge>
            }
          />
          <CardBody>
            <dl className="flex flex-col gap-3">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-faint">Phone</dt>
                <dd className="text-ink">{user.phoneNumber || "—"}</dd>
              </div>
              {user.userType === "landowner" && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-faint">Property name</dt>
                  <dd className="text-ink">{user.houseName || "—"}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4">
                <dt className="text-ink-faint">Date of birth</dt>
                <dd className="text-ink">{user.dateOfBirth ? fmtDate(user.dateOfBirth) : "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-ink-faint">Address</dt>
                <dd className="text-right text-ink">{fmtAddress(user.homeAddress)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="text-ink-faint">Member since</dt>
                <dd className="text-ink">{fmtDate(user.createdAt)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          {formError && (
            <Alert tone="danger" className="mb-5">
              {formError}
            </Alert>
          )}

          <Card className="mb-5">
            <CardBody className="flex flex-col gap-4">
              <Input label="Full name" required {...field("name")} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Mobile number"
                  required
                  inputMode="numeric"
                  hint="10 digits, starting 6–9"
                  {...field("phoneNumber")}
                />
                <Input label="Date of birth" type="date" required {...field("dateOfBirth")} />
              </div>
              {user.userType === "landowner" && (
                <Input label="Property name" {...field("houseName")} />
              )}
            </CardBody>
          </Card>

          <Card className="mb-5">
            <CardHeader title="Address" />
            <CardBody className="flex flex-col gap-4">
              <Input label="Street" required {...field("homeAddress.street")} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="City" required {...field("homeAddress.city")} />
                <Input label="State" required {...field("homeAddress.state")} />
                <Input
                  label="PIN code"
                  required
                  inputMode="numeric"
                  {...field("homeAddress.zipCode")}
                />
              </div>
            </CardBody>
          </Card>

          <div className="flex gap-2">
            <Button type="submit" variant="primary" loading={submitting}>
              {submitting ? "Saving…" : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Email is the account identifier and password changes aren't built
          yet — say so rather than showing a control that does nothing. */}
      <p className="mt-6 text-label text-ink-faint">
        Your email address is your sign-in and can&rsquo;t be changed here. Changing your
        password isn&rsquo;t available yet — use{" "}
        <a href="/forget-password" className="rounded text-accent hover:text-accent-hover">
          reset password
        </a>{" "}
        for now.
      </p>
    </Page>
  );
}
