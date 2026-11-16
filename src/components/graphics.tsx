import { useId } from 'react';
import type { BodyType, DocType, Zone } from '../lib/types';
import { fmtDateShort, fmtTime } from '../lib/utils';

/* ---------------------------------------------------------------
   Brand mark — carbon "C" with a workshop sweep
   --------------------------------------------------------------- */
export function BrandMark({ size = 38 }: { size?: number }) {
  return (
    <span className="brand-mark" style={{ width: size, height: size, flexBasis: size }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none" aria-hidden>
        <path d="M23.5 8.6A10 10 0 1 0 23.5 23.4" stroke="#FF6B12" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M25.6 5.6 20.2 11l5.4 5.4" stroke="#FFB020" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23.2" cy="16" r="1.5" fill="#FF6B12" />
      </svg>
    </span>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="brand-text">
      <b>
        CARBON<span>TRACK</span>
      </b>
      {!compact && <small>Carbon Department</small>}
    </span>
  );
}

/* ---------------------------------------------------------------
   Vehicle silhouettes — studio side profiles, no external images
   --------------------------------------------------------------- */
interface Silhouette {
  body: string;
  windows: string[];
  detail: string;
  wheels: [number, number];
  r: number;
  wheelY: number;
  head: [number, number];
  tail: [number, number];
  rail?: string;
}

const SILHOUETTES: Record<'sedan' | 'suv' | 'pickup' | 'van' | 'coupe' | 'hatch', Silhouette> = {
  sedan: {
    body: 'M6 69 C6 61 9 56 20 53 L48 48 C57 36 72 29 92 27 L122 28 C146 29 166 36 182 46 L202 51 C212 54 215 59 215 65 L215 69 Z',
    windows: [
      'M56 47 L70 35 C75 31 81 29 88 29 L96 29 L96 47 Z',
      'M104 29 L120 30 C136 32 151 37 162 46 L104 46 Z',
    ],
    detail: 'M100 30 L100 65 M56 48 L188 55',
    wheels: [60, 170],
    r: 14,
    wheelY: 69,
    head: [197, 52],
    tail: [7, 54],
  },
  suv: {
    body: 'M8 68 C8 57 12 49 26 45 L54 40 C64 27 80 20 102 19 L140 20 C166 22 188 31 200 44 L208 49 C214 53 216 58 216 64 L216 68 Z',
    windows: [
      'M62 39 L76 29 C82 25 90 24 100 24 L100 39 Z',
      'M108 24 L138 25 C152 27 164 32 174 39 L108 39 Z',
    ],
    detail: 'M104 25 L104 63 M60 41 L190 48',
    wheels: [62, 180],
    r: 15,
    wheelY: 68,
    head: [199, 45],
    tail: [9, 48],
    rail: 'M66 19 L170 20',
  },
  pickup: {
    body: 'M8 69 L8 52 L78 49 L78 31 C78 25 84 22 94 21 L132 21 C150 23 160 30 168 39 L176 49 L212 50 C219 53 221 59 221 65 L221 69 Z',
    windows: [
      'M86 47 L86 28 C86 25 89 24 93 24 L112 24 L112 47 Z',
      'M119 24 L131 24 C142 25 149 30 155 37 L160 47 L119 47 Z',
    ],
    detail: 'M116 25 L116 64 M78 50 L172 50 M14 52 L72 52',
    wheels: [64, 186],
    r: 14.5,
    wheelY: 69,
    head: [203, 51],
    tail: [9, 53],
  },
  van: {
    body: 'M8 69 C8 59 11 51 22 48 L30 47 L38 28 C42 23 48 20 58 20 L150 21 C172 23 190 32 201 46 L207 51 C213 55 215 61 215 67 L215 69 Z',
    windows: [
      'M40 46 L50 30 C52 27 55 26 59 26 L78 26 L78 46 Z',
      'M86 26 L122 26 L122 46 L86 46 Z',
      'M130 26 L150 27 C160 29 168 34 174 41 L180 46 L130 46 Z',
    ],
    detail: 'M48 28 L48 66 M84 27 L84 66 M128 27 L128 66',
    wheels: [58, 178],
    r: 15,
    wheelY: 68,
    head: [200, 47],
    tail: [9, 50],
  },
  coupe: {
    body: 'M6 69 C6 62 10 58 22 55 L50 50 C62 40 80 35 100 35 L126 36 C150 38 172 45 190 53 L208 57 C214 60 216 64 216 68 L216 69 Z',
    windows: [
      'M58 49 L74 41 C80 38 86 37 94 37 L102 37 L102 49 Z',
      'M109 37 L125 38 C140 40 153 45 163 51 L109 51 Z',
    ],
    detail: 'M106 38 L106 66 M58 50 L184 56',
    wheels: [60, 172],
    r: 14,
    wheelY: 69,
    head: [199, 56],
    tail: [7, 57],
  },
  hatch: {
    body: 'M10 69 C8 62 8 56 14 52 L34 46 C44 34 58 29 76 28 L112 29 C132 31 148 37 160 45 L188 49 C202 52 208 58 208 65 L208 69 Z',
    windows: [
      'M42 46 L56 36 C62 32 68 31 76 31 L84 31 L84 46 Z',
      'M91 31 L111 32 L111 46 L91 46 Z',
      'M118 33 L127 36 L136 45 L118 45 Z',
    ],
    detail: 'M88 32 L88 66 M40 47 L166 52',
    wheels: [56, 166],
    r: 14,
    wheelY: 68,
    head: [191, 50],
    tail: [12, 53],
  },
};

const BODY_MAP: Record<BodyType, keyof typeof SILHOUETTES> = {
  Sedan: 'sedan',
  SUV: 'suv',
  Pickup: 'pickup',
  Van: 'van',
  Hatchback: 'hatch',
  MPV: 'van',
  Coupe: 'coupe',
};

const VARIANTS = [
  { paint: ['#78858e', '#333d44', '#111719'], rim: '#ccd6db', light: '#ffb020' },
  { paint: ['#7a665a', '#332a25', '#120e0c'], rim: '#d3b99f', light: '#ff8a3c' },
  { paint: ['#63798a', '#2a363f', '#0d1317'], rim: '#b4cfe0', light: '#ffd166' },
  { paint: ['#6d6678', '#2e2935', '#100e14'], rim: '#cdc2dd', light: '#ffb020' },
  { paint: ['#64776d', '#2a332e', '#0d1210'], rim: '#c0d9cd', light: '#ffcf7a' },
];

export function CarArt({ body = 'Sedan', variant = 0, className }: { body?: BodyType; variant?: number; className?: string }) {
  const uid = useId().replace(/[:]/g, '');
  const shape = SILHOUETTES[BODY_MAP[body]];
  const v = VARIANTS[Math.abs(variant) % VARIANTS.length];
  const [cx1, cx2] = shape.wheels;

  return (
    <svg viewBox="0 0 224 96" className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`paint-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={v.paint[0]} />
          <stop offset="42%" stopColor={v.paint[1]} />
          <stop offset="100%" stopColor={v.paint[2]} />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#33474f" />
          <stop offset="45%" stopColor="#122126" />
          <stop offset="100%" stopColor="#070d10" />
        </linearGradient>
        <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={v.rim} />
          <stop offset="100%" stopColor="#4a555c" />
        </linearGradient>
        <radialGradient id={`head-${uid}`}>
          <stop offset="0%" stopColor={v.light} stopOpacity="0.85" />
          <stop offset="100%" stopColor={v.light} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.17" />
          <stop offset="48%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`shadow-${uid}`}>
          <stop offset="0%" stopColor="#000" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="112" cy="86" rx="100" ry="8" fill={`url(#shadow-${uid})`} />
      <path d={shape.body} fill={`url(#paint-${uid})`} stroke="#9fb0ba" strokeOpacity="0.42" strokeWidth="0.9" />
      <path d={shape.body} fill={`url(#shine-${uid})`} />

      {shape.rail && <path d={shape.rail} stroke="#b9c6cd" strokeWidth="1.7" strokeLinecap="round" opacity="0.35" />}
      {shape.windows.map((w, i) => (
        <g key={i}>
          <path d={w} fill={`url(#glass-${uid})`} stroke="#a9b9c2" strokeOpacity="0.34" strokeWidth="0.7" />
          <path d={w} fill="none" stroke="#d9e4e9" strokeOpacity="0.12" strokeWidth="1.6" />
        </g>
      ))}

      <path d={shape.detail} stroke="#b5c3cb" strokeOpacity="0.26" strokeWidth="0.8" fill="none" />
      <path d="M96 51 L112 51" stroke="#d5dee3" strokeOpacity="0.5" strokeWidth="1.7" strokeLinecap="round" />

      {/* lamps */}
      <ellipse cx={shape.head[0] + 3} cy={shape.head[1] + 3} rx="18" ry="9" fill={`url(#head-${uid})`} opacity="0.6" />
      <path
        d={`M${shape.head[0]} ${shape.head[1]} l13 2 l0 6 l-14 -2 Z`}
        fill={v.light}
        opacity="0.95"
      />
      <path d={`M${shape.tail[0]} ${shape.tail[1]} l9 0 l0 7 l-9 0 Z`} fill="#ff4d4d" opacity="0.85" />

      {/* wheels */}
      {[cx1, cx2].map((cx) => (
        <g key={cx}>
          <path
            d={`M${cx - shape.r - 3} ${shape.wheelY} A ${shape.r + 3} ${shape.r + 3} 0 0 1 ${cx + shape.r + 3} ${shape.wheelY}`}
            fill="none"
            stroke="#aebbc3"
            strokeOpacity="0.3"
            strokeWidth="1.1"
          />
          <circle cx={cx} cy={shape.wheelY} r={shape.r + 1.5} fill="#070a0c" />
          <circle cx={cx} cy={shape.wheelY} r={shape.r} fill="#151b1f" stroke="#4b585f" strokeWidth="0.9" />
          <circle cx={cx} cy={shape.wheelY} r={shape.r * 0.6} fill={`url(#rim-${uid})`} />
          <circle cx={cx} cy={shape.wheelY} r={shape.r * 0.2} fill="#1d2429" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line
              key={a}
              x1={cx}
              y1={shape.wheelY}
              x2={cx + Math.cos((a * Math.PI) / 180) * shape.r * 0.52}
              y2={shape.wheelY + Math.sin((a * Math.PI) / 180) * shape.r * 0.52}
              stroke="#39434a"
              strokeWidth="1.5"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------
   Inspection photo — simulated capture with HUD + damage target
   --------------------------------------------------------------- */
const TONES = [
  'radial-gradient(circle at 58% 32%, #28343b, #0b1013 70%)',
  'radial-gradient(circle at 45% 28%, #2b2a2d, #0c0b0d 72%)',
  'radial-gradient(circle at 62% 30%, #26322d, #0a0f0d 72%)',
  'radial-gradient(circle at 40% 34%, #2e2b26, #100e0b 72%)',
  'radial-gradient(circle at 55% 26%, #242c39, #0a0d12 72%)',
];

export function InspectionPhoto({
  plate,
  zone,
  takenAt,
  tone = 0,
  body = 'Sedan',
  label,
  hasDamage,
  spot,
  onClick,
  compact,
  index = 0,
}: {
  plate: string;
  zone: Zone;
  takenAt: string;
  tone?: number;
  body?: BodyType;
  label?: string;
  hasDamage?: boolean;
  spot?: { x: number; y: number };
  onClick?: () => void;
  compact?: boolean;
  index?: number;
}) {
  return (
    <div
      className="photo-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="photo-frame" style={{ background: TONES[tone % TONES.length] }}>
        <div className="grid-lines" />
        <div className="hud">
          <span className="rec">
            <i /> PRE-INSPECTION
          </span>
          <span>CAM {String(index + 1).padStart(2, '0')}</span>
        </div>
        <CarArt body={body} variant={tone} />
        {hasDamage && spot && <span className="photo-damage" style={{ left: `${spot.x}%`, top: `${spot.y}%` }} />}
        {hasDamage && <span className="photo-badge">damage</span>}
        <div className="hud-bot">
          <span>{plate}</span>
          <span>
            {fmtDateShort(takenAt)} {fmtTime(takenAt)}
          </span>
        </div>
      </div>
      {!compact && (
        <div className="photo-meta">
          <span style={{ width: 5, height: 5, borderRadius: 99, background: hasDamage ? 'var(--amber)' : 'var(--teal)', flex: '0 0 5px' }} />
          <div style={{ minWidth: 0 }}>
            <b>{label ?? `${zone} view`}</b>
            <span>{zone}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   Document thumbnail — scanned page representation
   --------------------------------------------------------------- */
const DOC_ACCENT: Record<DocType, string> = {
  'Job Order': '#ff6b12',
  Invoice: '#2f80ed',
  Receipt: '#1f9d76',
  'Inspection Sheet': '#b07cff',
  'OR / CR': '#8a6d3b',
  Insurance: '#c0392b',
  'Photo Sheet': '#0f7c8c',
};

export function DocThumb({ type, pages = 1 }: { type: DocType; pages?: number }) {
  const uid = useId().replace(/[:]/g, '');
  const accent = DOC_ACCENT[type];
  return (
    <span className="doc-thumb" title={`${type} · ${pages} page${pages > 1 ? 's' : ''}`}>
      <svg viewBox="0 0 44 56" aria-hidden>
        <rect width="44" height="56" fill="#f4f4ee" />
        <rect width="44" height="10" fill={accent} />
        <text x="4" y="7" fontSize="3.6" fontFamily="Barlow Condensed, sans-serif" fill="#fff" letterSpacing="0.3">
          {type.toUpperCase().slice(0, 12)}
        </text>
        <rect x="4" y="14" width="22" height="2" fill="#2b3136" />
        <rect x="4" y="18" width="34" height="1.4" fill="#a7adb0" />
        <rect x="4" y="21" width="30" height="1.4" fill="#a7adb0" />
        <rect x="4" y="27" width="36" height="1" fill="#d4d6d0" />
        <rect x="4" y="30" width="36" height="1" fill="#d4d6d0" />
        <rect x="4" y="33" width="24" height="1" fill="#d4d6d0" />
        <rect x="4" y="39" width="15" height="1" fill="#d4d6d0" />
        <rect x="25" y="38" width="15" height="4" fill={accent} opacity="0.18" />
        <rect x="4" y="48" width="24" height="1.2" fill="#8f979b" />
        <rect x="4" y="51" width="16" height="1" fill="#c2c6c1" />
        <defs>
          <linearGradient id={`shine-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="44" height="56" fill={`url(#shine-${uid})`} />
      </svg>
    </span>
  );
}

/* ---------------------------------------------------------------
   Small inline car icon used in dense tables
   --------------------------------------------------------------- */
export function CarChip({ body, variant = 0 }: { body?: BodyType; variant?: number }) {
  return (
    <span className="veh-thumb sm">
      <CarArt body={body ?? 'Sedan'} variant={variant} />
    </span>
  );
}
