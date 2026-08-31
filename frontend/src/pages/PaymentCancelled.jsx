import React from "react";
import { useNavigate } from "react-router-dom";
import { Page, Button, Alert } from "../components/UI";

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <Page width="narrow">
      <div className="py-12">
        <h1 className="text-display text-ink">Payment cancelled</h1>
        <Alert tone="info" className="mt-4">
          Nothing was charged. Your rent is still outstanding — you can pay online again,
          or pay your landlord directly and ask them to record it.
        </Alert>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => navigate("/rentersMyRoom")}>
            Back to my room
          </Button>
        </div>
      </div>
    </Page>
  );
}
