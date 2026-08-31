import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import {
  Page,
  PageHeader,
  Button,
  Alert,
  EmptyState,
  SkeletonCard,
  LoadingAnnounce,
} from "../components/UI";

const API = import.meta.env.VITE_API_URL;

export default function FavouriteRoom() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API}/favourite/myfavourite`, {
          withCredentials: true,
        });
        // A saved room whose listing was deleted comes back as null from the
        // populate — drop those rather than rendering an empty card.
        if (!cancelled) setRooms((res.data.rooms ?? []).filter(Boolean));
      } catch {
        if (!cancelled) setError("Couldn't load your saved rooms. Refresh to try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Page width="wide">
      <PageHeader
        title="Saved rooms"
        description="Rooms you've shortlisted."
        actions={
          <Button variant="secondary" onClick={() => navigate("/findrooms")}>
            Find more
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
          <LoadingAnnounce>Loading saved rooms</LoadingAnnounce>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </>
      ) : rooms.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Save a room while you're browsing and it'll be here when you come back to compare."
          action={
            <Button variant="primary" onClick={() => navigate("/findrooms")}>
              Browse rooms
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {rooms.map((room) => (
            <RoomCard key={room._id} room={room} to={`/viewRoomsDetails/${room._id}`} />
          ))}
        </div>
      )}
    </Page>
  );
}
