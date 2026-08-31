import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Page,
  PageHeader,
  Card,
  CardHeader,
  Button,
  Badge,
  Modal,
  Alert,
  EmptyState,
  SkeletonRows,
  LoadingAnnounce,
  money,
  titleCase,
} from "../../components/UI";

const API = import.meta.env.VITE_API_URL;

/**
 * This page used to read `roomId` from `location.state` only — so arriving from
 * the dashboard's "Applications" link (which passes no state) rendered an empty
 * page with no explanation.
 *
 * It now defaults to EVERY room you own and narrows to one when you arrive from
 * a specific room. That is also the more useful default: a landlord wants to
 * see who is waiting, not to pick a room first.
 */
export default function IncommingRequest() {
  const location = useLocation();
  const navigate = useNavigate();
  const focusedRoomId = location.state?.roomId ?? null;

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(null); // { action, roomId, renter, room }
  const [working, setWorking] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const roomsRes = await axios.get(`${API}/rooms/myRoom`, { withCredentials: true });
      const rooms = (roomsRes.data.message ?? []).filter(
        (r) => !focusedRoomId || r._id === focusedRoomId
      );

      // One request per room, all in flight together rather than in sequence.
      const settled = await Promise.all(
        rooms.map(async (room) => {
          try {
            const res = await axios.get(`${API}/request/users/${room._id}`, {
              withCredentials: true,
            });
            return { room, applicants: res.data.users ?? [] };
          } catch {
            return { room, applicants: [], failed: true };
          }
        })
      );

      setGroups(settled.filter((g) => g.applicants.length > 0 || focusedRoomId));
    } catch {
      setError("Couldn't load applications. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, [focusedRoomId]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async () => {
    if (!confirm) return;
    setWorking(true);
    const { action, roomId, renter } = confirm;
    try {
      await axios.post(
        `${API}/relationship/${action}`,
        { roomId, renterId: renter._id },
        { withCredentials: true }
      );
      toast.success(
        action === "accept"
          ? `${renter.name} is now your tenant. Everyone else who applied has been told.`
          : `${renter.name}'s application was declined.`
      );
      setConfirm(null);
      if (action === "accept") navigate("/my-renters");
      else load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "That didn't work. Try again.");
    } finally {
      setWorking(false);
    }
  };

  const total = groups.reduce((n, g) => n + g.applicants.length, 0);

  return (
    <Page>
      <PageHeader
        title="Applications"
        description={
          focusedRoomId
            ? "People who applied to this room."
            : "People waiting on a decision, across all your rooms."
        }
        actions={
          focusedRoomId && (
            <Button variant="secondary" onClick={() => navigate("/incoming-request", { state: {} })}>
              Show all rooms
            </Button>
          )
        }
      />

      {error && (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      )}

      {loading ? (
        <>
          <LoadingAnnounce>Loading applications</LoadingAnnounce>
          <div className="rounded border border-line bg-surface">
            <SkeletonRows rows={3} cols={3} />
          </div>
        </>
      ) : total === 0 ? (
        <EmptyState
          title="Nobody is waiting"
          description="When someone applies to one of your rooms, they'll show up here for you to accept or decline."
          action={
            <Button variant="secondary" onClick={() => navigate("/landowner-rooms")}>
              View my rooms
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map(({ room, applicants }) => (
            <Card key={room._id}>
              <CardHeader
                title={`${titleCase(room.roomType)} · No. ${room.roomNumber ?? "—"}`}
                description={`${room.address?.city ?? ""} · ${money(room.rentPrice)} per month`}
                action={
                  <Badge tone={applicants.length ? "warn" : "neutral"}>
                    {applicants.length} waiting
                  </Badge>
                }
              />

              {applicants.length === 0 ? (
                <p className="px-4 py-6 text-center text-body text-ink-faint">
                  No applications for this room yet.
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {applicants.map((a) => (
                    <li
                      key={a._id}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-body font-medium text-ink">{a.name}</p>
                        <p className="truncate text-label text-ink-faint">
                          <a href={`tel:${a.phoneNumber}`} className="hover:text-ink">
                            {a.phoneNumber}
                          </a>
                          {a.email && <span> · {a.email}</span>}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            setConfirm({ action: "reject", roomId: room._id, renter: a, room })
                          }
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            setConfirm({ action: "accept", roomId: room._id, renter: a, room })
                          }
                        >
                          Accept
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        title={
          confirm?.action === "accept"
            ? `Accept ${confirm?.renter?.name}?`
            : `Decline ${confirm?.renter?.name}?`
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant={confirm?.action === "accept" ? "primary" : "danger"}
              loading={working}
              onClick={act}
            >
              {confirm?.action === "accept" ? "Accept" : "Decline"}
            </Button>
          </>
        }
      >
        {confirm?.action === "accept" ? (
          <p className="text-ink-muted">
            Room {confirm?.room?.roomNumber} will be marked as let, and{" "}
            <strong className="text-ink">everyone else who applied to it will be
            declined automatically</strong> and told why.
          </p>
        ) : (
          <p className="text-ink-muted">
            They&rsquo;ll be told their application wasn&rsquo;t successful. The room stays
            available to other applicants.
          </p>
        )}
      </Modal>
    </Page>
  );
}
