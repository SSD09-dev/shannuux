import { useEffect, useRef } from "react";
import {
  PARALLAX_MAX_PX,
  SHOOTING_OPACITY,
  createShootingStar,
  createStar,
  nextShootingDelay,
  starCount,
  starOpacity,
  type ShootingStar,
  type Star,
} from "@/lib/starfield";

const POINTER_FINE = "(hover: hover) and (pointer: fine)";
const POINTER_COARSE = "(pointer: coarse)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * Fixed, decorative canvas behind the whole site: twinkling spectral stars,
 * an occasional shooting star, and a gentle cursor parallax on desktop.
 */
export function CosmicStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const fine = window.matchMedia(POINTER_FINE);
    const coarse = window.matchMedia(POINTER_COARSE);
    const reduced = window.matchMedia(REDUCED_MOTION);

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let shooting: ShootingStar | null = null;
    let nextShootAt = performance.now() + nextShootingDelay();
    let frame = 0;
    let lastDraw = 0;
    const offset = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse.matches ? 1.5 : 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = starCount(width, height, coarse.matches);
      // Keep existing stars on mobile address-bar resizes; only top up or trim.
      while (stars.length < count) stars.push(createStar());
      if (stars.length > count) stars.length = count;
    };

    const drawStars = (seconds: number, still: boolean) => {
      const margin = PARALLAX_MAX_PX;
      for (const star of stars) {
        const x = star.x * (width + margin * 2) - margin + offset.x * star.depth;
        const y = star.y * (height + margin * 2) - margin + offset.y * star.depth;
        const alpha = still ? star.base : starOpacity(star, seconds);
        const r = star.size / 2;
        ctx.fillStyle = star.color;
        if (star.size > 1.4) {
          ctx.globalAlpha = alpha * 0.12;
          ctx.beginPath();
          ctx.arc(x, y, r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const drawShooting = (now: number) => {
      if (!shooting) return;
      const age = now - shooting.born;
      const progress = age / shooting.life;
      if (progress >= 1) {
        shooting = null;
        return;
      }
      const travelled = (shooting.speed * age) / 1000;
      const hx = shooting.x + shooting.dx * travelled;
      const hy = shooting.y + shooting.dy * travelled;
      const tail = shooting.tail * Math.min(1, progress * 3);
      const tx = hx - shooting.dx * tail;
      const ty = hy - shooting.dy * tail;
      const alpha = SHOOTING_OPACITY * Math.sin(Math.PI * progress);

      const gradient = ctx.createLinearGradient(hx, hy, tx, ty);
      gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
      gradient.addColorStop(1, "rgba(191,216,255,0)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.1;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, 4);
      glow.addColorStop(0, `rgba(255,255,255,${alpha * 1.6})`);
      glow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(hx, hy, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawStatic = () => {
      offset.x = offset.y = 0;
      ctx.clearRect(0, 0, width, height);
      drawStars(0, true);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      // Touch devices: twinkle at ~30fps to save battery, full rate while a streak is visible.
      const minGap = coarse.matches && !shooting ? 1000 / 30 : 0;
      if (now - lastDraw < minGap) return;
      lastDraw = now;

      if (!shooting && now >= nextShootAt) {
        shooting = createShootingStar(width, height, now);
        nextShootAt = now + nextShootingDelay();
      }
      offset.x += (target.x - offset.x) * 0.06;
      offset.y += (target.y - offset.y) * 0.06;

      ctx.clearRect(0, 0, width, height);
      drawStars(now / 1000, false);
      drawShooting(now);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reduced.matches) {
        shooting = null;
        drawStatic();
        return;
      }
      nextShootAt = performance.now() + nextShootingDelay();
      frame = requestAnimationFrame(tick);
    };

    const onPointer = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches || event.pointerType === "touch") return;
      target.x = ((event.clientX / width) * 2 - 1) * -PARALLAX_MAX_PX;
      target.y = ((event.clientY / height) * 2 - 1) * -PARALLAX_MAX_PX;
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        if (reduced.matches) drawStatic();
      }, 120);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else start();
    };

    resize();
    start();
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", start);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", start);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
