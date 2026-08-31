import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Chat from "../../components/Chat";
import {
  Page,
  PageHeader,
  Button,
  Table,
  Badge,
  Modal,
  Alert,
  EmptyState,
  SkeletonRows,
  LoadingAnnounce,
  money,
} from "../../components/UI";

const API = import.meta.env.VITE_API_URL;

export default function MyRenters() {
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatWith, setChatWith] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
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
      const res = await axios.get(`${API}/relationship/getRenters`, {
        withCredentials: true,
      });
      setRenters((res.data.renters ?? []).filter((r) => r.renterStatus === "active"));
    } catch {
      setError("Couldn't load your tenants. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /**
   * Archiving used to sit behind a SweetAlert2 popup that styled itself. It is
   * a destructive-ish action on a real person's tenancy, so it keeps a
   * confirmation — but one that says exactly what will happen.
   */
  const removeRenter = async () => {
    if (!confirmRemove) return;
    setRemoving(true);
    try {
      await axios.post(
        `${API}/relationship/removeRenter`,
        { relationId: confirmRemove.relationId },
        { withCredentials: true }
      );
      toast.success("Tenancy archived. The room is available again.");
      setConfirmRemove(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Couldn't archive that tenancy.");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Page width="wide">
      <PageHeader
        title="Tenants"
        description="Everyone currently renting one of your rooms."
        actions={
          <Button variant="secondary" onClick={() => navigate("/archieved-renters")}>
            Past tenants
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
          <LoadingAnnounce>Loading tenants</LoadingAnnounce>
          <div className="rounded border border-line bg-surface">
            <SkeletonRows rows={4} cols={5} />
          </div>
        </>
      ) : renters.length === 0 ? (
        <EmptyState
          title="No tenants yet"
          description="When you accept someone's application, they'll appear here with their room and rent."
          action={
            <Button variant="primary" onClick={() => navigate("/incoming-request")}>
              Review applications
            </Button>
          }
        />
      ) : (
        <Table caption="Your current tenants">
          <Table.Head>
            <Table.HeadCell>Tenant</Table.HeadCell>
            <Table.HeadCell>Room</Table.HeadCell>
            <Table.HeadCell align="right">Rent</Table.HeadCell>
            <Table.HeadCell>Contact</Table.HeadCell>
            <Table.HeadCell align="right">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {renters.map((r) => (
              <Table.Row key={r.relationId}>
                <Table.Cell>
                  <span className="font-medium text-ink">
                    {r.renterDetails?.name ?? "Unknown"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="tabular">{r.roomDetails?.roomNumber ?? "—"}</span>
                  <span className="ml-2 text-ink-faint">{r.roomDetails?.roomType}</span>
                </Table.Cell>
                <Table.Cell align="right" numeric>
                  {money(r.roomDetails?.rentPrice)}
                </Table.Cell>
                <Table.Cell>
                  <a
                    href={`tel:${r.renterDetails?.phoneNumber}`}
                    className="rounded text-accent hover:text-accent-hover"
                  >
                    {r.renterDetails?.phoneNumber ?? "—"}
                  </a>
                </Table.Cell>
                <Table.Cell align="right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setChatWith(r)}
                    >
                      Message
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/check-history/${r.relationId}`)}
                    >
                      Payments
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        navigate(`/add-rent/${r.relationId}`, {
                          state: { rentPrice: r.roomDetails?.rentPrice },
                        })
                      }
                    >
                      Record rent
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setConfirmRemove(r)}>
                      End tenancy
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal
        open={Boolean(confirmRemove)}
        onClose={() => setConfirmRemove(null)}
        title="End this tenancy?"
        description={
          confirmRemove
            ? `${confirmRemove.renterDetails?.name} will be moved to past tenants.`
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmRemove(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={removing} onClick={removeRenter}>
              End tenancy
            </Button>
          </>
        }
      >
        <p className="text-ink-muted">
          Room {confirmRemove?.roomDetails?.roomNumber} becomes available to rent again,
          and their payment history is kept.
        </p>
      </Modal>

      {chatWith && (
        <Chat
          relationId={chatWith.relationId}
          currentUserId={me?._id}
          recipientName={chatWith.renterDetails?.name}
          onClose={() => setChatWith(null)}
        />
      )}
    </Page>
  );
}
