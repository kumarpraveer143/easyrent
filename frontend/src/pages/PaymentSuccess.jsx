import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Page, Card, CardBody, Button, Alert, Skeleton, money, date as fmtDate } from "../components/UI";

const API = import.meta.env.VITE_API_URL;

/**
 * The webhook is the single writer of payment history (SEC-05), so there is a
 * short window after the redirect where the payment is confirmed by Stripe but
 * not yet in our ledger. That is a normal state, not an error — say so rather
 * than showing a failure.
 */
export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: "checking" });

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setState({ status: "missing" });
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const check = async () => {
      attempts += 1;
      try {
        const res = await axios.get(`${API}/payment/verify/${sessionId}`, {
          withCredentials: true,
        });
        if (cancelled) return;

        if (res.data.paid && res.data.recorded) {
          setState({ status: "recorded", payment: res.data.recorded });
        } else if (res.data.paid) {
          // Paid, but the webhook hasn't landed yet. Give it a few seconds.
          if (attempts < 5) setTimeout(check, 2000);
          else setState({ status: "paid-pending" });
        } else {
          setState({ status: "unpaid", detail: res.data.status });
        }
      } catch {
        if (!cancelled) setState({ status: "error" });
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [params]);

  return (
    <Page width="narrow">
      <div className="py-12">
        {state.status === "checking" && (
          <>
            <h1 className="text-display text-ink">Confirming your payment…</h1>
            <Skeleton className="mt-6 h-24 w-full" />
          </>
        )}

        {state.status === "recorded" && (
          <>
            <h1 className="text-display text-ink">Rent paid</h1>
            <p className="mt-2 text-body text-ink-muted">
              Your landlord has been notified, and this is now in your payment history.
            </p>
            <Card className="mt-6">
              <CardBody>
                <dl className="flex flex-col gap-3">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-faint">Amount</dt>
                    <dd className="tabular font-semibold text-ink">
                      {money(state.payment.rentPaid)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-faint">Date</dt>
                    <dd className="tabular text-ink">{fmtDate(state.payment.date)}</dd>
                  </div>
                </dl>
              </CardBody>
            </Card>
          </>
        )}

        {state.status === "paid-pending" && (
          <>
            <h1 className="text-display text-ink">Payment received</h1>
            <Alert tone="ok" className="mt-4">
              Stripe has confirmed your payment. It takes a moment to appear in your
              history — refresh that page shortly and it will be there.
            </Alert>
          </>
        )}

        {state.status === "unpaid" && (
          <>
            <h1 className="text-display text-ink">Payment not completed</h1>
            <Alert tone="warn" className="mt-4">
              Stripe reports this payment as &ldquo;{state.detail}&rdquo;. Nothing has been
              charged. You can try again from your room.
            </Alert>
          </>
        )}

        {(state.status === "error" || state.status === "missing") && (
          <>
            <h1 className="text-display text-ink">We couldn&rsquo;t confirm that payment</h1>
            <Alert tone="danger" className="mt-4">
              If money left your account, don&rsquo;t pay again — check your payment
              history first, and contact your landlord if it isn&rsquo;t there.
            </Alert>
          </>
        )}

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => navigate("/rentersMyRoom")}>
            Back to my room
          </Button>
          <Button variant="secondary" onClick={() => navigate("/renter-history")}>
            View payment history
          </Button>
        </div>
      </div>
    </Page>
  );
}
