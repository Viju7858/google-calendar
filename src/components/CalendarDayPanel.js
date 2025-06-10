import React, { useState, useEffect } from "react";

const MINUTE_HEIGHT = 50 / 60; // ~0.8333 px per minute

const minutes = Array.from({ length: 1440 }, (_, i) => {
  const hour = Math.floor(i / 60);
  const minute = i % 60;
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const period = hour < 12 ? "AM" : "PM";
  return {
    label:
      minute % 15 === 0
        ? `${h12}:${minute.toString().padStart(2, "0")} ${period}`
        : "",
    index: i,
  };
});

function pad(n) {
  return n.toString().padStart(2, "0");
}

const formatDate = (d) => d.toISOString().slice(0, 10);
const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const parseDateTime = (dateStr, timeStr) =>
  new Date(`${dateStr}T${timeStr}:00`);

function formatEventRange(start, end) {
  const dateStr = start
    .toLocaleDateString(undefined, {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    .replace(",", "");

  const formatTime = (d) => {
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  };

  return `${dateStr} ${formatTime(start)} – ${formatTime(end)}`;
}

export default function GoogleCalendarDayPanel({
  initialDate = new Date(),
  onClose,
}) {
  const baseDate = new Date(initialDate);
  baseDate.setHours(0, 0, 0, 0);

  const [events, setEvents] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartIdx, setDragStartIdx] = useState(null);
  const [dragEndIdx, setDragEndIdx] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [draftEvent, setDraftEvent] = useState({
    title: "",
    description: "",
    start: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000),
    end: new Date(baseDate.getTime() + 9 * 60 * 60 * 1000),
  });

  useEffect(() => {
    if (!isDragging && dragStartIdx !== null && dragEndIdx !== null) {
      const startMin = Math.min(dragStartIdx, dragEndIdx);
      const endMin = Math.max(dragStartIdx, dragEndIdx) + 1;
      const newStart = new Date(baseDate.getTime() + startMin * 60000);
      const newEnd = new Date(baseDate.getTime() + endMin * 60000);
      setDraftEvent({
        title: "",
        description: "",
        start: newStart,
        end: newEnd,
      });
      setEditingIndex(null);
      setCreatingEvent(true);
      setDragStartIdx(null);
      setDragEndIdx(null);
    }
  }, [isDragging, dragStartIdx, dragEndIdx, baseDate]);

  const saveEvent = () => {
    if (!draftEvent.title.trim()) {
      alert("Please enter an event title.");
      return;
    }
    if (draftEvent.end <= draftEvent.start) {
      alert("End date/time must be after start date/time.");
      return;
    }

    if (editingIndex !== null) {
      setEvents((prev) =>
        prev.map((ev, i) => (i === editingIndex ? draftEvent : ev))
      );
    } else {
      setEvents((prev) => [...prev, draftEvent]);
    }

    setCreatingEvent(false);
    setEditingTime(false);
    setEditingIndex(null);
  };

  const deleteEvent = () => {
    if (editingIndex !== null) {
      setEvents((prev) => prev.filter((_, i) => i !== editingIndex));
      setCreatingEvent(false);
      setEditingTime(false);
      setEditingIndex(null);
    }
  };

  const cancelCreate = () => {
    setCreatingEvent(false);
    setEditingTime(false);
    setEditingIndex(null);
  };

  const getEventPosition = (ev) => {
    const startDiff = (ev.start - baseDate) / 60000;
    const duration = (ev.end - ev.start) / 60000;
    return { top: startDiff * MINUTE_HEIGHT, height: duration * MINUTE_HEIGHT };
  };

  const headerDateDisplay = baseDate.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="google-calendar-day-panel"
      style={{
        height: "100%",
        maxHeight: "100vh",
        overflowY: "auto",
        width: "100%",
        fontFamily: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        backgroundColor: "white",
        position: "relative",
        borderRadius: 6,
        boxShadow: "0 2px 4px rgb(0 0 0 / 0.1), 0 4px 8px rgb(0 0 0 / 0.06)",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "inset 0 -1px 0 0 rgb(0 0 0 / 0.1)",
        }}
      >
        <div style={{ fontWeight: "600", fontSize: 16 }}>
          {headerDateDisplay}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              setDraftEvent({
                title: "",
                description: "",
                start: new Date(baseDate.getTime() + 8 * 60 * 60 * 1000),
                end: new Date(baseDate.getTime() + 9 * 60 * 60 * 1000),
              });
              setCreatingEvent(true);
              setEditingIndex(null);
            }}
            style={{ padding: "4px 8px", fontSize: 13, cursor: "pointer" }}
          >
            + Add New
          </button>
          <button
            aria-label="Close"
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              width: 32,
              height: 32,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="20"
              width="20"
              viewBox="0 0 20 20"
              fill="#5f6368"
            >
              <path d="M14.348 5.652a.5.5 0 00-.707 0L10 9.293 6.36 5.652a.5.5 0 10-.707.707L9.293 10l-3.64 3.64a.5.5 0 00.707.707L10 10.707l3.64 3.64a.5.5 0 00.707-.707L10.707 10l3.64-3.64a.5.5 0 000-.708z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          position: "relative",
          fontSize: 13,
          color: "#3c4043",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 72,
            paddingRight: 8,
            textAlign: "right",
            position: "sticky",
            top: 56,
            backgroundColor: "white",
            zIndex: 5,
            borderRight: "1px solid #e0e0e0",
            fontWeight: 400,
            color: "#5f6368",
          }}
        >
          {Array.from({ length: 24 }, (_, hour) => {
            const h12 = hour % 12 === 0 ? 12 : hour % 12;
            const period = hour < 12 ? "AM" : "PM";
            return (
              <div
                key={hour}
                style={{
                  height: 50,
                  lineHeight: "50px",
                  borderBottom: "1px solid #e0e0e0",
                  paddingRight: 8,
                  fontSize: 12,
                }}
              >{`${h12}:00 ${period}`}</div>
            );
          })}
        </div>

        <div
          style={{
            flexGrow: 1,
            position: "relative",
            borderLeft: "1px solid #e0e0e0",
            backgroundColor: "#fff",
          }}
        >
          {minutes.map(({ label, index }) => {
            const isSelected =
              isDragging &&
              index >= Math.min(dragStartIdx, dragEndIdx) &&
              index <= Math.max(dragStartIdx, dragEndIdx);
            return (
              <div
                key={index}
                onMouseDown={() => {
                  setDragStartIdx(index);
                  setDragEndIdx(index);
                  setIsDragging(true);
                }}
                onMouseEnter={() => {
                  if (isDragging) setDragEndIdx(index);
                }}
                onMouseUp={() => {
                  if (isDragging) setIsDragging(false);
                }}
                style={{
                  height: MINUTE_HEIGHT,
                  backgroundColor: isSelected ? "#cbdcf8" : "transparent",
                  borderBottom:
                    index % 60 === 59 ? "1px solid #e0e0e0" : "none",
                  cursor: "pointer",
                }}
                title={label}
              />
            );
          })}

          {events.map((ev, idx) => {
            const { top, height } = getEventPosition(ev);
            return (
              <div
                key={idx}
                onClick={() => {
                  setDraftEvent({ ...ev });
                  setCreatingEvent(true);
                  setEditingIndex(idx);
                }}
                title={`${ev.title}\n${formatEventRange(ev.start, ev.end)}`}
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  top,
                  height,
                  backgroundColor: "#4285f4",
                  borderRadius: 4,
                  color: "white",
                  padding: "2px 6px",
                  fontSize: 12,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  boxShadow: "0 1px 4px rgb(0 0 0 / 0.2)",
                  cursor: "pointer",
                }}
              >
                {ev.title || "(No title)"}
              </div>
            );
          })}
        </div>
      </div>

      {creatingEvent && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 16,
            boxShadow: "0 2px 10px rgb(0 0 0 / 0.3)",
            borderRadius: 8,
            width: 320,
            zIndex: 100,
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Event Details</h3>

          <label
            htmlFor="title"
            style={{ display: "block", marginBottom: 4, fontWeight: 600 }}
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={draftEvent.title}
            onChange={(e) =>
              setDraftEvent((prev) => ({ ...prev, title: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "6px 8px",
              marginBottom: 12,
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
            }}
            autoFocus
          />

          <label
            htmlFor="description"
            style={{ display: "block", marginBottom: 4, fontWeight: 600 }}
          >
            Description
          </label>
          <textarea
            id="description"
            value={draftEvent.description}
            onChange={(e) =>
              setDraftEvent((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={3}
            style={{
              width: "100%",
              padding: "6px 8px",
              borderRadius: 4,
              border: "1px solid #ccc",
              fontSize: 14,
              resize: "vertical",
            }}
          />

          <div
            style={{
              marginTop: 8,
              padding: "8px 0",
              fontSize: 13,
              fontWeight: 700,
              color: "#555",
              textAlign: "center",
              borderTop: "1px solid #eee",
              cursor: "pointer",
            }}
            onClick={() => setEditingTime(true)}
          >
            {!editingTime ? (
              formatEventRange(draftEvent.start, draftEvent.end)
            ) : (
              <div
                style={{ display: "flex", justifyContent: "center", gap: 6 }}
              >
                <input
                  type="time"
                  value={formatTime(draftEvent.start)}
                  onChange={(e) =>
                    setDraftEvent((prev) => ({
                      ...prev,
                      start: parseDateTime(
                        formatDate(prev.start),
                        e.target.value
                      ),
                    }))
                  }
                />
                –
                <input
                  type="time"
                  value={formatTime(draftEvent.end)}
                  onChange={(e) =>
                    setDraftEvent((prev) => ({
                      ...prev,
                      end: parseDateTime(formatDate(prev.end), e.target.value),
                    }))
                  }
                />
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            {editingIndex !== null && (
              <button
                onClick={deleteEvent}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}

            <div style={{ display: "flex", gap: 12, marginLeft: "auto" }}>
              <button
                onClick={cancelCreate}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#e0e0e0",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveEvent}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#4285f4",
                  border: "none",
                  borderRadius: 4,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {editingIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
