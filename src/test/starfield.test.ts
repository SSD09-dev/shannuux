import { describe, expect, it } from "vitest";
import {
  createShootingStar,
  createStar,
  nextShootingDelay,
  pickShootingStar,
  shootingHead,
  SHOOTING_OPACITY,
  starCount,
  starOpacity,
} from "@/lib/starfield";

const seq = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length] ?? 0;
};
const samples = [0, 0.001, 0.25, 0.5, 0.75, 0.999];

describe("cosmic starfield rules", () => {
  it("spawns shooting stars every 3 to 6 seconds", () => {
    expect(nextShootingDelay(() => 0)).toBe(3000);
    expect(nextShootingDelay(() => 0.999999)).toBeCloseTo(6000, -1);
  });

  it("keeps shooting star tails between 120px and 220px", () => {
    for (const v of samples) {
      const s = createShootingStar(1280, 800, 0, () => v);
      expect(s.tail).toBeGreaterThanOrEqual(120);
      expect(s.tail).toBeLessThanOrEqual(220);
    }
  });

  it("prefers a path across empty background", () => {
    // Content fills the lower half; the chosen streak should stay in the empty top.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const star = pickShootingStar(1280, 800, 0, (_x, y) => y < 400, rand);
    const mid = shootingHead(star, star.life / 2);
    expect(mid.y).toBeLessThan(400);
  });

  it("shoots at a brighter 0.75 peak opacity", () => {
    expect(SHOOTING_OPACITY).toBe(0.75);
  });

  it("keeps star sizes between 0.6px and 2px", () => {
    for (const v of samples) {
      const star = createStar(() => v);
      expect(star.size).toBeGreaterThanOrEqual(0.6);
      expect(star.size).toBeLessThanOrEqual(2);
    }
  });

  it("keeps twinkling opacity between 0.25 and 0.8", () => {
    for (const v of samples) {
      const star = createStar(seq([v, 0.9, 0.1, 0.6, 0.3]));
      for (let t = 0; t < 20; t += 0.37) {
        const o = starOpacity(star, t);
        expect(o).toBeGreaterThanOrEqual(0.25);
        expect(o).toBeLessThanOrEqual(0.8);
      }
    }
  });

  it("renders fewer stars on touch devices", () => {
    expect(starCount(1280, 800, true)).toBeLessThan(starCount(1280, 800, false));
    expect(starCount(393, 674, true)).toBeLessThanOrEqual(90);
  });
});
