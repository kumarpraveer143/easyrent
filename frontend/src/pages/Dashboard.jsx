import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Page,
  PageHeader,
  Section,
  Card,
  Badge,
  Stat,
  StatRow,
  Skeleton,
  LoadingAnnounce,
  Alert,
  money,
} from "../components/UI";

const API = import.meta.env.VITE_API_URL;

/**
 * The dashboard used to be a static grid of links plus three cards that said
 * "Your account is active", "Stay updated with real-time notifications" and
 * "Customize your preferences" — no data, no numbers, nothing that changes
 * based on what's actually happening.
 *
 * It now answers the questions the two roles actually open the app to ask:
 *   landlord — how many units do I have, how many are let, who's waiting?
 *   renter   — where do I live, what do I pay, what have I applied for?
 */

const LANDLORD_LINKS = [
  { to: "/landowner-rooms", label: "My rooms", desc: "Edit listings and availability" },
  { to: "/uploadrooms", label: "Add a room", desc: "List a new unit" },
  { to: "/my-renters", label: "Tenants", desc: "Current tenancies and rent" },
  { to: "/incoming-request", label: "Applications", desc: "People who applied" },
  { to: "/archieved-renters", label: "Past tenants", desc: "Archived tenancies" },
  { to: "/payment-history", label: "Payments", desc: "Rent collected" },
];

const RENTER_LINKS = [
  { to: "/findrooms", label: "Find a room", desc: "Browse available listings" },
  { to: "/rentersMyRoom", label: "My room", desc: "Your current tenancy" },
  { to: "/renter-history", label: "Rent paid", desc: "Your payment record" },
  { to: "/favouriteRooms", label: "Saved", desc: "Rooms you've shortlisted" },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    try {
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch {
      setUser(null);
    }

    const load = async () => {
      let parsed = null;
      try {
        parsed = JSON.parse(localStorage.getItem("user"));
      } catch {
        parsed = null;
      }
      if (!parsed) {
        setLoading(false);
        return;
      }

      try {
        if (parsed.userType === "landowner") {
          // Both requests go out together rather than in a waterfall.
          const [roomsRes, rentersRes] = await Promise.all([
            axios.get(`${API}/rooms/myRoom`, { withCredentials: true }),
            axios.get(`${API}/relationship/getRenters`, { withCredentials: true }),
          ]);

          const rooms = roomsRes.data.message ?? [];
          const renters = rentersRes.data.renters ?? [];
          const active = renters.filter((r) => r.renterStatus === "active");

          if (cancelled) return;
          setStats({
            role: "landowner",
            rooms: rooms.length,
            let: active.length,
            vacant: rooms.filter((r) => r.isAvailable).length,
            applications: rooms.reduce((n, r) => n + (r.requestCount ?? 0), 0),
            monthlyRent: active.reduce((n, r) => n + (r.roomDetails?.rentPrice ?? 0), 0),
            tenants: active,
          });
        } else {
          const [engagedRes, favRes] = await Promise.all([
            axios.get(`${API}/relationship/engaged`, { withCredentials: true }),
            axios.get(`${API}/favourite/myfavourite`, { withCredentials: true }),
          ]);

          const engaged = engagedRes.data.message === true;
          let room = null;
          if (engaged) {
            const roomRes = await axios.get(`${API}/relationship/getRoomDetails`, {
              withCredentials: true,
            });
            room = roomRes.data.room ?? null;
          }

          if (cancelled) return;
          setStats({
            role: "renter",
            engaged,
            room,
            saved: (favRes.data.rooms ?? []).filter(Boolean).length,
          });
        }
      } catch {
        if (!cancelled) setError("Couldn't load your dashboard. Refresh to try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const isLandlord = user?.userType === "landowner";
  const links = isLandlord ? LANDLORD_LINKS : RENTER_LINKS;

  return (
    <Page width="wide">
      <PageHeader
        title={user?.name ? `Hello, ${user.name}` : "Dashboard"}
        description={
          isLandlord
            ? "Your properties, tenants and rent at a glance."
            : "Your tenancy, payments and saved rooms."
        }
        actions={
          <Badge tone="neutral">{isLandlord ? "Landlord" : "Renter"}</Badge>
        }
      />

      {error && (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      )}

      <Section>
        {loading ? (
          <>
            <LoadingAnnounce>Loading your dashboard</LoadingAnnounce>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded border border-line bg-line sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-surface px-4 py-3.5">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="mt-2 h-7 w-14" />
                </div>
              ))}
            </div>
          </>
        ) : stats?.role === "landowner" ? (
          <StatRow>
            <Stat label="Rooms listed" value={stats.rooms} />
            <Stat label="Let" value={stats.let} tone={stats.let > 0 ? "ok" : "default"} />
            <Stat label="Vacant" value={stats.vacant} />
            <Stat
              label="Rent per month"
              value={money(stats.monthlyRent)}
              hint={stats.let === 0 ? "No active tenancies" : `${stats.let} tenancy${stats.let === 1 ? "" : "ies"}`}
            />
          </StatRow>
        ) : stats?.role === "renter" ? (
          <StatRow className="sm:grid-cols-3">
            <Stat
              label="Current room"
              value={stats.engaged && stats.room ? `#${stats.room.roomDetails?.roomNumber ?? "—"}` : "None"}
              hint={stats.engaged ? stats.room?.houseName ?? "" : "You're not renting yet"}
            />
            <Stat
              label="Rent per month"
              value={stats.engaged ? money(stats.room?.roomDetails?.rentPrice) : "—"}
            />
            <Stat label="Saved rooms" value={stats.saved} />
          </StatRow>
        ) : null}
      </Section>

      {/* The landlord's most actionable number gets its own callout, because
          an application sitting unanswered is the thing that costs them money. */}
      {!loading && stats?.role === "landowner" && stats.applications > 0 && (
        <Section>
          <Alert tone="warn">
            <span className="font-medium">
              {stats.applications} {stats.applications === 1 ? "person has" : "people have"} applied
            </span>{" "}
            to your rooms.{" "}
            <Link to="/incoming-request" className="font-medium text-warn underline underline-offset-2">
              Review applications
            </Link>
          </Alert>
        </Section>
      )}

      {!loading && stats?.role === "landowner" && stats.rooms === 0 && (
        <Section>
          <Alert tone="info">
            You haven&rsquo;t listed a room yet.{" "}
            <Link to="/uploadrooms" className="font-medium text-accent underline underline-offset-2">
              Add your first one
            </Link>{" "}
            so renters can find it.
          </Alert>
        </Section>
      )}

      <Section title="Manage">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <Card key={l.to} interactive className="p-0">
              <Link to={l.to} className="block rounded px-4 py-3.5">
                <span className="block text-body font-medium text-ink">{l.label}</span>
                <span className="mt-0.5 block text-label text-ink-faint">{l.desc}</span>
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      {!loading && stats?.role === "landowner" && stats.tenants?.length > 0 && (
        <Section title="Current tenants" description="Who is in which room right now.">
          <Card>
            <ul className="divide-y divide-line">
              {stats.tenants.slice(0, 5).map((t) => (
                <li key={t.relationId} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-body font-medium text-ink">
                      {t.renterDetails?.name ?? "Unknown"}
                    </p>
                    <p className="text-label text-ink-faint">
                      Room {t.roomDetails?.roomNumber ?? "—"}
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-body text-ink">
                    {money(t.roomDetails?.rentPrice)}
                  </span>
                </li>
              ))}
            </ul>
            {stats.tenants.length > 5 && (
              <div className="border-t border-line px-4 py-2.5">
                <Link to="/my-renters" className="text-label font-medium text-accent hover:text-accent-hover">
                  View all {stats.tenants.length} tenants
                </Link>
              </div>
            )}
          </Card>
        </Section>
      )}
    </Page>
  );
}
