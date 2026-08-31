import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import districtData from "../../public/utils/districtData.json";
import RoomCard from "../components/RoomCard";
import {
  Page,
  PageHeader,
  Card,
  Button,
  Input,
  Select,
  Badge,
  EmptyState,
  SkeletonCard,
  LoadingAnnounce,
  Alert,
  money,
} from "../components/UI";

const API = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 12;

const ROOM_TYPES = ["single", "shared", "studio", "apartment", "house"];

const STATES = districtData.states.map((s) => s.state);

/**
 * Search used to be state + district only, and the page fired TWO competing
 * fetches on mount — one paginated, one not — so whichever resolved last won
 * and the pagination controls desynced from what was rendered.
 *
 * Now: one fetch, and filters that match what the README always promised
 * (location, price, type).
 */
export default function FindRooms() {
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Location filters are applied server-side; the rest narrow the result set
  // in the browser until the backend grows real filter support (B28).
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [type, setType] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [minBeds, setMinBeds] = useState("");

  const districts = useMemo(() => {
    if (!state) return districtData.states.flatMap((s) => s.districts);
    return districtData.states.find((s) => s.state === state)?.districts ?? [];
  }, [state]);

  const fetchRooms = useCallback(async (pageNum) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/rooms/availableRoom`, {
        params: { limit: PAGE_SIZE, offset: (pageNum - 1) * PAGE_SIZE },
        withCredentials: true,
      });
      setRooms(res.data.message ?? []);
      setTotal(res.data.totalCount ?? (res.data.message ?? []).length);
    } catch {
      setError("Couldn't load rooms. Check your connection and try again.");
      setRooms([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByLocation = useCallback(async () => {
    if (!state && !district) return fetchRooms(1);
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/search/district-state`, {
        params: { ...(district && { district }), ...(state && { state }) },
        withCredentials: true,
      });
      setRooms(res.data.rooms ?? []);
      setTotal((res.data.rooms ?? []).length);
      setPage(1);
    } catch {
      setError("Search failed. Try again in a moment.");
      setRooms([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [state, district, fetchRooms]);

  // ONE effect, one fetch.
  useEffect(() => {
    fetchRooms(page);
  }, [page, fetchRooms]);

  // Drop a district that doesn't belong to the newly-picked state.
  useEffect(() => {
    if (district && !districts.includes(district)) setDistrict("");
  }, [state, districts, district]);

  const visible = useMemo(() => {
    return rooms.filter((r) => {
      if (type && r.roomType !== type) return false;
      if (maxRent && Number(r.rentPrice) > Number(maxRent)) return false;
      if (minBeds && Number(r.numberOfRooms) < Number(minBeds)) return false;
      return true;
    });
  }, [rooms, type, maxRent, minBeds]);

  const activeFilters = [
    state && { key: "state", label: state, clear: () => setState("") },
    district && { key: "district", label: district, clear: () => setDistrict("") },
    type && { key: "type", label: type, clear: () => setType("") },
    maxRent && { key: "rent", label: `Under ${money(maxRent)}`, clear: () => setMaxRent("") },
    minBeds && { key: "beds", label: `${minBeds}+ rooms`, clear: () => setMinBeds("") },
  ].filter(Boolean);

  const clearAll = () => {
    setState("");
    setDistrict("");
    setType("");
    setMaxRent("");
    setMinBeds("");
    setPage(1);
    fetchRooms(1);
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  return (
    <Page width="wide">
      <PageHeader
        title="Find a room"
        description="Browse rooms available to rent right now."
      />

      <Card className="mb-6">
        <form
          className="p-4"
          onSubmit={(e) => {
            e.preventDefault();
            searchByLocation();
          }}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Select label="State" value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">Any state</option>
              {STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>

            <Select
              label="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            >
              <option value="">Any district</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </Select>

            <Select label="Room type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Any type</option>
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Select>

            <Input
              label="Max rent"
              type="number"
              inputMode="numeric"
              min="0"
              step="500"
              placeholder="e.g. 20000"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
            />

            <Input
              label="Min rooms"
              type="number"
              inputMode="numeric"
              min="1"
              placeholder="e.g. 2"
              value={minBeds}
              onChange={(e) => setMinBeds(e.target.value)}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Button type="submit" variant="primary">
              Search
            </Button>
            {activeFilters.length > 0 && (
              <Button type="button" variant="ghost" onClick={clearAll}>
                Clear all
              </Button>
            )}
          </div>
        </form>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
            <span className="text-label text-ink-faint">Filtering by</span>
            {activeFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={f.clear}
                className="inline-flex items-center gap-1 rounded border border-line-strong bg-surface px-2 py-0.5 text-label text-ink transition-colors hover:bg-surface-raised"
                aria-label={`Remove filter ${f.label}`}
              >
                {f.label}
                <span aria-hidden="true" className="text-ink-faint">
                  &times;
                </span>
              </button>
            ))}
          </div>
        )}
      </Card>

      {error && (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-3 flex items-baseline justify-between">
        <p className="text-label text-ink-faint">
          {loading ? (
            "Searching…"
          ) : (
            <>
              <span className="tabular text-ink">{visible.length}</span>
              {visible.length !== total && (
                <>
                  {" of "}
                  <span className="tabular">{total}</span>
                </>
              )}{" "}
              {total === 1 ? "room" : "rooms"}
            </>
          )}
        </p>
        {!user && !loading && visible.length > 0 && (
          <p className="text-label text-ink-faint">
            <Link to="/login" className="font-medium text-accent hover:text-accent-hover">
              Log in
            </Link>{" "}
            to apply
          </p>
        )}
      </div>

      {loading ? (
        <>
          <LoadingAnnounce>Searching for rooms</LoadingAnnounce>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </>
      ) : visible.length === 0 ? (
        <EmptyState
          title={activeFilters.length ? "No rooms match those filters" : "No rooms available yet"}
          description={
            activeFilters.length
              ? "Try widening your search — a higher rent limit or a different district usually helps."
              : "Nothing is listed right now. Check back shortly."
          }
          action={
            activeFilters.length ? (
              <Button variant="secondary" onClick={clearAll}>
                Clear filters
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                to={user ? `/viewRoomsDetails/${room._id}` : "/login"}
              />
            ))}
          </div>

          {totalPages > 1 && activeFilters.length === 0 && (
            <nav
              className="mt-6 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <span className="tabular px-2 text-label text-ink-faint">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </nav>
          )}
        </>
      )}
    </Page>
  );
}
