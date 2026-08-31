import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { onNotification, offNotification } from "../../services/socket.service";
import { dateTime } from "../../lib/format";
import Button from "./Button";
import { SkeletonRows } from "./Skeleton";

const API = import.meta.env.VITE_API_URL;

/**
 * Outside-click and Escape are handled by the Navbar, which owns whether this
 * is open — having both manage it meant two listeners racing to close it.
 */
export default function NotificationDropdown({ onClose, onMarkAsRead }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/notifications`, { withCredentials: true });
      if (res.data.success) setNotifications(res.data.notifications ?? []);
    } catch {
      setError("Couldn't load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const onNew = () => fetchNotifications();
    onNotification(onNew);
    return () => offNotification(onNew);
  }, [fetchNotifications]);

  const markOne = async (id) => {
    // Optimistic: the badge should drop the instant you read it.
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    try {
      await axios.patch(`${API}/notifications/${id}/read`, {}, { withCredentials: true });
      await onMarkAsRead?.();
    } catch {
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: false } : n)));
    }
  };

  const markAll = async () => {
    const before = notifications;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await axios.patch(`${API}/notifications/read-all`, {}, { withCredentials: true });
      await onMarkAsRead?.();
    } catch {
      setNotifications(before);
    }
  };

  const open = (n) => {
    if (!n.isRead) markOne(n._id);
    onClose?.();
    // Land the user where the notification is actually about.
    if (n.type === "request_received") navigate("/incoming-request");
    else if (n.type === "rent_paid") navigate("/my-renters");
    else navigate("/dashboard");
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div
      role="region"
      aria-label="Notifications"
      className="absolute right-0 z-50 mt-1 w-80 rounded border border-line bg-surface shadow-overlay"
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <p className="text-label font-semibold text-ink">
          Notifications
          {unread > 0 && <span className="tabular text-ink-faint"> · {unread} unread</span>}
        </p>
        {unread > 0 && (
          <Button variant="ghost" size="sm" onClick={markAll}>
            Mark all read
          </Button>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <SkeletonRows rows={3} cols={1} />
        ) : error ? (
          <p role="alert" className="px-3 py-6 text-center text-body text-danger">
            {error}
          </p>
        ) : notifications.length === 0 ? (
          <p className="px-3 py-8 text-center text-body text-ink-faint">
            Nothing yet. You&rsquo;ll hear from us when someone applies to a room or pays
            their rent.
          </p>
        ) : (
          <ul className="divide-y divide-line">
            {notifications.map((n) => (
              <li key={n._id}>
                <button
                  type="button"
                  onClick={() => open(n)}
                  className={[
                    "flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-surface-raised",
                    !n.isRead && "bg-accent-soft",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span
                    aria-hidden="true"
                    className={[
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      n.isRead ? "bg-transparent" : "bg-accent",
                    ].join(" ")}
                  />
                  <span className="min-w-0">
                    <span className="block text-body text-ink">{n.message}</span>
                    <span className="mt-0.5 block text-label text-ink-faint">
                      {dateTime(n.createdAt)}
                      {!n.isRead && <span className="sr-only"> — unread</span>}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
