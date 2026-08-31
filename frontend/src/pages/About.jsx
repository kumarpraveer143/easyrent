import React from "react";
import { Link } from "react-router-dom";
import { Page, PageHeader, Card, CardBody } from "../components/UI";

/**
 * The old About page was 228 lines of stat cards claiming numbers the product
 * doesn't have ("10,000+ happy users"), a team section, and a mission
 * statement. Inventing traction is the fastest way to lose a landlord's trust
 * the first time they notice.
 *
 * This says what the product is and what it doesn't do yet.
 */

const HONEST = [
  [
    "What it does today",
    [
      "Landlords list rooms and take them off the market",
      "Renters search, save and apply; landlords accept or decline",
      "Rent is recorded against a tenancy and both sides see the same history",
      "Card payment through Stripe, where it's switched on",
    ],
  ],
  [
    "What it doesn't do yet",
    [
      "Photos of the actual room — listings show a placeholder for now",
      "UPI and auto-collect, which is how most rent in India is actually paid",
      "Rent reminders and arrears tracking",
      "Buildings with many units — one room at a time for now",
    ],
  ],
];

export default function About() {
  return (
    <Page width="narrow">
      <PageHeader
        title="About EasyRent"
        description="A small tool for renting a room and keeping the record straight."
      />

      <p className="text-body text-ink-muted">
        Most rental disputes in India come down to two people remembering the same
        month differently. EasyRent keeps one shared record: what the rent is, what was
        paid, and when. The listing side exists so the record starts from the first day
        of the tenancy rather than being reconstructed later.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {HONEST.map(([heading, items]) => (
          <Card key={heading}>
            <CardBody>
              <h2 className="text-body font-semibold text-ink">{heading}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {items.map((t) => (
                  <li key={t} className="flex gap-2.5 text-body text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-faint"
                    />
                    {t}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        ))}
      </div>

      <p className="mt-8 border-t border-line pt-6 text-body text-ink-faint">
        Questions, or something not working?{" "}
        <Link to="/contact" className="font-medium text-accent hover:text-accent-hover">
          Get in touch
        </Link>
        .
      </p>
    </Page>
  );
}
