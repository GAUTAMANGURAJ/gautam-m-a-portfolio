'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { projects, type Skill } from '@/lib/content/portfolio';
import { useMedia } from '@/hooks/useMedia';
import { EASE } from './fx';

const shortTitle = (t: string) => t.replace(/ (Platform|System|Library|Website|Studio)$/, '');

const STARS = Array.from({ length: 28 }, (_, i) => ({
  x: (i * 137.5) % 100,
  y: (i * 61.8 + 13) % 100,
  r: 0.6 + ((i * 7) % 5) * 0.25,
  d: (i % 7) * 0.6,
}));

type Focus = { kind: 'skill' | 'project'; id: string } | null;

/**
 * Bipartite constellation: the active category's skills on the left, projects on the right,
 * glowing links where a skill is evidenced in a project. Hover or tap a node to light its links.
 */
export default function SkillConstellation({ skills, hue }: { skills: Skill[]; hue: string }) {
  const wide = useMedia('(min-width: 640px)', true);
  const W = wide ? 720 : 360;
  const H = 470;
  const padY = 34;
  const [focus, setFocus] = useState<Focus>(null);

  const skillNodes = skills.map((s, i) => ({
    ...s,
    x: W * 0.36,
    y: padY + (i * (H - padY * 2)) / Math.max(skills.length - 1, 1),
  }));
  const projectNodes = projects.map((p, i) => ({
    id: p.id,
    title: p.title,
    accent: p.palette.accent,
    x: W * 0.68,
    y: padY + (i * (H - padY * 2)) / Math.max(projects.length - 1, 1),
  }));

  const links = useMemo(() => {
    const out: { s: string; p: string }[] = [];
    for (const sk of skills) for (const u of sk.uses) if (projects.some((p) => p.id === u.project)) out.push({ s: sk.name, p: u.project });
    return out;
  }, [skills]);

  const isLit = (l: { s: string; p: string }) =>
    !focus || (focus.kind === 'skill' ? l.s === focus.id : l.p === focus.id);
  const nodeLit = (kind: 'skill' | 'project', id: string) =>
    !focus ||
    (focus.kind === kind && focus.id === id) ||
    links.some((l) => (kind === 'skill' ? l.s === id && l.p === focus.id : l.p === id && l.s === focus.id));

  const focusedSkill = focus?.kind === 'skill' ? skills.find((s) => s.name === focus.id) : null;
  const toggle = (f: NonNullable<Focus>) => setFocus((cur) => (cur && cur.kind === f.kind && cur.id === f.id ? null : f));

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-ink-2/70 ring-1 ring-white/10">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          role="group"
          aria-label="Skills connected to the projects that use them"
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') setFocus(null);
          }}
        >
          {STARS.map((st, i) => (
            <circle
              key={i}
              cx={(st.x / 100) * W}
              cy={(st.y / 100) * H}
              r={st.r}
              fill="#e8eef8"
              style={{ animation: `twinkle ${3 + (i % 4)}s ease-in-out ${st.d}s infinite` }}
              opacity="0.3"
            />
          ))}

          {links.map((l, i) => {
            const a = skillNodes.find((n) => n.name === l.s)!;
            const b = projectNodes.find((n) => n.id === l.p)!;
            const mid = (a.x + b.x) / 2;
            const lit = isLit(l);
            return (
              <motion.path
                key={`${l.s}-${l.p}`}
                d={`M${a.x} ${a.y} C${mid} ${a.y} ${mid} ${b.y} ${b.x} ${b.y}`}
                fill="none"
                stroke={hue}
                strokeWidth={lit && focus ? 2 : 1.2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: lit ? (focus ? 0.95 : 0.4) : 0.06 }}
                transition={{ pathLength: { duration: 0.9, ease: EASE, delay: 0.15 + i * 0.03 }, opacity: { duration: 0.3 } }}
              />
            );
          })}

          {skillNodes.map((n, i) => {
            const lit = nodeLit('skill', n.name);
            const active = focus?.kind === 'skill' && focus.id === n.name;
            return (
              <motion.g
                key={n.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: lit ? 1 : 0.28, x: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.05 }}
                style={{ cursor: 'pointer' }}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setFocus({ kind: 'skill', id: n.name })}
                onClick={() => toggle({ kind: 'skill', id: n.name })}
              >
                <circle cx={n.x} cy={n.y} r="22" fill="transparent" />
                <circle cx={n.x} cy={n.y} r={active ? 9 : 6.5} fill={hue} style={{ filter: `drop-shadow(0 0 ${active ? 10 : 5}px ${hue})`, transition: 'r 0.3s' }} />
                <circle cx={n.x} cy={n.y} r={active ? 15 : 11} fill="none" stroke={hue} strokeOpacity="0.35" />
                <text x={n.x - 20} y={n.y + 4} textAnchor="end" fontSize={wide ? 14 : 12} fontWeight={active ? 700 : 500} fill={active ? '#e8eef8' : '#b4bdcf'}>
                  {n.name}
                </text>
              </motion.g>
            );
          })}

          {projectNodes.map((n, i) => {
            const lit = nodeLit('project', n.id);
            const active = focus?.kind === 'project' && focus.id === n.id;
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: lit ? 1 : 0.28, x: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.05 }}
                style={{ cursor: 'pointer' }}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setFocus({ kind: 'project', id: n.id })}
                onClick={() => toggle({ kind: 'project', id: n.id })}
              >
                <circle cx={n.x} cy={n.y} r="22" fill="transparent" />
                <rect x={n.x - 6} y={n.y - 6} width={12} height={12} rx="3" transform={`rotate(45 ${n.x} ${n.y})`} fill={n.accent} style={{ filter: `drop-shadow(0 0 ${active ? 10 : 4}px ${n.accent})` }} />
                <text x={n.x + 18} y={n.y + 4} fontSize={wide ? 13 : 11} fontWeight={active ? 700 : 500} fill={active ? '#e8eef8' : '#b4bdcf'}>
                  {shortTitle(n.title)}
                </text>
              </motion.g>
            );
          })}
        </svg>

        <p className="pointer-events-none absolute left-4 top-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke">Skills</p>
        <p className="pointer-events-none absolute right-4 top-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-smoke">Projects</p>
      </div>

      <p className="mt-3 min-h-[2.5rem] text-xs leading-relaxed text-mist" aria-live="polite">
        {focusedSkill
          ? focusedSkill.uses.length
            ? <><span className="font-semibold text-bone">{focusedSkill.name}</span> — {focusedSkill.uses.map((u) => u.how).join(' · ')}</>
            : <><span className="font-semibold text-bone">{focusedSkill.name}</span> — {focusedSkill.evidence ?? 'Growing'}</>
          : focus?.kind === 'project'
            ? <><span className="font-semibold text-bone">{projects.find((p) => p.id === focus.id)?.title}</span> — {links.filter((l) => l.p === focus.id).length} skills applied in this category</>
            : 'Hover or tap a node to trace which skills power which projects.'}
      </p>
    </div>
  );
}
