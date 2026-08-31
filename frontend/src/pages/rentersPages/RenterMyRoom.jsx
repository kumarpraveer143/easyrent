import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Chat from "../../components/Chat";
import PayRent from "../../components/PayRent";
import {
  Page,
  PageHeader,
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Alert,
  EmptyState,
  Skeleton,
  LoadingAnnounce,
  Table,
  money,
  date as fmtDate,
  titleCase,
  address as fmtAddress,
} from "../../components/UI";

const API = import.meta.env.VITE_API_URL;

export default function RenterMyRoom() {
  const [room, setRoom] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();

  let me = null;
  try {
    me = JSON.parse(localStorage.getItem("user"));
  } catch {
    me = null;
  }

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/relationship/getRoomDetails`, {
        withCredentials: true,
      });
      // The API now returns null rather than 500ing when you have no tenancy —
      // which is the state every renter starts in.
      const data = res.data.room ?? null;
      setRoom(data);

      if (data?.relationId) {
        const h = await axios.get(`${API}/relationship/historyOfRenter`, {
          withCredentials: true,
        });
        setHistory(h.data.histories ?? []);
      }
    } catch {
      setError("Couldn't load your room. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Page>
        <LoadingAnnounce>Loading your room</LoadingAnnounce>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-3 h-4 w-72" />
        <Skeleton className="mt-6 h-48 w-full" />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <Alert tone="danger">{error}</Alert>
      </Page>
    );
  }

  if (!room) {
    return (
      <Page>
        <PageHeader title="My room" />
        <EmptyState
          title="You're not renting a room yet"
          description="Once a landlord accepts your application, your room, your rent and your landlord's contact details all appear here."
          action={
            <Button variant="primary" onClick={() => navigate("/findrooms")}>
              Find a room
            </Button>
          }
        />
      </Page>
    );
  }

  const details = room.roomDetails ?? {};
  const totalPaid = history.reduce((n, h) => n + (Number(h.rentPaid) || 0), 0);

  return (
    <Page>
      <PageHeader
        title="My room"
        description={room.houseName || "Your current tenancy."}
        actions={<Badge tone="ok">Active tenancy</Badge>}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <Card>
            <CardHeader
              title={`${titleCase(details.roomType)} · No. ${details.roomNumber ?? "—"}`}
              description={fmtAddress(details.address)}
            />
            <CardBody>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <dt className="text-label text-ink-faint">Rent</dt>
                  <dd className="tabular mt-0.5 text-lead font-semibold text-ink">
                    {money(details.rentPrice)}
                  </dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Rooms</dt>
                  <dd className="tabular mt-0.5 text-lead text-ink">{details.numberOfRooms}</dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Bathrooms</dt>
                  <dd className="tabular mt-0.5 text-lead text-ink">
                    {details.numberOfBathrooms}
                  </dd>
                </div>
                <div>
                  <dt className="text-label text-ink-faint">Paid so far</dt>
                  <dd className="tabular mt-0.5 text-lead text-ink">{money(totalPaid)}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Your rent payments"
              description="Everything your landlord has recorded, plus anything you paid online."
              action={
                history.length > 0 && (
                  <Link
                    to="/renter-history"
                    className="rounded text-label font-medium text-accent hover:text-accent-hover"
                  >
                    View all
                  </Link>
                )
              }
            />
            {history.length === 0 ? (
              <p className="px-4 py-8 text-center text-body text-ink-faint">
                No payments recorded yet.
              </p>
            ) : (
              <Table caption="Recent rent payments">
                <Table.Head>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell align="right">Amount</Table.HeadCell>
                  <Table.HeadCell>Method</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {history.slice(0, 5).map((h) => (
                    <Table.Row key={h._id}>
                      <Table.Cell numeric>{fmtDate(h.date)}</Table.Cell>
                      <Table.Cell align="right" numeric>
                        <span className="font-medium text-ink">{money(h.rentPaid)}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <Badge tone={h.paymentMethod === "Online" ? "accent" : "neutral"}>
                          {h.paymentMethod === "Online" ? "Online" : h.paymentMethod}
                        </Badge>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <PayRent relationId={room.relationId} rentAmount={details.rentPrice} />

          <Card>
            <CardHeader title="Your landlord" />
            <CardBody>
              <p className="text-body font-medium text-ink">{room.ownerName}</p>
              <dl className="mt-3 flex flex-col gap-2 text-body">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-faint">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${room.ownerNumber}`}
                      className="rounded text-accent hover:text-accent-hover"
                    >
                      {room.ownerNumber}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink-faint">Email</dt>
                  <dd className="min-w-0">
                    <a
                      href={`mailto:${room.ownerEmail}`}
                      className="block truncate rounded text-accent hover:text-accent-hover"
                    >
                      {room.ownerEmail}
                    </a>
                  </dd>
                </div>
              </dl>
              <Button
                variant="secondary"
                className="mt-4 w-full"
                onClick={() => setChatOpen(true)}
              >
                Message your landlord
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {chatOpen && (
        <Chat
          relationId={room.relationId}
          currentUserId={me?._id}
          recipientName={room.ownerName}
          onClose={() => setChatOpen(false)}
        />
      )}
    </Page>
  );
}
