/**
 * The design system's front door. Pages import from here and nowhere else:
 *
 *   import { Page, PageHeader, Card, Button, Input, money } from "../components/UI";
 *
 * If a page needs a style that isn't expressible with these, that's a signal
 * to extend a primitive — not to hand-roll markup on the page.
 */

export { default as Button } from "./Button.jsx";
export { Input, Select, Textarea } from "./Field.jsx";
export { default as Card, CardHeader, CardBody } from "./Card.jsx";
export { default as Badge } from "./Badge.jsx";
export { default as Alert } from "./Alert.jsx";
export { default as EmptyState } from "./EmptyState.jsx";
export { default as Modal } from "./Modal.jsx";
export { default as Table } from "./Table.jsx";
export { default as Stat, StatRow } from "./Stat.jsx";
export { default as Page, PageHeader, Section } from "./Page.jsx";
export {
  default as Skeleton,
  SkeletonCard,
  SkeletonRows,
  LoadingAnnounce,
} from "./Skeleton.jsx";

// Formatting is part of visual consistency, so it ships with the system.
export { money, moneyExact, date, dateTime, titleCase, address } from "../../lib/format.js";
