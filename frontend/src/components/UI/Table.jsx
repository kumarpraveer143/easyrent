import React from "react";

/**
 * A table that always scrolls inside its own container, so a wide table on a
 * phone never makes the whole page scroll sideways.
 *
 * Usage:
 *   <Table>
 *     <Table.Head><Table.HeadCell>Tenant</Table.HeadCell>…</Table.Head>
 *     <Table.Body>
 *       <Table.Row><Table.Cell>…</Table.Cell></Table.Row>
 *     </Table.Body>
 *   </Table>
 */
export default function Table({ className = "", children, caption }) {
  return (
    <div className="overflow-x-auto rounded border border-line bg-surface">
      <table className={["w-full min-w-[36rem] border-collapse text-body", className].join(" ")}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

Table.Head = function Head({ children }) {
  return (
    <thead className="bg-surface-raised">
      <tr>{children}</tr>
    </thead>
  );
};

Table.HeadCell = function HeadCell({ align = "left", className = "", children }) {
  return (
    <th
      scope="col"
      className={[
        "border-b border-line px-4 py-2.5 text-label font-semibold text-ink-muted",
        align === "right" ? "text-right" : "text-left",
        className,
      ].join(" ")}
    >
      {children}
    </th>
  );
};

Table.Body = function Body({ children }) {
  return <tbody className="divide-y divide-line">{children}</tbody>;
};

Table.Row = function Row({ className = "", children, ...props }) {
  return (
    <tr className={["hover:bg-surface-sunken", className].join(" ")} {...props}>
      {children}
    </tr>
  );
};

Table.Cell = function Cell({ align = "left", numeric = false, className = "", children, ...props }) {
  return (
    <td
      className={[
        "px-4 py-3 align-middle text-ink-muted",
        align === "right" ? "text-right" : "text-left",
        numeric && "tabular",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </td>
  );
};

/** A full-width row for the empty case, so the table keeps its header. */
Table.Empty = function Empty({ colSpan, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-body text-ink-faint">
        {children}
      </td>
    </tr>
  );
};
