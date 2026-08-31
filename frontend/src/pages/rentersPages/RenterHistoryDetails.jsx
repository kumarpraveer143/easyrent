import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Page,
  PageHeader,
  Button,
  Table,
  Badge,
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

export default function RenterHistoryDetails() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${API}/relationship/historyOfRenter`, {
          withCredentials: true,
        });
        if (!cancelled) setHistory(res.data.histories ?? []);
      } catch {
        if (!cancelled) setError("Couldn't load your payments. Refresh to try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = history.reduce((n, h) => n + (Number(h.rentPaid) || 0), 0);
  const last = history[0];

  return (
    <Page>
      <PageHeader
        title="Rent paid"
        description="Every payment your landlord has recorded against your tenancy."
        actions={
          <Button variant="secondary" onClick={() => navigate("/rentersMyRoom")}>
            My room
          </Button>
        }
      />

      {error && (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      )}

      {!loading && !error && history.length > 0 && (
        <StatRow className="mb-6 sm:grid-cols-3">
          <Stat label="Paid all time" value={money(total)} />
          <Stat label="Payments" value={history.length} />
          <Stat label="Last payment" value={fmtDate(last?.date)} hint={money(last?.rentPaid)} />
        </StatRow>
      )}

      {loading ? (
        <>
          <LoadingAnnounce>Loading your payments</LoadingAnnounce>
          <div className="rounded border border-line bg-surface">
            <SkeletonRows rows={4} cols={4} />
          </div>
        </>
      ) : error ? null : history.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="Once your landlord records rent — or you pay online — it appears here as your record."
          action={
            <Button variant="secondary" onClick={() => navigate("/rentersMyRoom")}>
              Go to my room
            </Button>
          }
        />
      ) : (
        <Table caption="Your rent payments">
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell align="right">Amount</Table.HeadCell>
            <Table.HeadCell>Method</Table.HeadCell>
            <Table.HeadCell>Note</Table.HeadCell>
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
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Page>
  );
}
