import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Page, Button } from "../components/UI";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Page width="narrow">
      <div className="py-16">
        <p className="tabular text-label font-semibold text-ink-faint">404</p>
        <h1 className="mt-1 text-display text-ink">We couldn&rsquo;t find that page</h1>
        <p className="mt-2 text-body text-ink-muted">
          The link may be out of date, or the room may have been taken down.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="primary" onClick={() => navigate("/findrooms")}>
            Browse rooms
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>

        <p className="mt-6 text-body text-ink-faint">
          Or head to your{" "}
          <Link to="/dashboard" className="rounded text-accent hover:text-accent-hover">
            dashboard
          </Link>
          .
        </p>
      </div>
    </Page>
  );
}
