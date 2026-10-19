'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Architecture } from '@/lib/content/portfolio';
import { EASE } from './fx';

const COL_W = 210;
const NODE_W = 172;
const NODE_H = 52;
const GAP_Y = 18;
const PAD_X = 20;
const PAD_Y = 44;

/** Split a label into at most two lines at a word boundary. */
function wrap(label: string, max = 19): string[] {
  if (label.length <= max) return [label];
  const words = label.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + ' ' + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

/**
 * Interactive, abstract architecture map. Hover, focus or tap a node to trace its connections;
 * the panel below explains it. Deliberately conceptual — no product UI, endpoints or internals.
 */
export default function ArchitectureDiagram({ arch, accent, title = 'Architecture overview' }: { arch: Architecture; accent: string; title?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const shown = useInView(box, { once: true, margin: '-10% 0px' });

  const layout = useMemo(() => {
    const perLayer = arch.layers.map((_, li) => arch.nodes.filter((n) => n.layer === li));
    const rows = Math.max(...perLayer.map((l) => l.length));
    const H = PAD_Y + rows * NODE_H + (rows - 1) * GAP_Y + 16;
    const W = PAD_X * 2 + arch.layers.length * COL_W - (COL_W - NODE_W);
    const pos: Record<string, { x: number; y: number }> = {};
    perLayer.forEach((nodes, li) => {
      const colH = nodes.length * NODE_H + (nodes.length - 1) * GAP_Y;
      const top = PAD_Y + (rows * NODE_H + (rows - 1) * GAP_Y - colH) / 2;
      nodes.forEach((n, i) => {
        pos[n.id] = { x: PAD_X + li * COL_W, y: top + i * (NODE_H + GAP_Y) };
      });
    });
    return { W, H, pos };
  }, [arch]);

  const neighbours = useMemo(() => {
    const m: Record<string, Set<string>> = {};
    for (const n of arch.nodes) m[n.id] = new Set();
    for (const [a, b] of arch.edges) {
      m[a]?.add(b);
      m[b]?.add(a);
    }
    return m;
  }, [arch]);

  const lit = (id: string) => !active || id === active || neighbours[active]?.has(id);
  const edgeLit = (a: string, b: string) => !active || a === active || b === active;
  const node = active ? arch.nodes.find((n) => n.id === active) : null;

  return (
    <div ref={box} className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/60 p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-signal">{title}</p>
        <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-smoke">
          Abstract · no product UI or internals
        </span>
      </div>

      <div data-lenis-prevent className="rail overflow-x-auto pb-2">
        <svg
          viewBox={`0 0 ${layout.W} ${layout.H}`}
          style={{ minWidth: Math.min(layout.W, 860) }}
          className="block h-auto w-full"
          role="group"
          aria-label={`${title}. Select a component to see how it connects.`}
          onClick={() => setActive(null)}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') setActive(null);
          }}
        >
          {arch.layers.map((l, li) => (
            <text
              key={l}
              x={PAD_X + li * COL_W}
              y={22}
              fontSize="10"
              fontWeight="700"
              letterSpacing="2.2"
              fill="#5c6578"
              style={{ textTransform: 'uppercase' }}
            >
              {l}
            </text>
          ))}

          {arch.edges.map(([a, b], i) => {
            const pa = layout.pos[a];
            const pb = layout.pos[b];
            if (!pa || !pb) return null;
            const forward = pa.x <= pb.x;
            const x1 = forward ? pa.x + NODE_W : pa.x;
            const x2 = forward ? pb.x : pb.x + NODE_W;
            const y1 = pa.y + NODE_H / 2;
            const y2 = pb.y + NODE_H / 2;
            const mid = (x1 + x2) / 2;
            const on = edgeLit(a, b);
            const hot = active !== null && on;
            return (
              <motion.path
                key={`${a}-${b}`}
                d={`M${x1} ${y1} C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`}
                fill="none"
                stroke={accent}
                strokeWidth={hot ? 2 : 1.2}
                strokeLinecap="round"
                className={hot ? 'arch-flow' : undefined}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={shown ? { pathLength: 1, opacity: on ? (hot ? 0.95 : 0.35) : 0.06 } : { pathLength: 0, opacity: 0 }}
                transition={{ pathLength: { duration: 0.9, ease: EASE, delay: 0.1 + i * 0.025 }, opacity: { duration: 0.3 } }}
              />
            );
          })}

          {arch.nodes.map((n, i) => {
            const p = layout.pos[n.id];
            const isActive = active === n.id;
            const lines = wrap(n.label);
            return (
              <motion.g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-label={`${n.label}: ${n.detail}`}
                aria-pressed={isActive}
                style={{ cursor: 'pointer', outline: 'none' }}
                initial={{ opacity: 0, y: 8 }}
                animate={shown ? { opacity: lit(n.id) ? 1 : 0.28, y: 0 } : { opacity: 0, y: 8 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(n.id)}
                onFocus={() => setActive(n.id)}
                onBlur={() => setActive(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(n.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActive(n.id);
                  }
                }}
              >
                <rect
                  x={p.x}
                  y={p.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="12"
                  fill={isActive ? `${accent}22` : '#0c1220'}
                  stroke={isActive ? accent : 'rgba(232,238,248,0.14)'}
                  strokeWidth={isActive ? 1.6 : 1}
                  style={{ filter: isActive ? `drop-shadow(0 0 10px ${accent}66)` : undefined, transition: 'fill 0.25s, stroke 0.25s' }}
                />
                <rect x={p.x} y={p.y + 10} width="3" height={NODE_H - 20} rx="1.5" fill={accent} opacity={isActive ? 1 : 0.55} />
                {lines.map((ln, li) => (
                  <text
                    key={ln}
                    x={p.x + 16}
                    y={p.y + NODE_H / 2 + (li - (lines.length - 1) / 2) * 15 + 4.5}
                    fontSize="12.5"
                    fontWeight={isActive ? 700 : 600}
                    fill="#e8eef8"
                  >
                    {ln}
                  </text>
                ))}
              </motion.g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 min-h-[4.25rem] rounded-xl border border-white/10 bg-ink-2/70 px-4 py-3 text-sm leading-relaxed" aria-live="polite">
        {node ? (
          <>
            <p className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-bone">{node.label}</span>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-smoke">
                {arch.layers[node.layer]}
              </span>
            </p>
            <p className="mt-1 text-mist">{node.detail}</p>
            <p className="mt-1.5 text-xs text-smoke">
              Connects to: {Array.from(neighbours[node.id] ?? []).map((id) => arch.nodes.find((x) => x.id === id)?.label).filter(Boolean).join(' · ') || '—'}
            </p>
          </>
        ) : (
          <p className="text-mist">Hover, focus or tap a component to trace how it connects.</p>
        )}
      </div>
    </div>
  );
}
