import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { getSocket } from "../services/socket.service";
import { Button, Input, Alert } from "./UI";

const API = import.meta.env.VITE_API_URL;

/**
 * Landlord ↔ tenant chat.
 *
 * `currentUserId` is used only to decide which side of the thread a message
 * sits on. It is NOT sent to the server any more: the socket derives the
 * sender from the signed JWT, because it used to accept whatever `senderId`
 * the payload claimed, letting anyone post as anyone (SEC-07).
 */
export default function Chat({ relationId, currentUserId, recipientName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const endRef = useRef(null);
  const socket = getSocket();

  useEffect(() => {
    if (!socket || !relationId) return;

    socket.emit("join_chat", relationId);

    const onReceive = (message) => setMessages((prev) => [...prev, message]);
    socket.on("receive_message", onReceive);
    return () => socket.off("receive_message", onReceive);
  }, [socket, relationId]);

  const load = useCallback(async () => {
    if (!relationId) return;
    try {
      const res = await axios.get(`${API}/chat/${relationId}`, { withCredentials: true });
      setMessages(res.data.messages ?? []);
      // The server takes the reader from the session; no userId in the body.
      await axios.post(`${API}/chat/read`, { relationId }, { withCredentials: true });
    } catch {
      setError("Couldn't load this conversation.");
    }
  }, [relationId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !socket) return;
    socket.emit("send_message", { relationId, message: text });
    setDraft("");
  };

  return (
    <div
      role="dialog"
      aria-label={`Conversation with ${recipientName ?? "the other party"}`}
      className="fixed bottom-4 right-4 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col rounded border border-line bg-surface shadow-overlay"
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2.5">
        <p className="truncate text-body font-semibold text-ink">
          {recipientName ?? "Messages"}
        </p>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close conversation">
          Close
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {error && <Alert tone="danger">{error}</Alert>}

        {!error && messages.length === 0 && (
          <p className="py-10 text-center text-body text-ink-faint">
            No messages yet. Say hello.
          </p>
        )}

        <ul className="flex flex-col gap-2">
          {messages.map((msg, i) => {
            const mine = String(msg.senderId) === String(currentUserId);
            return (
              <li
                key={msg._id ?? i}
                className={mine ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={[
                    "max-w-[80%] rounded border px-2.5 py-1.5",
                    mine
                      ? "border-ink bg-ink text-ink-contrast"
                      : "border-line bg-surface-raised text-ink",
                  ].join(" ")}
                >
                  <p className="text-body">{msg.message}</p>
                  <p
                    className={[
                      "tabular mt-0.5 text-right text-[11px]",
                      mine ? "text-ink-contrast/70" : "text-ink-faint",
                    ].join(" ")}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex items-end gap-2 border-t border-line p-2.5">
        <div className="flex-1">
          <Input
            aria-label="Message"
            placeholder="Type a message…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
        <Button type="submit" variant="primary" disabled={!draft.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
