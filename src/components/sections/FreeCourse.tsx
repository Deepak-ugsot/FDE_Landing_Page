"use client";

import { useEffect, useRef } from "react";
import { program } from "@/content/program";
import { CardTab } from "@/components/ui/CardTab";
import { CtaButton } from "@/components/ui/CtaButton";
import { InverseCorner } from "@/components/ui/InverseCorner";

const YT_RED = "#ff0033";
const inkDeep = "var(--color-ink-deep)";

type Dot = {
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
  depth: number;
  phase: number;
  /** Motion scale: 1 on desktop, smaller for fine phone grids so letters stay legible. */
  scale: number;
  rgb: string;
};

type Dust = { x: number; y: number; originX: number; originY: number; size: number; alpha: number; drift: number; phase: number };

/**
 * Draws the YouTube mark (red play button + wordmark) into a w×h offscreen
 * canvas centred on (cx, cy), at most `maxFont` px tall, and returns one dot
 * per sampled grid cell that has ink, coloured like the pixel underneath it.
 */
function sampleMark(w: number, h: number, cx: number, cy: number, maxFont: number, fontFamily: string) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  // Size the mark so logo + gap + word fill at most ~82% of the width (90% on phones).
  const maxW = w * (w < 640 ? 0.9 : 0.82);
  let font = maxFont;
  ctx.font = `700 ${font}px ${fontFamily}`;
  const unit = () => {
    const logoH = font * 0.74;
    return { logoH, logoW: logoH * 1.42, gap: font * 0.2, text: ctx.measureText("YouTube").width };
  };
  let m = unit();
  const total = () => m.logoW + m.gap + m.text;
  if (total() > maxW) {
    font *= maxW / total();
    ctx.font = `700 ${font}px ${fontFamily}`;
    m = unit();
  }

  const left = cx - total() / 2;
  // Play button
  ctx.fillStyle = YT_RED;
  ctx.beginPath();
  ctx.roundRect(left, cy - m.logoH / 2, m.logoW, m.logoH, m.logoH * 0.28);
  ctx.fill();
  // Triangle is cut out, so it reads as the dark background through the red dots.
  ctx.globalCompositeOperation = "destination-out";
  const tx = left + m.logoW * 0.39;
  const th = m.logoH * 0.48;
  ctx.beginPath();
  ctx.moveTo(tx, cy - th / 2);
  ctx.lineTo(tx + th * 0.9, cy);
  ctx.lineTo(tx, cy + th / 2);
  ctx.closePath();
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
  // Wordmark
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText("YouTube", left + m.logoW + m.gap, cy + font * 0.04);

  const step = Math.max(3, Math.min(6, Math.round(font / 34)));
  const scale = Math.min(1, step / 6);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const dots: Dot[] = [];
  for (let y = 0; y < c.height; y += step) {
    for (let x = 0; x < c.width; x += step) {
      const i = (y * c.width + x) * 4;
      if (data[i + 3] < 120) continue;
      dots.push({
        homeX: x,
        homeY: y,
        x: x + (Math.random() - 0.5) * 18,
        y: y + (Math.random() - 0.5) * 18,
        size: (1 + 2 * Math.random()) * Math.max(0.7, scale),
        alpha: 0.5 + 0.36 * Math.random(),
        depth: 0.72 + 0.7 * Math.random(),
        phase: Math.random() * Math.PI * 2,
        scale,
        rgb: `${data[i]}, ${data[i + 1]}, ${data[i + 2]}`,
      });
    }
  }
  return dots;
}

/**
 * Free-course callout. The YouTube mark is drawn as a field of drifting dots
 * that shy away from the pointer, while the whole field tilts towards it — the same interaction as the reference's "code" panel.
 */
export function FreeCourse() {
  const panelRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const fontRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const plane = planeRef.current;
    const canvas = canvasRef.current;
    const mark = markRef.current;
    const ctx = canvas?.getContext("2d");
    if (!panel || !plane || !canvas || !mark || !ctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 1;
    let h = 1;
    let markY = 0;
    let dots: Dot[] = [];
    let dust: Dust[] = [];
    let raf = 0;
    let visible = false;
    let disposed = false;
    const pointer = { x: 0, y: 0, active: false };
    const tilt = { x: 0, y: 0 };
    const tiltTarget = { x: 0, y: 0 };

    const build = () => {
      const r = panel.getBoundingClientRect();
      const mr = mark.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      markY = mr.top - r.top + mr.height / 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontFamily = fontRef.current ? getComputedStyle(fontRef.current).fontFamily : "sans-serif";
      dots = sampleMark(w, h, w / 2, markY, Math.min(mr.height * 0.82, 230), fontFamily);
      if (motion.matches) dots.forEach((d) => ((d.x = d.homeX), (d.y = d.homeY)));

      const count = Math.round(Math.max(24, Math.min(72, (w * h) / 28000)));
      dust = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          originX: x,
          originY: y,
          size: 0.8 + 2.2 * Math.random(),
          alpha: 0.1 + 0.18 * Math.random(),
          drift: 6 + 18 * Math.random(),
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const step = (t: number) => {
      tilt.x += (tiltTarget.x - tilt.x) * 0.035;
      tilt.y += (tiltTarget.y - tilt.y) * 0.035;

      for (const d of dots) {
        // Slow, per-dot wobble plus parallax towards the pointer (deeper dots move more).
        const m = d.depth * d.scale;
        const wx = (2.2 * Math.cos(0.00028 * t + d.phase) + 1.8 * Math.sin(0.00017 * t + 0.017 * d.homeY + 1.4 * d.phase)) * m;
        const wy = (1.9 * Math.sin(0.00031 * t + d.phase) + 1.6 * Math.cos(0.00015 * t + 0.013 * d.homeX + 1.1 * d.phase)) * m;
        let tx = d.homeX + 10 * tilt.x * m + wx;
        let ty = d.homeY + 6 * tilt.y * m + wy;
        if (pointer.active) {
          const dx = tx - pointer.x;
          const dy = ty - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 120) {
            const k = 1 - dist / 120;
            const push = k * k * (3 - 2 * k) * 9 * (0.8 + 0.35 * d.depth);
            tx += (dx / dist) * push;
            ty += (dy / dist) * push;
          }
        }
        d.x += (tx - d.x) * 0.12;
        d.y += (ty - d.y) * 0.12;
      }

      for (const s of dust) {
        let tx = s.originX + tilt.x * s.size * 1.2 + Math.cos(0.00035 * t + s.phase) * s.drift;
        let ty = s.originY + tilt.y * s.size * 0.8 + Math.sin(0.00052 * t + s.phase) * s.drift;
        if (pointer.active) {
          const dx = tx - pointer.x;
          const dy = ty - pointer.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 132) {
            const push = (1 - dist / 132) * 2;
            tx += (dx / dist) * push;
            ty += (dy / dist) * push;
          }
        }
        s.x += (tx - s.x) * 0.028;
        s.y += (ty - s.y) * 0.028;
      }
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const s of dust) {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size * 1.4, Math.max(1, s.size * 0.75));
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      dots.forEach((d, i) => {
        const a = d.alpha * (0.95 + 0.04 * Math.sin(0.00042 * t + d.phase + 0.018 * i));
        ctx.fillStyle = `rgba(${d.rgb}, ${a})`;
        ctx.fillRect(d.x - d.size / 2, d.y - d.size / 2, d.size * 1.02, d.size * 0.98);
      });
      ctx.restore();

      plane.style.transform = `translate3d(${10 * tilt.x}px, ${8 * tilt.y}px, 0)`;
    };

    const loop = (t: number) => {
      step(t);
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    const sync = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (disposed || !visible || document.hidden) return;
      if (motion.matches) draw(performance.now());
      else raf = requestAnimationFrame(loop);
    };

    const rebuild = () => {
      build();
      draw(performance.now());
      sync();
    };

    const onMove = (e: PointerEvent) => {
      const r = panel.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
      tiltTarget.x = (pointer.x / r.width - 0.5) * 2;
      tiltTarget.y = (pointer.y / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      pointer.active = false;
      tiltTarget.x = 0;
      tiltTarget.y = 0;
    };

    rebuild();
    // Re-sample once the display font has loaded so the dots match its shapes.
    document.fonts?.ready.then(() => !disposed && rebuild()).catch(() => {});

    const resize = new ResizeObserver(rebuild);
    resize.observe(panel);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(panel);
    panel.addEventListener("pointermove", onMove);
    panel.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", rebuild);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      panel.removeEventListener("pointermove", onMove);
      panel.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", rebuild);
    };
  }, []);

  return (
    <section id="free-course" aria-labelledby="free-course-heading" className="mx-4 pt-28 pb-16 sm:mx-6 lg:mx-8 lg:pb-32">
      {/* Stepped dark card, like the hero: a label tab rises from the top-left and, on desktop,
          a CTA tab hangs from the bottom-right. The fillets join the tabs to the card. */}
      <div ref={panelRef} className="relative rounded-[32px] rounded-tl-none bg-ink-deep lg:rounded-br-none">
        <CardTab dot="bg-[#ff0033]">Free on YouTube</CardTab>

        {/* Canvas layer, clipped to the card (the plane drifts a few px with the pointer) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <div ref={planeRef} className="absolute inset-0 will-change-transform">
            <canvas ref={canvasRef} aria-hidden="true" className="size-full" />
          </div>
        </div>
        {/* Invisible probe: lets the canvas use the same display font as the page. */}
        <span ref={fontRef} aria-hidden="true" className="invisible absolute font-display" />

        <div className="relative flex min-h-[540px] flex-col px-5 pt-7 pb-8 sm:px-8 lg:min-h-[600px] lg:px-12 lg:pt-9 lg:pb-10">
          <div className="flex justify-end font-mono text-[11px] tracking-[0.04em] text-mist uppercase" aria-hidden="true">
            /youtube
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            {/* Space the dot-drawn mark sits in */}
            <div ref={markRef} aria-hidden="true" className="h-[clamp(120px,22vw,260px)] w-full" />
            <h2 id="free-course-heading" className="sr-only">
              The full course is free on YouTube
            </h2>
            <p className="mt-6 max-w-3xl lg:mt-10 text-lg leading-[1.6] text-paper/80 sm:text-xl lg:text-[26px] lg:leading-[1.5]">
              The whole course is free on YouTube. Want hands-on practice, extra resources and access to the learning
              platform? Unlock all of it for just <span className="font-semibold text-accent">{program.platformPrice}</span>.
            </p>
          </div>

          <ul className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.04em] text-dim uppercase">
            {["Full course · Free", "Practice labs", "Resources & platform"].map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span className="size-1 rounded-full bg-ink-line" aria-hidden="true" />}
                {item}
              </li>
            ))}
          </ul>

          {/* CTAs: inside the card on small screens, a tab under the card's bottom-right on desktop */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:absolute lg:top-full lg:right-0 lg:mt-0 lg:rounded-b-3xl lg:bg-ink-deep lg:px-6 lg:pt-2 lg:pb-6">
            <InverseCorner at="bl" color={inkDeep} className="top-0 -left-6 hidden lg:block" />
            <a
              href={program.youtubeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center justify-center gap-3 rounded-2xl border border-ink-line px-5 text-base font-medium transition-colors hover:border-[#ff0033] hover:bg-[#ff0033]"
            >
              <svg viewBox="0 0 24 24" className="size-4 fill-[#ff0033] transition-colors group-hover:fill-white" aria-hidden="true">
                <path d="M8 5.5v13l11-6.5-11-6.5Z" />
              </svg>
              Watch free on YouTube
            </a>
            <CtaButton href={program.platformHref}>Unlock practice · {program.platformPrice}</CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
