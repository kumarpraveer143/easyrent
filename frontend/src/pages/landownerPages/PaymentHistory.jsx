import React, { useEffect, useState, useCallback } from "react";
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

/**
 * This page used to render a hardcoded array — "John Doe", "Jane Smith",
 * "Robert Johnson", amounts in US dollars — with no API call at all, while
 * being linked from the landowner navigation in production.
 *
 * It now shows real money: every payment across every tenancy you own.
 */
export default function PaymentHistory() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rentersRes = await axios.get(`${API}/relationship/getRenters`, {
        withCredentials: true,
      });
      const tenancies = rentersRes.data.renters ?? [];

      // One history request per tenancy, all in flight together.
      const perTenancy = await Promise.all(
        tenancies.map(async (t) => {
          try {
            const res = await axios.get(`${API}/history/${t.relationId}`, {
              withCredentials: true,
            });
            return (res.data.history ?? []).map((h) => ({
              ...h,
              tenant: t.renterDetails?.name ?? "Unknown",
              roomNumber: t.roomDetails?.roomNumber,
              relationId: t.relationId,
            }));
          } catch {
            return [];
          }
        })
      );

      setRows(
        perTenancy
          .flat()
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    } catch {
      setError("Couldn't load payments. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const total = rows.reduce((n, r) => n + (Number(r.rentPaid) || 0), 0);

  const thisMonth = rows.filter((r) => {
    const d = new Date(r.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((n, r) => n + (Number(r.rentPaid) || 0), 0);

  return (
    <Page width="wide">
      <PageHeader
        title="Payments"
        description="Rent you've received, across every tenancy."
        actions={
          <Button variant="secondary" onClick={() => navigate("/my-renters")}>
            Tenants
          </Button>
        }
      />

      {error && (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      )}

      {!loading && !error && rows.length > 0 && (
        <StatRow className="mb-6 sm:grid-cols-3">
          <Stat
            label="Received this month"
            value={money(thisMonthTotal)}
            hint={`${thisMonth.length} payment${thisMonth.length === 1 ? "" : "s"}`}
            tone="ok"
          />
          <Stat label="Received all time" value={money(total)} />
          <Stat label="Payments recorded" value={rows.length} />
        </StatRow>
      )}

      {loading ? (
        <>
          <LoadingAnnounce>Loading payments</LoadingAnnounce>
          <div className="rounded border border-line bg-surface">
            <SkeletonRows rows={5} cols={5} />
          </div>
        </>
      ) : error ? null : rows.length === 0 ? (
        <EmptyState
          title="No payments yet"
          description="Rent you record against a tenancy — and rent tenants pay online — shows up here."
          action={
            <Button variant="primary" onClick={() => navigate("/my-renters")}>
              Go to tenants
            </Button>
          }
        />
      ) : (
        <Table caption="All rent payments received">
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Tenant</Table.HeadCell>
            <Table.HeadCell>Room</Table.HeadCell>
            <Table.HeadCell align="right">Amount</Table.HeadCell>
            <Table.HeadCell>Method</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {rows.map((r) => (
              <Table.Row
                key={r._id}
                className="cursor-pointer"
                onClick={() => navigate(`/check-history/${r.relationId}`)}
              >
                <Table.Cell numeric>{fmtDate(r.date)}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-ink">{r.tenant}</span>
                </Table.Cell>
                <Table.Cell numeric>{r.roomNumber ?? "—"}</Table.Cell>
                <Table.Cell align="right" numeric>
                  <span className="font-medium text-ink">{money(r.rentPaid)}</span>
                </Table.Cell>
                <Table.Cell>
                  <Badge tone={r.paymentMethod === "Online" ? "accent" : "neutral"}>
                    {r.paymentMethod === "Online" ? "Online" : r.paymentMethod}
                  </Badge>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Page>
  );
}
