import { useEffect } from "react";

const POINTER_FINE = "(hover: hover) and (pointer: fine)";
const POINTER_COARSE = "(hover: none) and (pointer: coarse)";

/**
 * Feeds --mouse-x / --mouse-y to the `.glow-spot` element under the cursor.
 * One delegated listener, throttled to animation frames; inactive on touch devices.
 */
export function usePointerSpotlight() {
  useEffect(() => {
    const fine = window.matchMedia(POINTER_FINE);
    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      pending = null;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mouse-x", `${x - rect.left}px`);
      el.style.setProperty("--mouse-y", `${y - rect.top}px`);
    };

    const onMove = (event: PointerEvent) => {
      if (!fine.matches || event.pointerType === "touch") return;
      const target = event.target as Element | null;
      const el = target?.closest?.<HTMLElement>(".glow-spot");
      if (!el) return;
      pending = { el, x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}

/**
 * On touch devices, marks the `[data-focus-glow]` card nearest the middle of the
 * viewport with data-in-view="true" so it gets a gentle ambient border glow.
 */
export function useViewportFocusGlow() {
  useEffect(() => {
    const coarse = window.matchMedia(POINTER_COARSE);
    if (!coarse.matches || !("IntersectionObserver" in window)) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-focus-glow]"));
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) el.dataset.inView = "true";
          else delete el.dataset.inView;
        }),
      { rootMargin: "-40% 0px -40% 0px" },
    );
    cards.forEach((card) => observer.observe(card));
    return () => {
      observer.disconnect();
      cards.forEach((card) => delete card.dataset.inView);
    };
  }, []);
}
