import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.css";
import { GRAPHS } from "./graphs";

/**
 * A small, zoomable lineage graph that looks and behaves like the lineage pane
 * in dbt Wizard Desktop. Use it in quickstarts so readers can poke at the
 * result instead of looking at a screenshot.
 *
 *   <LineageGraph graph="jaffleShopWithRevenue" focus="daily_revenue" />
 *
 * Interaction:
 * - Drag to pan.
 * - Press Cmd (Mac) or Ctrl and scroll to zoom. A trackpad pinch works too.
 *   Plain scrolling is left alone so the page still scrolls.
 * - Use the + and - buttons, or Reset, if you'd rather click.
 * - Click a node to highlight everything upstream and downstream of it.
 * - Use the Show tests toggle to add or hide the data tests.
 *
 * Props:
 * - graph: name of a graph in ./graphs.js (required)
 * - focus: id of the node to outline in purple and center on first load
 * - height: pixel height of the canvas (default 360)
 * - title: accessible label for the graph
 *
 * The visual graph is dropped from the generated .md. Agents get a plain list
 * of each node and what it depends on (data-md-only).
 */

const NODE_W = 188;
const NODE_H = 44;
const COL_GAP = 84;
const ROW_GAP = 16;
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2.5;

const BADGES = {
  seed: "SEED",
  model: "MDL",
  test: "TST",
};

function layout(nodes, edges) {
  const byId = new Map(nodes.map((n) => [n.id, { ...n }]));
  const parents = new Map(nodes.map((n) => [n.id, []]));
  edges.forEach(([from, to]) => {
    if (byId.has(from) && byId.has(to)) {
      parents.get(to).push(from);
    }
  });

  // Longest-path layering: a node sits one column right of its deepest parent.
  const depth = new Map();
  const visit = (id) => {
    if (depth.has(id)) {
      return depth.get(id);
    }
    const d = parents.get(id).length
      ? Math.max(...parents.get(id).map(visit)) + 1
      : 0;
    depth.set(id, d);
    return d;
  };
  nodes.forEach((n) => visit(n.id));

  const columns = new Map();
  nodes.forEach((n) => {
    const d = depth.get(n.id);
    if (!columns.has(d)) {
      columns.set(d, []);
    }
    columns.get(d).push(n.id);
  });

  const tallest = Math.max(...[...columns.values()].map((c) => c.length));
  const totalH = tallest * (NODE_H + ROW_GAP) - ROW_GAP;

  columns.forEach((ids, d) => {
    const colH = ids.length * (NODE_H + ROW_GAP) - ROW_GAP;
    const offset = (totalH - colH) / 2;
    ids.forEach((id, i) => {
      const node = byId.get(id);
      node.x = d * (NODE_W + COL_GAP);
      node.y = offset + i * (NODE_H + ROW_GAP);
    });
  });

  return {
    nodes: [...byId.values()],
    width: (Math.max(...depth.values()) + 1) * (NODE_W + COL_GAP) - COL_GAP,
    height: totalH,
  };
}

function related(id, edges) {
  const seen = new Set([id]);
  const walk = (start, dir) => {
    const queue = [start];
    while (queue.length) {
      const cur = queue.pop();
      edges.forEach(([from, to]) => {
        const next = dir === "up" ? (to === cur ? from : null) : from === cur ? to : null;
        if (next && !seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      });
    }
  };
  walk(id, "up");
  walk(id, "down");
  return seen;
}

function edgePath(a, b) {
  const x1 = a.x + NODE_W;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  const mid = (x1 + x2) / 2;
  return `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`;
}

export default function LineageGraph({
  graph,
  focus,
  height = 360,
  title = "Lineage graph",
}) {
  const data = GRAPHS[graph];
  const [showTests, setShowTests] = useState(false);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState({ x: 0, y: 0, k: 1 });
  const canvasRef = useRef(null);
  const dragRef = useRef(null);

  const visible = useMemo(() => {
    if (!data) {
      return { nodes: [], edges: [] };
    }
    const nodes = data.nodes.filter((n) => showTests || n.type !== "test");
    const ids = new Set(nodes.map((n) => n.id));
    const edges = data.edges.filter(([a, b]) => ids.has(a) && ids.has(b));
    return { nodes, edges };
  }, [data, showTests]);

  const laid = useMemo(
    () => (visible.nodes.length ? layout(visible.nodes, visible.edges) : null),
    [visible],
  );

  const fit = useCallback((all = false) => {
    const el = canvasRef.current;
    if (!el || !laid) {
      return;
    }
    const { width: cw, height: ch } = el.getBoundingClientRect();
    const k = Math.min(1, (cw - 32) / laid.width, (ch - 32) / laid.height);
    const target = focus ? laid.nodes.find((n) => n.id === focus) : null;
    // Fit everything when it fits; otherwise center on the focus node.
    if (target && !all && k < 0.6) {
      setView({
        k: 0.8,
        x: cw / 2 - (target.x + NODE_W / 2) * 0.8,
        y: ch / 2 - (target.y + NODE_H / 2) * 0.8,
      });
      return;
    }
    setView({
      k,
      x: (cw - laid.width * k) / 2,
      y: (ch - laid.height * k) / 2,
    });
  }, [laid, focus]);

  useEffect(() => {
    fit(false);
  }, [fit]);

  const zoomAt = useCallback((factor, cx, cy) => {
    setView((v) => {
      const k = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.k * factor));
      const ratio = k / v.k;
      return { k, x: cx - (cx - v.x) * ratio, y: cy - (cy - v.y) * ratio };
    });
  }, []);

  // Wheel needs a non-passive listener so we can stop the page from zooming
  // or scrolling while the reader zooms the graph.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) {
      return undefined;
    }
    const onWheel = (e) => {
      if (!(e.metaKey || e.ctrlKey)) {
        return;
      }
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      // Clamp so one mouse-wheel notch is a gentle step; pinch deltas are
      // already small.
      const delta = Math.max(-40, Math.min(40, e.deltaY));
      zoomAt(Math.exp(-delta * 0.005), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  if (!data || !laid) {
    return null;
  }

  const byId = new Map(laid.nodes.map((n) => [n.id, n]));
  const active = selected && byId.has(selected) ? related(selected, visible.edges) : null;

  const onPointerDown = (e) => {
    if (e.target.closest("button")) {
      return;
    }
    dragRef.current = { x: e.clientX, y: e.clientY, moved: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) {
      return;
    }
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 3) {
      d.moved = true;
    }
    d.x = e.clientX;
    d.y = e.clientY;
    setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  };
  const onPointerUp = () => {
    // Keep `moved` around for the click that follows a drag.
    setTimeout(() => {
      dragRef.current = null;
    }, 0);
  };

  const center = () => {
    const rect = canvasRef.current.getBoundingClientRect();
    return [rect.width / 2, rect.height / 2];
  };

  return (
    <>
      <div className={styles.card} data-md-hide="true">
        <div className={styles.header}>
          <span className={styles.title}>Lineage</span>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={showTests}
              onChange={(e) => setShowTests(e.target.checked)}
            />
            Show tests
          </label>
        </div>
        <div
          ref={canvasRef}
          className={styles.canvas}
          style={{ height }}
          role="img"
          aria-label={title}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <svg className={styles.svg} width="100%" height="100%">
            <defs>
              <marker
                id="lineage-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" className={styles.arrowHead} />
              </marker>
            </defs>
            <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
              {visible.edges.map(([from, to]) => {
                const a = byId.get(from);
                const b = byId.get(to);
                const dim = active && !(active.has(from) && active.has(to));
                return (
                  <path
                    key={`${from}->${to}`}
                    d={edgePath(a, b)}
                    className={`${styles.edge} ${dim ? styles.dim : ""}`}
                    markerEnd="url(#lineage-arrow)"
                  />
                );
              })}
              {laid.nodes.map((n) => {
                const dim = active && !active.has(n.id);
                const isFocus = n.id === focus;
                const isSel = n.id === selected;
                return (
                  <g
                    key={n.id}
                    transform={`translate(${n.x} ${n.y})`}
                    className={`${styles.node} ${dim ? styles.dim : ""}`}
                    onClick={() => {
                      if (dragRef.current?.moved) {
                        return;
                      }
                      setSelected(isSel ? null : n.id);
                    }}
                  >
                    <rect
                      width={NODE_W}
                      height={NODE_H}
                      rx="6"
                      className={`${styles.box} ${isFocus ? styles.focus : ""} ${isSel ? styles.selected : ""}`}
                    />
                    <rect
                      x="8"
                      y="8"
                      width="36"
                      height="28"
                      rx="5"
                      className={styles[`badge_${n.type}`]}
                    />
                    <text x="26" y="26" className={styles.badgeText} textAnchor="middle">
                      {BADGES[n.type]}
                    </text>
                    <text x="54" y="26" className={styles.label}>
                      {n.label ?? n.id}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div className={styles.controls}>
            <button type="button" onClick={() => zoomAt(1.25, ...center())} aria-label="Zoom in">
              +
            </button>
            <button type="button" onClick={() => zoomAt(0.8, ...center())} aria-label="Zoom out">
              &minus;
            </button>
            <button type="button" onClick={() => fit(true)}>
              Reset
            </button>
          </div>
        </div>
        <div className={styles.footer}>
          Drag to pan. Hold ⌘ or Ctrl and scroll to zoom. Select a model to trace its lineage.
        </div>
      </div>

      <div hidden data-md-only="true">
        <p>Lineage (each node, then what it depends on):</p>
        <ul>
          {data.nodes
            .filter((n) => n.type !== "test")
            .map((n) => {
              const deps = data.edges
                .filter(([, to]) => to === n.id)
                .map(([from]) => from);
              return (
                <li key={n.id}>
                  {n.label ?? n.id}
                  {deps.length ? `: depends on ${deps.join(", ")}` : ""}
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
