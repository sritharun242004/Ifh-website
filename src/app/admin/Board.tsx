"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, Camera, MapPin, Phone, RefreshCw, Search } from "lucide-react";
import LeadDrawer from "./LeadDrawer";
import { pretty, STATUSES, type Lead, type StatusId } from "./status";

type Columns = Record<StatusId, string[]>;
type Filter = "all" | "completed" | "draft";

function group(leads: Lead[]): Columns {
  const cols = Object.fromEntries(STATUSES.map((s) => [s.id, [] as string[]])) as Columns;
  [...leads]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .forEach((l) => (cols[l.status] ?? cols.new).push(l.token));
  return cols;
}

const CardBody = memo(function CardBody({ lead }: { lead: Lead }) {
  return (
    <>
      <div className="leadTop">
        <b>{lead.name}</b>
        {lead.completed ? (
          <span className="seatTag">#{lead.position}</span>
        ) : (
          <span className="seatTag draft">STEP 1</span>
        )}
      </div>
      <div className="leadMeta">
        <span>
          <Phone size={12} />
          {pretty(lead.phone)}
        </span>
      </div>
      <div className="leadMeta">
        <span className="ell">
          <MapPin size={12} />
          {lead.town}
          {lead.locationText ? ` · ${lead.locationText}` : ""}
        </span>
      </div>
      {(lead.availability || lead.photoCount > 0) && (
        <div className="leadMeta">
          {lead.availability && (
            <span>
              <CalendarDays size={12} />
              {lead.availability}
            </span>
          )}
          {lead.photoCount > 0 && (
            <span>
              <Camera size={12} />
              {lead.photoCount}
            </span>
          )}
        </div>
      )}
    </>
  );
});

function SortableCard({ lead, onOpen }: { lead: Lead; onOpen: (lead: Lead) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.token });
  return (
    <div
      ref={setNodeRef}
      className={`leadCard ${isDragging ? "ghost" : ""}`}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      {...attributes}
      {...listeners}
      aria-label={`${lead.name}. Press Enter to open, Space to move.`}
      onClick={() => onOpen(lead)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isDragging) onOpen(lead);
        else listeners?.onKeyDown?.(e);
      }}
    >
      <CardBody lead={lead} />
    </div>
  );
}

function Column({
  status,
  ids,
  byId,
  onOpen,
}: {
  status: (typeof STATUSES)[number];
  ids: string[];
  byId: Record<string, Lead>;
  onOpen: (lead: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status.id });
  return (
    <section className={`column ${isOver ? "over" : ""}`} aria-label={status.label}>
      <div className="columnHead">
        <i className="dot" style={{ background: status.color }} />
        {status.label}
        <em>{ids.length}</em>
      </div>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="columnBody">
          {ids.map((id) => byId[id] && <SortableCard key={id} lead={byId[id]} onOpen={onOpen} />)}
          {ids.length === 0 && <p className="empty">Drop here</p>}
        </div>
      </SortableContext>
    </section>
  );
}

function SkeletonBoard() {
  return (
    <div className="board" aria-busy="true">
      {STATUSES.map((s) => (
        <section className="column" key={s.id}>
          <div className="columnHead">
            <i className="dot" style={{ background: s.color }} />
            {s.label}
          </div>
          <div className="columnBody">
            {[0, 1].map((i) => (
              <div className="leadCard" key={i} style={{ cursor: "default" }}>
                <span className="skeleton" style={{ width: "60%", height: 14 }} />
                <span className="skeleton" style={{ width: "45%", height: 11 }} />
                <span className="skeleton" style={{ width: "75%", height: 11 }} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

async function patchStatus(token: string, status: StatusId) {
  const res = await fetch("/api/admin/leads", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token, status }),
  });
  if (!res.ok) throw new Error(res.status === 401 ? "signed out" : "network error");
}

export default function Board() {
  const [byId, setById] = useState<Record<string, Lead> | null>(null);
  const [cols, setCols] = useState<Columns | null>(null);
  const [loadErr, setLoadErr] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [toast, setToast] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const snapshot = useRef<{ cols: Columns; byId: Record<string, Lead> } | null>(null);
  const lastDragEnd = useRef(0);

  async function load() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const { leads } = (await res.json()) as { leads: Lead[] };
      setById(Object.fromEntries(leads.map((l) => [l.token, l])));
      setCols(group(leads));
      setLoadErr("");
    } catch {
      setLoadErr("Couldn't load leads. Check your connection and refresh.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space", "Enter"] },
    }),
  );

  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!cols || !byId) return null;
    const match = (l: Lead) =>
      (filter === "all" || (filter === "completed" ? l.completed : !l.completed)) &&
      (!q ||
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        l.town.toLowerCase().includes(q) ||
        (l.locationText ?? "").toLowerCase().includes(q));
    return Object.fromEntries(STATUSES.map((s) => [s.id, cols[s.id].filter((id) => byId[id] && match(byId[id]))])) as Columns;
  }, [cols, byId, q, filter]);

  if (loadErr && !byId) return <p className="admin__err">{loadErr}</p>;

  const findCol = (id: string): StatusId | undefined =>
    STATUSES.find((s) => s.id === id)?.id ?? STATUSES.find((s) => cols?.[s.id].includes(id))?.id;

  function onDragStart({ active }: DragStartEvent) {
    if (cols && byId) snapshot.current = { cols, byId };
    setActiveId(String(active.id));
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    const from = findCol(String(active.id));
    const to = findCol(String(over.id));
    if (!from || !to || from === to) return;
    setCols((prev) => {
      if (!prev) return prev;
      const fromIds = prev[from].filter((id) => id !== active.id);
      const toIds = [...prev[to]];
      const overIndex = toIds.indexOf(String(over.id));
      toIds.splice(overIndex >= 0 ? overIndex : toIds.length, 0, String(active.id));
      return { ...prev, [from]: fromIds, [to]: toIds };
    });
  }

  function onDragCancel() {
    if (snapshot.current) setCols(snapshot.current.cols);
    setActiveId(null);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    const id = String(active.id);
    setActiveId(null);
    lastDragEnd.current = Date.now();
    const before = snapshot.current;
    if (!over || !before || !cols || !byId) return onDragCancel();

    const col = findCol(id)!;
    let ids = cols[col];
    const overIndex = ids.indexOf(String(over.id));
    const currentIndex = ids.indexOf(id);
    if (overIndex >= 0 && overIndex !== currentIndex) ids = arrayMove(ids, currentIndex, overIndex);
    setCols({ ...cols, [col]: ids });

    const original = before.byId[id];
    if (original.status === col) return; // reordered within the same stage

    setById((prev) => (prev ? { ...prev, [id]: { ...original, status: col } } : prev));
    patchStatus(id, col).catch((error: Error) => {
      setCols(before.cols);
      setById(before.byId);
      setToast(`Couldn't move ${original.name}: ${error.message}. Change undone.`);
    });
  }

  // Stage change from the drawer: same optimistic save + undo as a drag.
  function moveTo(token: string, status: StatusId) {
    if (!cols || !byId) return;
    const before = { cols, byId };
    const original = byId[token];
    const from = original.status;
    setCols({ ...cols, [from]: cols[from].filter((t) => t !== token), [status]: [token, ...cols[status]] });
    setById({ ...byId, [token]: { ...original, status } });
    patchStatus(token, status).catch((error: Error) => {
      setCols(before.cols);
      setById(before.byId);
      setToast(`Couldn't move ${original.name}: ${error.message}. Change undone.`);
    });
  }

  const open = (lead: Lead) => {
    if (Date.now() - lastDragEnd.current < 150) return;
    setSelected(lead.token);
  };

  const total = byId ? Object.keys(byId).length : 0;
  const completed = byId ? Object.values(byId).filter((l) => l.completed).length : 0;

  return (
    <>
      <div className="pageHead">
        <div>
          <h1>Owner leads</h1>
          <p>
            {byId ? `${total} owner${total === 1 ? "" : "s"} · ${completed} completed · ` : ""}
            Drag cards between stages. Changes save automatically.
          </p>
        </div>
        <div className="boardTools">
          <label className="searchWrap">
            <Search size={15} />
            <input
              className="input"
              style={{ paddingLeft: 32, height: 36 }}
              placeholder="Search name, phone, town"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search leads"
            />
          </label>
          <div className="segmented" role="group" aria-label="Filter">
            {(
              [
                ["all", "All"],
                ["completed", "Completed"],
                ["draft", "Step 1 only"],
              ] as const
            ).map(([value, label]) => (
              <button key={value} className={filter === value ? "on" : ""} onClick={() => setFilter(value)} aria-pressed={filter === value}>
                {label}
              </button>
            ))}
          </div>
          <button className="btn small" onClick={load} disabled={refreshing} aria-label="Refresh">
            <RefreshCw size={14} style={refreshing ? { animation: "spin 0.8s linear infinite" } : undefined} />
            Refresh
          </button>
        </div>
      </div>

      {!visible || !byId ? (
        <SkeletonBoard />
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          onDragCancel={onDragCancel}
        >
          <div className="board">
            {STATUSES.map((s) => (
              <Column key={s.id} status={s} ids={visible[s.id]} byId={byId} onOpen={open} />
            ))}
          </div>
          <DragOverlay dropAnimation={{ duration: 180, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
            {activeId && byId[activeId] ? (
              <div className="leadCard overlay">
                <CardBody lead={byId[activeId]} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {selected && byId?.[selected] && (
        <LeadDrawer lead={byId[selected]} onClose={() => setSelected(null)} onMove={moveTo} />
      )}

      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
