import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Page,
  PageHeader,
  Button,
  Table,
  Modal,
  Alert,
  EmptyState,
  SkeletonRows,
  LoadingAnnounce,
  money,
} from "../../components/UI";

const API = import.meta.env.VITE_API_URL;

export default function ArchievedRenters() {
  const [renters, setRenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/relationship/getRenters`, {
        withCredentials: true,
      });
      setRenters((res.data.renters ?? []).filter((r) => r.renterStatus === "archive"));
    } catch {
      setError("Couldn't load past tenants. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/relationship/deleteRenter/${confirmDelete.relationId}`, {
        withCredentials: true,
      });
      toast.success("Record deleted permanently.");
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Couldn't delete that record.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Page>
      <PageHeader
        title="Past tenants"
        description="Tenancies that have ended. Their payment history is kept."
        actions={
          <Button variant="secondary" onClick={() => navigate("/my-renters")}>
            Current tenants
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
          <LoadingAnnounce>Loading past tenants</LoadingAnnounce>
          <div className="rounded border border-line bg-surface">
            <SkeletonRows rows={3} cols={4} />
          </div>
        </>
      ) : renters.length === 0 ? (
        <EmptyState
          title="No past tenants"
          description="When you end a tenancy, it moves here so you keep the record."
        />
      ) : (
        <Table caption="Tenancies that have ended">
          <Table.Head>
            <Table.HeadCell>Tenant</Table.HeadCell>
            <Table.HeadCell>Room</Table.HeadCell>
            <Table.HeadCell align="right">Rent was</Table.HeadCell>
            <Table.HeadCell align="right">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {renters.map((r) => (
              <Table.Row key={r.relationId}>
                <Table.Cell>
                  <span className="font-medium text-ink">
                    {r.renterDetails?.name ?? "Unknown"}
                  </span>
                  <span className="block text-label text-ink-faint">
                    {r.renterDetails?.phoneNumber}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="tabular">{r.roomDetails?.roomNumber ?? "—"}</span>
                  <span className="ml-2 text-ink-faint">{r.roomDetails?.roomType}</span>
                </Table.Cell>
                <Table.Cell align="right" numeric>
                  {money(r.roomDetails?.rentPrice)}
                </Table.Cell>
                <Table.Cell align="right">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/check-history/${r.relationId}`)}
                    >
                      Payments
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setConfirmDelete(r)}>
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete this record permanently?"
        description={confirmDelete?.renterDetails?.name}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={remove}>
              Delete permanently
            </Button>
          </>
        }
      >
        {/* Say exactly what is lost. This endpoint runs deleteMany on the
            payment history, which the old confirmation never mentioned. */}
        <p className="text-ink-muted">
          This deletes the tenancy <strong className="text-ink">and every rent payment
          recorded against it</strong>. You may need those records for tax. This
          can&rsquo;t be undone.
        </p>
      </Modal>
    </Page>
  );
}
