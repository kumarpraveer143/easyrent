import React from "react";
import { Page, PageHeader, Card, CardBody } from "../components/UI";

/**
 * Kept, but no longer linked from the navigation or the footer.
 *
 * A personal profile with social links in a product's main nav reads as a
 * portfolio project rather than a business — which matters when the thing
 * you're asking a landlord to trust is their rent record. It stays reachable
 * at /developer if you want it; deleting your own page isn't my call.
 */

const LINKS = [
  { label: "GitHub", href: "https://github.com/kumarpraveer143" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/praveerdeveloper/" },
];

export default function Developer() {
  return (
    <Page width="narrow">
      <PageHeader title="Praveer Kumar" description="Builder of EasyRent." />

      <Card>
        <CardBody>
          <p className="text-body text-ink-muted">
            EasyRent started as a way to keep one honest record of rent between a
            landlord and a tenant, instead of two people remembering the same month
            differently.
          </p>

          <ul className="mt-5 flex flex-wrap gap-4 border-t border-line pt-4">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded text-body font-medium text-accent hover:text-accent-hover"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </Page>
  );
}
