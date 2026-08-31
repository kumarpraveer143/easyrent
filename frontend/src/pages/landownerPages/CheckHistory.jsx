import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
  StatRow,
  Stat,
  money,
  date as fmtDate,
} from "../../components/UI";

const API = import.meta.env.VITE_API_URL;

export default function CheckHistory() {
  const { relationId } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [archived, setArchived] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Both go out together rather than in a waterfall.
      const [histRes, archRes] = await Promise.all([
        axios.get(`${API}/history/${relationId}`, { withCredentials: true }),
        axios.post(`${API}/relationship/isArchieve`, { relationId }, { withCredentials: true }),
      ]);
      setHistory(histRes.data.history ?? []);
      setArchived(archRes.data.message === true);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "That tenancy doesn't exist, or isn't yours."
          : "Couldn't load payment history. Refresh to try again."
      );
    } finally {
      setLoading(false);
    }
  }, [relationId]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/history/${confirmDelete._id}`, { withCredentials: true });
      toast.success("Payment record deleted.");
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Couldn't delete that record.");
    } finally {
      setDeleting(false);
    }
  };

  const total = history.reduce((n, h) => n + (Number(h.rentPaid) || 0), 0);
  const online = history.filter((h) => h.paymentMethod === "Online").length;

  return (
    <Page>
      <PageHeader
        title="Payment history"
        description="Every rent payment recorded against this tenancy."
        actions={
          !archived && (
            <Button variant="primary" onClick={() => navigate(`/add-rent/${relationId}`)}>
              Record a payment
            </Button>
          )
        }
      />

      {error && (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      )}

      {archived && !error && (
        <Alert tone="info" className="mb-6">
          This tenancy has ended. The record is kept, but no new payments can be added.
        </Alert>
      )}

      {!loading && !error && history.length > 0 && (
        <StatRow className="mb-6 sm:grid-cols-3">
          <Stat label="Payments recorded" value={history.length} />
          <Stat label="Total received" value={money(total)} tone="ok" />
          <Stat label="Paid online" value={`${online} of ${history.length}`} />
        </StatRow>
      )}

      {loading ? (
        <>
          <LoadingAnnounce>Loading payment history</LoadingAnnounce>
          <div className="rounded border border-line bg-surface">
            <SkeletonRows rows={4} cols={4} />
          </div>
        </>
      ) : error ? null : history.length === 0 ? (
        <EmptyState
          title="No payments recorded yet"
          description="When you record rent from this tenant, it appears here — and they see it too."
          action={
            !archived && (
              <Button variant="primary" onClick={() => navigate(`/add-rent/${relationId}`)}>
                Record the first payment
              </Button>
            )
          }
        />
      ) : (
        <Table caption="Payment history for this tenancy">
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell align="right">Amount</Table.HeadCell>
            <Table.HeadCell>Method</Table.HeadCell>
            <Table.HeadCell>Note</Table.HeadCell>
            <Table.HeadCell align="right">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {history.map((h) => (
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
                <Table.Cell>
                  <span className="text-ink-faint">{h.remarks || "—"}</span>
                </Table.Cell>
                <Table.Cell align="right">
                  {/* Online payments come from Stripe and reconcile against it,
                      so they are not hand-editable. */}
                  {h.paymentMethod === "Online" ? (
                    <span className="text-label text-ink-faint">Recorded automatically</span>
                  ) : (
                    <Button size="sm" variant="danger" onClick={() => setConfirmDelete(h)}>
                      Delete
                    </Button>
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Modal
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        title="Delete this payment record?"
        description={
          confirmDelete
            ? `${money(confirmDelete.rentPaid)} on ${fmtDate(confirmDelete.date)}`
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={remove}>
              Delete record
            </Button>
          </>
        }
      >
        <p className="text-ink-muted">
          Your tenant will no longer see this payment in their history. This can&rsquo;t be
          undone.
        </p>
      </Modal>
    </Page>
  );
}
