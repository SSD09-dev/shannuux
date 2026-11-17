import { useEffect, useRef } from "react";
import {
  PARALLAX_MAX_PX,
  SHOOTING_BEHIND_CONTENT,
  SHOOTING_OPACITY,
  createStar,
  nextShootingDelay,
  pickShootingStar,
  shootingHead,
  starCount,
  starOpacity,
  type ShootingStar,
  type Star,
} from "@/lib/starfield";

const POINTER_FINE = "(hover: hover) and (pointer: fine)";
const POINTER_COARSE = "(pointer: coarse)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
/** Anything that counts as foreground content rather than empty sky. */
const CONTENT_SELECTOR = ".glass, .panel, img, h1, h2, h3, p, li, a, button, nav, header, [role='dialog']";

/** True when the point shows bare page background (the canvases ignore hit tests). */
function isEmptyAt(x: number, y: number): boolean {
  const el = document.elementFromPoint(x, y);
  return !el || !el.closest(CONTENT_SELECTOR);
}

/**
 * Site-wide decorative sky. Stars twinkle on a canvas behind everything; shooting
 * stars use a second canvas layered just above the page (below the dock, header and
 * dialogs) so they stay visible through the glass content, dimmed while crossing it.
 */
export function CosmicStarfield() {
  const starsRef = useRef<HTMLCanvasElement>(null);
  const meteorRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = starsRef.current;
    const meteorCanvas = meteorRef.current;
    const ctx = canvas?.getContext("2d");
    const mctx = meteorCanvas?.getContext("2d");
    if (!canvas || !meteorCanvas || !ctx || !mctx) return;

    const fine = window.matchMedia(POINTER_FINE);
    const coarse = window.matchMedia(POINTER_COARSE);
    const reduced = window.matchMedia(REDUCED_MOTION);

    let width = 0;
    let height = 0;
    const stars: Star[] = [];
    let shooting: ShootingStar | null = null;
    let meteorDirty = false;
    let veil = 1;
    let nextShootAt = performance.now() + 1500;
    let frame = 0;
    let lastDraw = 0;
    const offset = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, coarse.matches ? 1.5 : 2);
      width = window.innerWidth;
      height = window.innerHeight;
      for (const [c, context] of [[canvas, ctx], [meteorCanvas, mctx]] as const) {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
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
      if (meteorDirty) {
        mctx.clearRect(0, 0, width, height);
        meteorDirty = false;
      }
      if (!shooting) return;
      const age = now - shooting.born;
      const progress = age / shooting.life;
      if (progress >= 1) {
        shooting = null;
        return;
      }
      const { x: hx, y: hy } = shootingHead(shooting, age);
      const tail = shooting.tail * Math.min(1, progress * 2.5);
      const tx = hx - shooting.dx * tail;
      const ty = hy - shooting.dy * tail;
      // Dim smoothly while the head is over cards or text so it reads as passing behind glass.
      veil += ((isEmptyAt(hx, hy) ? 1 : SHOOTING_BEHIND_CONTENT) - veil) * 0.2;
      const alpha = SHOOTING_OPACITY * veil * Math.sin(Math.PI * Math.min(1, progress * 1.15));

      mctx.lineCap = "round";
      // Soft outer glow, then a crisp core line.
      for (const [w, a] of [[4, 0.18], [1.6, 1]] as const) {
        const gradient = mctx.createLinearGradient(hx, hy, tx, ty);
        gradient.addColorStop(0, `rgba(255,255,255,${alpha * a})`);
        gradient.addColorStop(0.35, `rgba(220,232,255,${alpha * a * 0.5})`);
        gradient.addColorStop(1, "rgba(191,216,255,0)");
        mctx.strokeStyle = gradient;
        mctx.lineWidth = w;
        mctx.beginPath();
        mctx.moveTo(hx, hy);
        mctx.lineTo(tx, ty);
        mctx.stroke();
      }

      const glow = mctx.createRadialGradient(hx, hy, 0, hx, hy, 7);
      glow.addColorStop(0, `rgba(255,255,255,${Math.min(1, alpha * 1.3)})`);
      glow.addColorStop(0.35, `rgba(220,232,255,${alpha * 0.45})`);
      glow.addColorStop(1, "rgba(191,216,255,0)");
      mctx.fillStyle = glow;
      mctx.beginPath();
      mctx.arc(hx, hy, 7, 0, Math.PI * 2);
      mctx.fill();
      meteorDirty = true;
    };

    const drawStatic = () => {
      offset.x = offset.y = 0;
      ctx.clearRect(0, 0, width, height);
      mctx.clearRect(0, 0, width, height);
      drawStars(0, true);
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      // Touch devices: twinkle at ~30fps to save battery, full rate while a streak is visible.
      const minGap = coarse.matches && !shooting ? 1000 / 30 : 0;
      if (now - lastDraw < minGap) return;
      lastDraw = now;

      if (!shooting && now >= nextShootAt) {
        shooting = pickShootingStar(width, height, now, isEmptyAt);
        veil = 1;
        nextShootAt = now + shooting.life + nextShootingDelay();
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
      shooting = null;
      if (reduced.matches) {
        drawStatic();
        return;
      }
      nextShootAt = performance.now() + 1500;
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

  return (
    <>
      <canvas ref={starsRef} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
      <canvas ref={meteorRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />
    </>
  );
}
