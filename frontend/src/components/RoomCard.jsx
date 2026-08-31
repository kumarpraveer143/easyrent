import React from "react";
import { Link } from "react-router-dom";
import { Card, Badge, money, titleCase } from "./UI";

/**
 * One listing, used everywhere a listing appears (search, favourites, a
 * landlord's own rooms) so a room looks the same wherever you meet it.
 *
 * On images: the app maps room TYPE to one of four stock photos, so every
 * "single" in the country shows the same picture — and `house` and `studio`
 * fall through to a filename that doesn't exist, rendering a broken image.
 * Showing a photo of a different room is worse than showing none, so until
 * real uploads land (B19/B20) this renders an honest placeholder.
 */
export default function RoomCard({ room, to, action }) {
  if (!room) return null;

  const { _id, roomNumber, roomType, rentPrice, numberOfRooms, numberOfBathrooms, address, isAvailable } =
    room;

  const body = (
    <>
      <div className="flex h-32 items-center justify-center border-b border-line bg-surface-raised">
        <span className="text-label uppercase tracking-wider text-ink-faint">
          {titleCase(roomType)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-body font-semibold text-ink">
              {titleCase(roomType)}
              {roomNumber ? ` · No. ${roomNumber}` : ""}
            </h3>
            <p className="mt-0.5 truncate text-label text-ink-faint">
              {address?.city}
              {address?.state ? `, ${address.state}` : ""}
            </p>
          </div>
          {isAvailable === false && <Badge tone="neutral">Let</Badge>}
        </div>

        <dl className="mt-3 flex gap-4 text-label text-ink-faint">
          <div>
            <dt className="sr-only">Rooms</dt>
            <dd>
              <span className="tabular text-ink">{numberOfRooms}</span> rooms
            </dd>
          </div>
          <div>
            <dt className="sr-only">Bathrooms</dt>
            <dd>
              <span className="tabular text-ink">{numberOfBathrooms}</span> bath
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-end justify-between gap-3 border-t border-line pt-3">
          <div>
            <span className="tabular text-lead font-semibold text-ink">{money(rentPrice)}</span>
            <span className="text-label text-ink-faint"> / month</span>
          </div>
          {action}
        </div>
      </div>
    </>
  );

  if (to) {
    return (
      <Card interactive className="flex flex-col overflow-hidden p-0">
        <Link to={to} className="flex flex-1 flex-col rounded" aria-label={`View ${roomType} in ${address?.city ?? "listing"}`}>
          {body}
        </Link>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col overflow-hidden p-0" data-room={_id}>
      {body}
    </Card>
  );
}
