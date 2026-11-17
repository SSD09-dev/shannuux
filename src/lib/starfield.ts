/** Pure, browser-safe helpers for the cosmic starfield background. */

export const STAR_COLORS = ["#FFFFFF", "#BFD8FF", "#FFE4B5"] as const;
export const STAR_SIZE = { min: 0.6, max: 2 } as const;
export const STAR_OPACITY = { min: 0.25, max: 0.8 } as const;
export const SHOOTING_INTERVAL_MS = { min: 3000, max: 6000 } as const;
export const SHOOTING_TAIL_PX = { min: 120, max: 220 } as const;
export const SHOOTING_OPACITY = 0.75;
/** Brightness kept while a streak passes behind glass content (fraction of full). */
export const SHOOTING_BEHIND_CONTENT = 0.55;
export const PARALLAX_MAX_PX = 10;

export type Star = {
  /** Normalised position (0–1) so resizes rescale instead of regenerating. */
  x: number;
  y: number;
  /** Diameter in CSS px. */
  size: number;
  color: (typeof STAR_COLORS)[number];
  /** Resting brightness inside the STAR_OPACITY range. */
  base: number;
  /** Twinkle amplitude, smaller for faint stars. */
  amp: number;
  speed: number;
  phase: number;
  /** Parallax depth 0.3–1: brighter stars feel closer and shift more. */
  depth: number;
};

export type ShootingStar = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
  tail: number;
  born: number;
  life: number;
};

type Rand = () => number;

/** Star budget scales with screen area; touch devices get a lighter field. */
export function starCount(width: number, height: number, coarse: boolean): number {
  const area = Math.max(0, width) * Math.max(0, height);
  return coarse
    ? Math.round(Math.min(90, Math.max(40, area / 6500)))
    : Math.round(Math.min(260, Math.max(90, area / 7000)));
}

export function createStar(rand: Rand = Math.random): Star {
  // Magnitude skew: most stars are faint pinpoints, a few are bright.
  const magnitude = Math.pow(rand(), 3);
  const size = STAR_SIZE.min + (STAR_SIZE.max - STAR_SIZE.min) * magnitude;
  const span = STAR_OPACITY.max - STAR_OPACITY.min;
  const amp = span * (0.12 + 0.18 * rand());
  const base = STAR_OPACITY.min + amp + (span - 2 * amp) * (0.25 + 0.75 * magnitude) * rand();
  const pick = rand();
  const color = pick < 0.55 ? STAR_COLORS[0] : pick < 0.83 ? STAR_COLORS[1] : STAR_COLORS[2];
  return {
    x: rand(),
    y: rand(),
    size,
    color,
    base,
    amp,
    speed: 0.4 + rand() * 1.2,
    phase: rand() * Math.PI * 2,
    depth: 0.3 + 0.7 * magnitude,
  };
}

/** Current opacity of a star; always stays inside STAR_OPACITY. */
export function starOpacity(star: Star, seconds: number): number {
  const value = star.base + star.amp * Math.sin(seconds * star.speed + star.phase);
  return Math.min(STAR_OPACITY.max, Math.max(STAR_OPACITY.min, value));
}

export function nextShootingDelay(rand: Rand = Math.random): number {
  return SHOOTING_INTERVAL_MS.min + (SHOOTING_INTERVAL_MS.max - SHOOTING_INTERVAL_MS.min) * rand();
}

/** A single diagonal streak; speed scales with the viewport so phones see a full arc. */
export function createShootingStar(width: number, height: number, now: number, rand: Rand = Math.random): ShootingStar {
  const leftToRight = rand() < 0.5;
  const angle = ((18 + rand() * 32) * Math.PI) / 180; // 18–50° below horizontal
  const dx = Math.cos(angle) * (leftToRight ? 1 : -1);
  const dy = Math.sin(angle);
  const base = Math.max(Math.min(width, 1400), 420);
  return {
    x: leftToRight ? width * rand() * 0.6 : width * (0.4 + rand() * 0.6),
    y: height * rand() * 0.75,
    dx,
    dy,
    speed: base * (0.55 + rand() * 0.3),
    tail: SHOOTING_TAIL_PX.min + (SHOOTING_TAIL_PX.max - SHOOTING_TAIL_PX.min) * rand(),
    born: now,
    life: 1300 + rand() * 600,
  };
}

/** Head position of a streak after `ms` milliseconds. */
export function shootingHead(star: ShootingStar, ms: number): { x: number; y: number } {
  const travelled = (star.speed * ms) / 1000;
  return { x: star.x + star.dx * travelled, y: star.y + star.dy * travelled };
}

/**
 * Tries several random streaks and keeps the one whose path stays on screen and
 * crosses the most empty background (`isEmpty` decides per point).
 */
export function pickShootingStar(
  width: number,
  height: number,
  now: number,
  isEmpty: (x: number, y: number) => boolean,
  rand: Rand = Math.random,
  tries = 14,
): ShootingStar {
  let best = createShootingStar(width, height, now, rand);
  let bestScore = -1;
  for (let t = 0; t < tries; t++) {
    const candidate = t === 0 ? best : createShootingStar(width, height, now, rand);
    let score = 0;
    const samples = 10;
    for (let i = 0; i <= samples; i++) {
      const { x, y } = shootingHead(candidate, (candidate.life * i) / samples);
      if (x < 0 || y < 0 || x > width || y > height) continue;
      score += isEmpty(x, y) ? 1 : 0.2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}
