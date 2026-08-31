import React from "react";
import { Link } from "react-router-dom";
import { Page, PageHeader, Card, CardBody, Alert } from "../components/UI";

/**
 * There used to be a contact FORM here. Its submit handler was:
 *
 *   const handleSubmit = (e) => { e.preventDefault(); console.log(formData); }
 *
 * No endpoint, no email, no feedback — someone could type out a problem with
 * their tenancy, press Send, and it went nowhere while looking like it worked.
 * A form that silently discards messages is worse than no form, so until there
 * is somewhere for it to go, these are the routes that actually reach someone.
 */

const CHANNELS = [
  {
    label: "Email",
    value: "support@easyrentify.xyz",
    href: "mailto:support@easyrentify.xyz",
    note: "Best for anything involving rent or payments — you get a written record.",
  },
  {
    label: "WhatsApp",
    value: "+91 82529 65226",
    href: "https://wa.me/918252965226",
    note: "Quickest for a short question.",
  },
];

export default function Contact() {
  return (
    <Page width="narrow">
      <PageHeader
        title="Contact us"
        description="Something wrong, or a question we haven't answered?"
      />

      <div className="flex flex-col gap-4">
        {CHANNELS.map((c) => (
          <Card key={c.label}>
            <CardBody>
              <p className="text-label font-semibold text-ink-faint">{c.label}</p>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="mt-1 inline-block rounded text-lead font-medium text-accent hover:text-accent-hover"
              >
                {c.value}
              </a>
              <p className="mt-1 text-body text-ink-faint">{c.note}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Alert tone="info" className="mt-6">
        <p className="font-semibold">If it&rsquo;s about money</p>
        <p className="mt-0.5">
          Check your{" "}
          <Link
            to="/renter-history"
            className="font-medium text-accent underline underline-offset-2"
          >
            payment history
          </Link>{" "}
          first — every payment your landlord records shows up there, and most
          disagreements are settled by looking at the same list.
        </p>
      </Alert>
    </Page>
  );
}
