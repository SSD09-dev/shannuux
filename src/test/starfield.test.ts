import { describe, expect, it } from "vitest";
import {
  createShootingStar,
  createStar,
  nextShootingDelay,
  starCount,
  starOpacity,
} from "@/lib/starfield";

const seq = (values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};
const samples = [0, 0.001, 0.25, 0.5, 0.75, 0.999];

describe("cosmic starfield rules", () => {
  it("spawns shooting stars every 6 to 12 seconds", () => {
    expect(nextShootingDelay(() => 0)).toBe(6000);
    expect(nextShootingDelay(() => 0.999999)).toBeCloseTo(12000, -1);
  });

  it("keeps shooting star tails between 60px and 120px", () => {
    for (const v of samples) {
      const s = createShootingStar(1280, 800, 0, () => v);
      expect(s.tail).toBeGreaterThanOrEqual(60);
      expect(s.tail).toBeLessThanOrEqual(120);
    }
  });

  it("starts shooting stars in the upper part of the screen", () => {
    for (const v of samples) expect(createShootingStar(1280, 800, 0, () => v).y).toBeLessThanOrEqual(800 * 0.3);
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
