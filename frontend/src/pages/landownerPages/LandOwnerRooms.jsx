import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Page,
  PageHeader,
  Card,
  CardBody,
  Button,
  Badge,
  Modal,
  Alert,
  EmptyState,
  SkeletonCard,
  LoadingAnnounce,
  money,
  titleCase,
  address as fmtAddress,
} from "../../components/UI";

const API = import.meta.env.VITE_API_URL;

export default function LandOwnerRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/rooms/myRoom`, { withCredentials: true });
      setRooms(res.data.message ?? []);
    } catch {
      setError("Couldn't load your rooms. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleAvailability = async (room) => {
    setBusyId(room._id);
    try {
      // A room with an active tenant must not be re-listed underneath them.
      if (!room.isAvailable) {
        const rel = await axios.post(
          `${API}/relationship/isRelationship`,
          { roomId: room._id },
          { withCredentials: true }
        );
        if (rel.data.renters) {
          toast.error("Someone is renting this room. End the tenancy first.");
          return;
        }
      }
      await axios.post(`${API}/rooms/toggle-room/${room._id}`, {}, { withCredentials: true });
      setRooms((prev) =>
        prev.map((r) => (r._id === room._id ? { ...r, isAvailable: !r.isAvailable } : r))
      );
      toast.success(room.isAvailable ? "Room hidden from search." : "Room is live again.");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Couldn't update that room.");
    } finally {
      setBusyId(null);
    }
  };

  const askDelete = async (room) => {
    try {
      const rel = await axios.post(
        `${API}/relationship/relationByRoomId`,
        { roomId: room._id },
        { withCredentials: true }
      );
      if (rel.data.message) {
        toast.error("This room has a tenancy attached, so it can't be deleted.");
        return;
      }
      setConfirmDelete(room);
    } catch {
      toast.error("Couldn't check that room. Try again.");
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete._id);
    try {
      await axios.delete(`${API}/rooms/${confirmDelete._id}`, { withCredentials: true });
      setRooms((prev) => prev.filter((r) => r._id !== confirmDelete._id));
      toast.success("Room deleted.");
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Couldn't delete that room.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Page width="wide">
      <PageHeader
        title="My rooms"
        description="Everything you've listed, and whether it's available."
        actions={
          <Button variant="primary" onClick={() => navigate("/uploadrooms")}>
            List a room
          </Button>
        }
      />

      {error && (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      )}

      {loading ? (
        <>
          <LoadingAnnounce>Loading your rooms</LoadingAnnounce>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </>
      ) : rooms.length === 0 ? (
        <EmptyState
          title="You haven't listed a room yet"
          description="Add your first room so renters can find it and apply."
          action={
            <Button variant="primary" onClick={() => navigate("/uploadrooms")}>
              List a room
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room._id} className="flex flex-col">
              <CardBody className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-body font-semibold text-ink">
                      {titleCase(room.roomType)} · No. {room.roomNumber ?? "—"}
                    </h2>
                    <p className="mt-0.5 truncate text-label text-ink-faint">
                      {fmtAddress(room.address)}
                    </p>
                  </div>
                  <Badge tone={room.isAvailable ? "ok" : "neutral"}>
                    {room.isAvailable ? "Available" : "Let"}
                  </Badge>
                </div>

                <dl className="mt-3 flex gap-4 text-label text-ink-faint">
                  <div>
                    <dt className="sr-only">Rooms</dt>
                    <dd>
                      <span className="tabular text-ink">{room.numberOfRooms}</span> rooms
                    </dd>
                  </div>
                  <div>
                    <dt className="sr-only">Bathrooms</dt>
                    <dd>
                      <span className="tabular text-ink">{room.numberOfBathrooms}</span> bath
                    </dd>
                  </div>
                </dl>

                {room.requestCount > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/incoming-request", { state: { roomId: room._id } })
                    }
                    className="mt-3 rounded border border-warn/25 bg-warn-soft px-2.5 py-1.5 text-left text-label text-warn transition-colors hover:bg-warn-soft/70"
                  >
                    <span className="tabular font-semibold">{room.requestCount}</span>{" "}
                    {room.requestCount === 1 ? "person has" : "people have"} applied — review
                  </button>
                )}

                <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3">
                  <div>
                    <span className="tabular text-lead font-semibold text-ink">
                      {money(room.rentPrice)}
                    </span>
                    <span className="text-label text-ink-faint"> / month</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busyId === room._id}
                    onClick={() => toggleAvailability(room)}
                  >
                    {room.isAvailable ? "Hide from search" : "List again"}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busyId === room._id}
                    onClick={() => askDelete(room)}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete this room?"
        description={
          confirmDelete
            ? `${titleCase(confirmDelete.roomType)} · No. ${confirmDelete.roomNumber}`
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={busyId === confirmDelete?._id}
              onClick={doDelete}
            >
              Delete room
            </Button>
          </>
        }
      >
        <p className="text-ink-muted">
          The listing is removed and anyone who applied to it is dropped. This can&rsquo;t
          be undone. To take it off the market temporarily, use{" "}
          <strong className="text-ink">Hide from search</strong> instead.
        </p>
      </Modal>
    </Page>
  );
}
