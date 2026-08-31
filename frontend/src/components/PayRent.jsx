import React, { useState } from "react";
import axios from "axios";
import { Card, CardBody, Button, Alert, money } from "./UI";
import { useStripe } from "../contexts/StripeContext";

/**
 * The request now carries ONLY `relationId`.
 *
 * It used to post `amount`, `renterId`, `ownerId` and `roomId` from the
 * browser, and the server took the amount at face value — so a tenant could
 * pay ₹1 against a ₹15,000 room (SEC-04). The amount is now looked up
 * server-side from the unit's rent; `rentAmount` here is display only.
 */
export default function PayRent({ relationId, rentAmount }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { stripeEnabled } = useStripe();

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/create-checkout-session`,
        { relationId },
        { withCredentials: true }
      );
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError("We couldn't start the payment. Try again in a moment.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ??
          "We couldn't start the payment. Try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-body font-semibold text-ink">Pay rent</h2>
            <p className="mt-0.5 text-label text-ink-faint">
              {stripeEnabled
                ? "Card payment, handled by Stripe."
                : "Online payment isn't switched on yet."}
            </p>
          </div>
          <p className="tabular text-display leading-none text-ink">{money(rentAmount)}</p>
        </div>

        {error && (
          <Alert tone="danger" className="mt-4">
            {error}
          </Alert>
        )}

        {stripeEnabled ? (
          <Button
            variant="primary"
            className="mt-4 w-full"
            loading={loading}
            onClick={handlePayment}
          >
            {loading ? "Opening payment…" : `Pay ${money(rentAmount)}`}
          </Button>
        ) : (
          <Alert tone="info" className="mt-4">
            Pay your landlord directly for now — they&rsquo;ll record it against your
            tenancy and it will appear in your payment history.
          </Alert>
        )}
      </CardBody>
    </Card>
  );
}
