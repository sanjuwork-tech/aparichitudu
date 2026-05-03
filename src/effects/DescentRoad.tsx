import { motion, MotionValue, useTransform, useMotionTemplate } from "framer-motion";

interface Props {
  scrollProgress: MotionValue<number>;
}

const HORIZON_Y = 32;
const BOTTOM_Y = 56.25;
const ROAD_SPAN = BOTTOM_Y - HORIZON_Y;

const TREE_PATH = "M0,0 L0,-1 M0,-0.43 L-0.33,-0.87 M0,-0.53 L0.27,-0.93 M0,-0.30 L-0.22,-0.58 M0,-0.63 L-0.14,-0.85 M0,-0.76 L0.11,-0.95";

const TREES = [
  { x: 39.5, y: HORIZON_Y + 0.8, h: 2.2,  flip: false },
  { x: 29,   y: HORIZON_Y + 4.5, h: 4.8,  flip: false },
  { x: 11,   y: HORIZON_Y + 12,  h: 9.5,  flip: false },
  { x: 60.5, y: HORIZON_Y + 0.8, h: 2.2,  flip: true  },
  { x: 71,   y: HORIZON_Y + 4.5, h: 4.8,  flip: true  },
  { x: 89,   y: HORIZON_Y + 12,  h: 9.5,  flip: true  },
];

const CROWS = [
  { x: 33, y: 28, s: 0.7 },
  { x: 44, y: 27, s: 0.5 },
  { x: 63, y: 29, s: 0.65 },
  { x: 22, y: 26, s: 0.5 },
];

const DASH_COUNT = 8;
const DASH_SPACING = ROAD_SPAN / DASH_COUNT;

const CITY_PATH = `
  M-5.5,0 L-5.5,-4 L-5,-4 L-5,-8 L-4.6,-8 L-4.6,-4 L-4,-4 L-4,-6 L-3.5,-6 L-3.5,-4
  L-2.5,-4 L-2.5,-10 L-2,-13 L-1.5,-10 L-1.5,-4 L-0.8,-4 L-0.8,-7 L-0.4,-7 L-0.4,-4
  L0,-4 L0,-11 L0.5,-15 L1,-11 L1,-4 L1.6,-4 L1.6,-7 L2,-7 L2,-4
  L3,-4 L3,-10 L3.5,-13 L4,-10 L4,-4 L4.5,-4 L4.5,-6 L5,-6 L5,-4
  L5.5,-4 L5.5,-8 L6,-8 L6,-4 L6.5,-4 L6.5,0 Z
`;

export function DescentRoad({ scrollProgress }: Props) {
  const cityScale   = useTransform(scrollProgress, [0, 1], [0.55, 2.8]);
  const cityOpacity = useTransform(scrollProgress, [0, 0.15, 1], [0.25, 0.5, 1.0]);
  const glowR       = useTransform(scrollProgress, [0, 1], [5, 18]);
  const glowOpacity = useTransform(scrollProgress, [0, 1], [0.15, 0.65]);
  const sunOpacity  = useTransform(scrollProgress, [0, 0.5, 1], [0.65, 0.25, 0.05]);
  const hazeOpacity = useTransform(scrollProgress, [0, 1], [0.08, 0.38]);
  const overallOp   = useTransform(scrollProgress, [0, 0.06, 0.88, 1], [0, 1, 1, 0.28]);

  const cityTransform  = useMotionTemplate`translate(50, ${HORIZON_Y}) scale(${cityScale})`;
  const cityOpTemplate = useMotionTemplate`${cityOpacity}`;

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: overallOp, zIndex: 2 }}
    >
      <svg
        viewBox={`0 0 100 ${BOTTOM_Y}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="dr-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(6,2,1,1)" />
            <stop offset="55%"  stopColor="rgba(38,8,4,0.92)" />
            <stop offset="100%" stopColor="rgba(72,14,6,0.88)" />
          </linearGradient>
          <linearGradient id="dr-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(52,12,5,0.92)" />
            <stop offset="100%" stopColor="rgba(18,5,2,0.97)" />
          </linearGradient>
          <linearGradient id="dr-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="rgba(16,7,4,0.92)" />
            <stop offset="100%" stopColor="rgba(28,11,6,0.97)" />
          </linearGradient>
          <radialGradient id="dr-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="rgba(230,70,15,0.55)" />
            <stop offset="60%"  stopColor="rgba(180,40,8,0.22)" />
            <stop offset="100%" stopColor="rgba(150,20,4,0)" />
          </radialGradient>
          <radialGradient id="dr-city-glow" cx="50%" cy="0%" r="100%">
            <stop offset="0%"   stopColor="rgba(255,60,10,0.9)" />
            <stop offset="35%"  stopColor="rgba(200,35,8,0.5)" />
            <stop offset="100%" stopColor="rgba(140,15,3,0)" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="100" height={HORIZON_Y} fill="url(#dr-sky)" />

        {/* Burning sun — upper-left, dims as you approach hell */}
        <motion.g style={{ opacity: sunOpacity }}>
          <ellipse cx="20" cy="13" rx="7" ry="7" fill="url(#dr-sun)" />
          <circle  cx="20" cy="13" r="3"   fill="rgba(220,65,12,0.65)" />
          <circle  cx="20" cy="13" r="1.8" fill="rgba(255,130,50,0.55)" />
        </motion.g>

        {/* Ground plane */}
        <rect x="0" y={HORIZON_Y} width="100" height={ROAD_SPAN} fill="url(#dr-ground)" />

        {/* Road trapezoid */}
        <polygon
          points={`44,${HORIZON_Y} 56,${HORIZON_Y} 116,${BOTTOM_Y} -16,${BOTTOM_Y}`}
          fill="url(#dr-road)"
        />

        {/* Road edge cracks / wear lines */}
        <line x1="44" y1={HORIZON_Y} x2="-16" y2={BOTTOM_Y}
          stroke="rgba(100,40,15,0.35)" strokeWidth="0.25" />
        <line x1="56" y1={HORIZON_Y} x2="116" y2={BOTTOM_Y}
          stroke="rgba(100,40,15,0.35)" strokeWidth="0.25" />

        {/* Animated road center dashes */}
        <motion.g
          animate={{ y: [0, DASH_SPACING] }}
          transition={{ duration: 0.72, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(DASH_COUNT + 2)].map((_, i) => {
            const y0 = HORIZON_Y + (i - 1) * DASH_SPACING;
            const t  = Math.max(0, Math.min(1, (y0 - HORIZON_Y) / ROAD_SPAN));
            const dashH   = 0.35 + t * 1.5;
            const strokeW = 0.07 + t * 0.32;
            return (
              <line key={i}
                x1="50" y1={y0}
                x2="50" y2={y0 + dashH}
                stroke={`rgba(195,160,90,${0.18 + t * 0.52})`}
                strokeWidth={strokeW}
              />
            );
          })}
        </motion.g>

        {/* Dead trees silhouettes */}
        {TREES.map((tree, i) => (
          <g key={i}
            transform={`translate(${tree.x}, ${tree.y}) scale(${tree.flip ? -tree.h : tree.h}, ${tree.h})`}
          >
            <path
              d={TREE_PATH}
              stroke="rgba(15,6,3,0.9)"
              strokeWidth={0.038}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Crows near trees */}
        {CROWS.map((c, i) => (
          <g key={i} transform={`translate(${c.x}, ${c.y}) scale(${c.s})`}>
            <path d="M-1.2,0 Q-0.6,-0.7 0,0 Q0.6,-0.7 1.2,0"
              stroke="rgba(12,5,2,0.75)" strokeWidth="0.2" fill="none"
            />
          </g>
        ))}

        {/* Horizon haze */}
        <motion.rect
          x="0" y={HORIZON_Y - 4} width="100" height="9"
          fill="rgba(90,22,8,0.28)"
          style={{ opacity: hazeOpacity }}
        />

        {/* Yamapuri city glow (expands as you approach) */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <motion.ellipse
          cx="50" cy={HORIZON_Y}
          style={{ opacity: glowOpacity }}
          rx={glowR as unknown as number}
          ry={glowR as unknown as number}
          fill="url(#dr-city-glow)"
        />

        {/* Yamapuri city silhouette */}
        <motion.g
          transform={cityTransform as unknown as string}
          style={{ opacity: cityOpTemplate as unknown as number }}
        >
          <path
            d={CITY_PATH}
            fill="rgba(6,2,1,0.95)"
            stroke="rgba(200,55,12,0.45)"
            strokeWidth="0.15"
          />
          {/* Glowing tower windows */}
          {[[-0.5, -12.5], [0.5, -14.5], [-2, -10.5]].map(([wx, wy], wi) => (
            <circle key={wi} cx={wx} cy={wy} r="0.28" fill="rgba(255,70,10,0.9)" />
          ))}
          {/* Gate arch at city base */}
          <path d="M-1.5,0 Q-1.5,-1.5 0,-1.5 Q1.5,-1.5 1.5,0"
            fill="rgba(255,90,15,0.18)" stroke="rgba(200,55,12,0.35)" strokeWidth="0.15"
          />
        </motion.g>

        {/* Road dust motes drifting upward */}
        <motion.g
          animate={{ y: [0, -3.5], opacity: [0.35, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", repeatDelay: 0.4 }}
        >
          {[48.5, 50.5, 49, 51.5, 50, 47.5, 52].map((x, i) => (
            <circle key={i}
              cx={x}
              cy={HORIZON_Y + 5 + i * 3}
              r="0.18"
              fill={`rgba(175,110,50,${0.25 + i * 0.04})`}
            />
          ))}
        </motion.g>

        {/* Left and right ground patches (bone-dry cracked earth texture lines) */}
        {[-8, -4, 4, 8, -12, 12].map((ox, i) => (
          <line key={i}
            x1={50 + ox * 2.5} y1={BOTTOM_Y - 4 - i * 1.5}
            x2={50 + ox * 3.5} y2={BOTTOM_Y - 2 - i * 1.2}
            stroke="rgba(80,30,10,0.22)" strokeWidth="0.2"
          />
        ))}
      </svg>
    </motion.div>
  );
}
