import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  connectSocket,
  disconnectSocket,
  onNotification,
  offNotification,
} from "../../services/socket.service";
import { toast } from "react-toastify";
import NotificationDropdown from "./NotificationDropdown";
import Button from "./Button";

/**
 * Navigation is <Link>, not <button onClick={navigate}>.
 *
 * The old version routed every nav through a handler that ran
 * setTimeout(..., 500) with a full-screen spinner before navigating — half a
 * second of artificial delay on every click, loading nothing. It also meant
 * middle-click, ctrl-click and "open in new tab" did nothing, and screen
 * readers announced navigation as buttons.
 */

const PUBLIC_LINKS = [
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);

  const raw = localStorage.getItem("user");
  let user = null;
  try {
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  const userId = user?._id ?? null;

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/notifications/unread`, {
        withCredentials: true,
      });
      setUnreadCount(res.data.count || 0);
    } catch {
      // A failed badge count is not worth interrupting the user for.
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    connectSocket(userId);

    const handleNotification = (data) => {
      toast.info(data.message);
      fetchUnreadCount();
    };

    onNotification(handleNotification);
    fetchUnreadCount();

    return () => {
      offNotification(handleNotification);
      disconnectSocket();
    };
  }, [userId, fetchUnreadCount]);

  // Close the notification panel on outside click and on Escape.
  useEffect(() => {
    if (!isNotificationOpen) return;
    const onDown = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotificationOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setIsNotificationOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [isNotificationOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch {
      // Even if the server call fails, clear local state — the user asked to leave.
    } finally {
      disconnectSocket();
      localStorage.removeItem("user");
      localStorage.removeItem("favouriteRooms");
      navigate("/login");
    }
  };

  const linkClass = ({ isActive }) =>
    [
      "rounded px-2 py-1 text-body transition-colors",
      isActive ? "text-ink font-medium" : "text-ink-faint hover:text-ink",
    ].join(" ");

  const links = [...PUBLIC_LINKS];
  if (user?.userType === "renter") links.unshift({ to: "/findrooms", label: "Find rooms" });

  const bell = (
    <div className="relative" ref={notifRef}>
      <button
        type="button"
        onClick={() => setIsNotificationOpen((o) => !o)}
        aria-label={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        aria-expanded={isNotificationOpen}
        className="relative flex h-9 w-9 items-center justify-center rounded text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink"
      >
        {/* Bell, drawn rather than pulled from an icon pack, to keep stroke
            weight consistent with the rest of the chrome. */}
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M10 2.5a4.5 4.5 0 0 0-4.5 4.5c0 3-1 4.5-1.5 5h12c-.5-.5-1.5-2-1.5-5A4.5 4.5 0 0 0 10 2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M8 15a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        {unreadCount > 0 && (
          <span className="tabular absolute right-0.5 top-0.5 min-w-[16px] rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {isNotificationOpen && (
        <NotificationDropdown
          onClose={() => setIsNotificationOpen(false)}
          onMarkAsRead={fetchUnreadCount}
        />
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 border-b border-line bg-surface">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="rounded text-lead font-semibold tracking-tight text-ink"
        >
          EasyRent
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              {bell}
              <Link
                to="/dashboard"
                className="inline-flex h-9 items-center rounded border border-line-strong bg-surface px-3 text-body font-medium text-ink transition-colors hover:bg-surface-raised"
              >
                Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex h-9 items-center rounded px-3 text-body font-medium text-ink-muted transition-colors hover:text-ink"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex h-9 items-center rounded border border-ink bg-ink px-3 text-body font-medium text-white transition-colors hover:bg-black"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {user && bell}
          <button
            type="button"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={isMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded text-ink-muted transition-colors hover:bg-surface-raised"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d={isMenuOpen ? "M5 5l10 10M15 5L5 15" : "M3 6h14M3 10h14M3 14h14"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-line bg-surface px-4 py-2 md:hidden">
          <div className="flex flex-col">
            <NavLink to="/" className={linkClass} onClick={() => setIsMenuOpen(false)}>
              Home
            </NavLink>
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex gap-2 border-t border-line pt-2">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded border border-line-strong text-body font-medium text-ink"
                  >
                    Dashboard
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded border border-line-strong text-body font-medium text-ink"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-flex h-9 flex-1 items-center justify-center rounded border border-ink bg-ink text-body font-medium text-white"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
