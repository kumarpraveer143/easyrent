import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Page,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Alert,
  Modal,
  Skeleton,
  LoadingAnnounce,
  money,
  titleCase,
  address as fmtAddress,
} from "../components/UI";

const API = import.meta.env.VITE_API_URL;

export default function ViewRoomDetails() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  const [confirmApply, setConfirmApply] = useState(false);

  /**
   * This page used to fire four requests from three sequential effects — a
   * waterfall where each waited on the last. They now go out together.
   */
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [roomRes, appliedRes, engagedRes, favRes] = await Promise.all([
        axios.get(`${API}/rooms/roomDetails/${roomId}`, { withCredentials: true }),
        axios.get(`${API}/request/${roomId}`, { withCredentials: true }).catch(() => null),
        axios.get(`${API}/relationship/engaged`, { withCredentials: true }).catch(() => null),
        axios.get(`${API}/favourite/isFabRoom/${roomId}`, { withCredentials: true }).catch(() => null),
      ]);

      setRoom(roomRes.data.room ?? null);
      setHasApplied(appliedRes?.data?.message === true);
      setEngaged(engagedRes?.data?.message === true);
      setIsFavourite(Boolean(favRes?.data));
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "That room doesn't exist any more."
          : "Couldn't load this room. Refresh to try again."
      );
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleFavourite = async () => {
    // Optimistic — a saved room should fill instantly.
    const next = !isFavourite;
    setIsFavourite(next);
    try {
      await axios.post(`${API}/favourite/toggle/${roomId}`, {}, { withCredentials: true });
    } catch {
      setIsFavourite(!next);
      toast.error("Couldn't update your saved rooms.");
    }
  };

  const apply = async () => {
    setWorking(true);
    try {
      await axios.post(`${API}/request/${roomId}`, {}, { withCredentials: true });
      setHasApplied((v) => !v);
      setConfirmApply(false);
      toast.success(
        hasApplied ? "Application withdrawn." : "Applied. The landlord has been notified."
      );
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Couldn't send that application.");
    } finally {
      setWorking(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <LoadingAnnounce>Loading this room</LoadingAnnounce>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-3 h-4 w-72" />
        <Skeleton className="mt-6 h-64 w-full" />
      </Page>
    );
  }

  if (error || !room) {
    return (
      <Page>
        <Alert tone="danger" className="mb-4">
          {error || "Room not found."}
        </Alert>
        <Button variant="secondary" onClick={() => navigate("/findrooms")}>
          Back to search
        </Button>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title={`${titleCase(room.roomType)} · No. ${room.roomNumber ?? "—"}`}
        description={fmtAddress(room.address)}
        actions={
          <>
            <Button variant="secondary" onClick={toggleFavourite}>
              {isFavourite ? "Saved" : "Save"}
            </Button>
            <Button variant="ghost" onClick={() => navigate("/findrooms")}>
              Back to search
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          {/* Photos don't exist yet (B19/B20). A stock image of a different
              room would be worse than an honest placeholder. */}
          <div className="flex h-56 items-center justify-center rounded border border-line bg-surface-raised">
            <p className="text-label uppercase tracking-wider text-ink-faint">
              No photos yet
            </p>
          </div>

          <Card>
            <CardHeader title="About this room" />
            <CardBody>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <dt className="text-label text-ink-faint">Type</dt>
                  <dd className="mt-0.5 text-lead text-ink">{titleCase(room.roomType)}</dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Rooms</dt>
                  <dd className="tabular mt-0.5 text-lead text-ink">{room.numberOfRooms}</dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Bathrooms</dt>
                  <dd className="tabular mt-0.5 text-lead text-ink">
                    {room.numberOfBathrooms}
                  </dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Availability</dt>
                  <dd className="mt-0.5">
                    <Badge tone={room.isAvailable ? "ok" : "neutral"}>
                      {room.isAvailable ? "Available" : "Already let"}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          {room.owner && (
            <Card>
              <CardHeader title="Listed by" />
              <CardBody>
                <p className="text-body font-medium text-ink">{room.owner.name}</p>
                {room.owner.houseName && (
                  <p className="text-label text-ink-faint">{room.owner.houseName}</p>
                )}
                <p className="mt-2 text-label text-ink-faint">
                  You&rsquo;ll get their phone number and email once they accept your
                  application.
                </p>
              </CardBody>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Card>
            <CardBody>
              <p className="tabular text-display leading-none text-ink">
                {money(room.rentPrice)}
              </p>
              <p className="mt-1 text-label text-ink-faint">per month</p>

              {engaged && !hasApplied ? (
                <Alert tone="info" className="mt-4">
                  You&rsquo;re already renting a room. End that tenancy before applying
                  for another.{" "}
                  <Link
                    to="/rentersMyRoom"
                    className="font-medium text-accent underline underline-offset-2"
                  >
                    My room
                  </Link>
                </Alert>
              ) : !room.isAvailable && !hasApplied ? (
                <Alert tone="info" className="mt-4">
                  This room has already been let.
                </Alert>
              ) : (
                <>
                  {hasApplied && (
                    <Alert tone="ok" className="mt-4">
                      You&rsquo;ve applied. The landlord will accept or decline.
                    </Alert>
                  )}
                  <Button
                    variant={hasApplied ? "secondary" : "primary"}
                    className="mt-4 w-full"
                    loading={working}
                    onClick={() => (hasApplied ? apply() : setConfirmApply(true))}
                  >
                    {hasApplied ? "Withdraw application" : "Apply for this room"}
                  </Button>
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={confirmApply}
        onClose={() => setConfirmApply(false)}
        title="Apply for this room?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmApply(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={working} onClick={apply}>
              Apply
            </Button>
          </>
        }
      >
        <p className="text-ink-muted">
          The landlord will see your name, phone number and email so they can get in
          touch. You can withdraw at any time before they decide.
        </p>
      </Modal>
    </Page>
  );
}
