"use client";

import { useEffect, useRef } from "react";
import { program } from "@/content/program";
import { CardTab } from "@/components/ui/CardTab";
import { CtaButton } from "@/components/ui/CtaButton";
import { InverseCorner } from "@/components/ui/InverseCorner";

const YT_RED = "#ff0033";
const inkDeep = "var(--color-ink-deep)";

// 3D mark tuning.
const PERSPECTIVE = 1400; // camera distance, px
const TILT_Y = 0.3; // max turn left/right towards the pointer, rad
const TILT_X = 0.42; // max tilt up/down towards the pointer, rad
const PUSH_RADIUS = 90; // dots within this distance of the pointer shy away
const PUSH = 10; // how far they move at the centre, px
const INTRO_MS = 1400; // dots fly in and settle into the mark
const DOT = 0.6; // dot size as a fraction of the grid pitch

/**
 * The YouTube mark as an extruded 3D shape made of a regular grid of dots:
 * a bright front face plus side walls that darken as they go back. Coordinates
 * are relative to the mark's centre; z runs from -depth/2 (front) to +depth/2.
 */
type Mark = {
  count: number;
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  r: Uint8Array;
  g: Uint8Array;
  b: Uint8Array;
  /** Brightest channel, used to keep the brightest dot when several land on one pixel. */
  lum: Uint8Array;
  /** Where each dot starts during the intro, as an offset from its place. */
  jx: Float32Array;
  jy: Float32Array;
  halfW: number;
  halfH: number;
  depth: number;
  /** Grid pitch, px. */
  step: number;
};

type Dust = { x: number; y: number; originX: number; originY: number; size: number; alpha: number; drift: number; phase: number };

const EMPTY_MARK: Mark = {
  count: 0,
  x: new Float32Array(0),
  y: new Float32Array(0),
  z: new Float32Array(0),
  r: new Uint8Array(0),
  g: new Uint8Array(0),
  b: new Uint8Array(0),
  lum: new Uint8Array(0),
  jx: new Float32Array(0),
  jy: new Float32Array(0),
  halfW: 0,
  halfH: 0,
  depth: 0,
  step: 1,
};

/**
 * Draws the YouTube mark (red play button + white wordmark) into a w×h
 * offscreen canvas centred on (cx, cy), at most `maxFont` px tall, samples it
 * on a regular grid and extrudes it: every inked cell becomes a front dot, and
 * every cell on the outline also gets a column of wall dots going back in z.
 */
function sampleMark(w: number, h: number, cx: number, cy: number, maxFont: number, fontFamily: string): Mark {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return EMPTY_MARK;

  // Size the mark so logo + gap + word fill at most ~78% of the width (88% on phones),
  // leaving room for the perspective to widen it when it turns.
  const maxW = w * (w < 640 ? 0.88 : 0.78);
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
  // Triangle is cut out, so it gets its own inner walls.
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

  // Occupancy grid: 0 = empty, 1 = red (play button), 2 = white (wordmark).
  const step = Math.max(2, Math.min(4, font / 80));
  const cols = Math.floor(c.width / step);
  const rows = Math.floor(c.height / step);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const cells = new Uint8Array(cols * rows);
  let inked = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = (Math.round(row * step) * c.width + Math.round(col * step)) * 4;
      if (data[i + 3] < 120) continue;
      cells[row * cols + col] = data[i + 1] < 128 ? 1 : 2;
      inked++;
    }
  }
  const filled = (col: number, row: number) =>
    col >= 0 && row >= 0 && col < cols && row < rows && cells[row * cols + col] !== 0;

  const depth = font * 0.3;
  const layers = Math.max(4, Math.round(depth / step));
  const edge = new Uint8Array(cols * rows);
  let edges = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!cells[row * cols + col]) continue;
      if (!filled(col - 1, row) || !filled(col + 1, row) || !filled(col, row - 1) || !filled(col, row + 1)) {
        edge[row * cols + col] = 1;
        edges++;
      }
    }
  }

  const count = inked + edges * layers;
  const mark: Mark = {
    count,
    x: new Float32Array(count),
    y: new Float32Array(count),
    z: new Float32Array(count),
    r: new Uint8Array(count),
    g: new Uint8Array(count),
    b: new Uint8Array(count),
    lum: new Uint8Array(count),
    jx: new Float32Array(count),
    jy: new Float32Array(count),
    halfW: 0,
    halfH: 0,
    depth,
    step,
  };

  // Front / wall / back-rim colours for each kind of cell.
  const tone = (kind: number, shade: number): [number, number, number] =>
    kind === 1 ? [255 * shade, 20 * shade, 60 * shade] : [238 * shade, 238 * shade, 242 * shade];

  let n = 0;
  const push = (x: number, y: number, z: number, rgb: [number, number, number]) => {
    mark.x[n] = x;
    mark.y[n] = y;
    mark.z[n] = z;
    mark.r[n] = rgb[0];
    mark.g[n] = rgb[1];
    mark.b[n] = rgb[2];
    mark.lum[n] = Math.max(rgb[0], rgb[1], rgb[2]);
    mark.jx[n] = (Math.random() - 0.5) * 160;
    mark.jy[n] = (Math.random() - 0.5) * 120;
    mark.halfW = Math.max(mark.halfW, Math.abs(x));
    mark.halfH = Math.max(mark.halfH, Math.abs(y));
    n++;
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const kind = cells[row * cols + col];
      if (!kind) continue;
      const x = col * step - cx;
      const y = row * step - cy;
      const isEdge = edge[row * cols + col] === 1;
      push(x, y, -depth / 2, tone(kind, isEdge ? 1 : 0.86));
      if (!isEdge) continue;
      for (let k = 1; k <= layers; k++) {
        // Walls fade as they go back; the back rim catches a little light again.
        const shade = k === layers ? 0.42 : 0.5 - 0.3 * (k / layers);
        push(x, y, -depth / 2 + (k * depth) / layers, tone(kind, shade));
      }
    }
  }
  return mark;
}

/**
 * Free-course callout. The YouTube mark is an extruded 3D shape built from a
 * dense grid of dots that turns to face the pointer (like chillbase.net's
 * hero "B"); dots near the pointer shy away, and faint dust drifts behind it.
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
    const markEl = markRef.current;
    const ctx = canvas?.getContext("2d");
    // The mark is rasterised by hand into this buffer, then drawn onto the main canvas.
    const layer = document.createElement("canvas");
    const lctx = layer.getContext("2d");
    if (!panel || !plane || !canvas || !markEl || !ctx || !lctx) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 1;
    let h = 1;
    let dpr = 1;
    let markY = 0;
    let mark = EMPTY_MARK;
    let dust: Dust[] = [];
    // Layer rectangle (css px, relative to the panel) and its pixel buffers.
    const region = { x: 0, y: 0, w: 1, h: 1, pw: 1, ph: 1 };
    let image: ImageData | null = null;
    let pixels = new Uint32Array(0);
    let lit = new Uint8Array(0);
    let raf = 0;
    let visible = false;
    let disposed = false;
    let introStart = -1;
    const pointer = { x: 0, y: 0, active: false };
    const eased = { x: 0, y: 0, strength: 0 };
    const tilt = { x: 0, y: 0 };
    const tiltTarget = { x: 0, y: 0 };

    const build = () => {
      const r = panel.getBoundingClientRect();
      const mr = markEl.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      markY = mr.top - r.top + mr.height / 2;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const fontFamily = fontRef.current ? getComputedStyle(fontRef.current).fontFamily : "sans-serif";
      mark = sampleMark(w, h, w / 2, markY, Math.min(mr.height * 0.82, 230), fontFamily);

      // Room around the mark for it to turn, widen in perspective and push dots aside.
      const mx = mark.halfW * 0.14 + mark.depth + PUSH + 24;
      const my = mark.halfH * 0.5 + mark.depth + PUSH + 24;
      region.x = Math.max(0, Math.floor(w / 2 - mark.halfW - mx));
      region.y = Math.max(0, Math.floor(markY - mark.halfH - my));
      region.w = Math.max(1, Math.min(w, Math.ceil(w / 2 + mark.halfW + mx)) - region.x);
      region.h = Math.max(1, Math.min(h, Math.ceil(markY + mark.halfH + my)) - region.y);
      region.pw = Math.max(1, Math.round(region.w * dpr));
      region.ph = Math.max(1, Math.round(region.h * dpr));
      layer.width = region.pw;
      layer.height = region.ph;
      image = lctx.createImageData(region.pw, region.ph);
      pixels = new Uint32Array(image.data.buffer);
      lit = new Uint8Array(region.pw * region.ph);

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
      // A slow idle sway keeps the depth visible when nobody is pointing at it.
      const swayX = pointer.active ? 0 : 0.35 * Math.sin(0.00035 * t);
      const swayY = pointer.active ? 0 : 0.3 * Math.cos(0.00027 * t);
      tilt.x += (tiltTarget.x + swayX - tilt.x) * 0.05;
      tilt.y += (tiltTarget.y + swayY - tilt.y) * 0.05;
      eased.x += (pointer.x - eased.x) * 0.18;
      eased.y += (pointer.y - eased.y) * 0.18;
      eased.strength += ((pointer.active ? 1 : 0) - eased.strength) * 0.08;

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

    /** Projects every dot of the 3D mark and rasterises it into the layer buffer. */
    const renderMark = (t: number) => {
      if (!image) return;
      pixels.fill(0);
      lit.fill(0);

      const intro = introStart < 0 ? 0 : Math.min(1, (t - introStart) / INTRO_MS);
      const scatter = motion.matches ? 0 : (1 - intro) ** 3;
      // Face the pointer: pointer right → turn right, pointer up → tilt up.
      const ay = -tilt.x * TILT_Y;
      const ax = tilt.y * TILT_X;
      const cosY = Math.cos(ay);
      const sinY = Math.sin(ay);
      const cosX = Math.cos(ax);
      const sinX = Math.sin(ax);
      const cx = w / 2;
      const pushOn = eased.strength > 0.01;
      const pushR2 = PUSH_RADIUS * PUSH_RADIUS;
      const size = Math.max(1, Math.round(mark.step * DOT * dpr));
      const pw = region.pw;
      const ph = region.ph;
      const { x: X, y: Y, z: Z, r: R, g: G, b: B, lum: L, jx: JX, jy: JY } = mark;

      for (let i = 0; i < mark.count; i++) {
        const x = X[i] + JX[i] * scatter;
        const y = Y[i] + JY[i] * scatter;
        const z = Z[i];
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const f = PERSPECTIVE / (PERSPECTIVE + z2);
        let sx = cx + x1 * f;
        let sy = markY + y1 * f;

        if (pushOn) {
          const dx = sx - eased.x;
          const dy = sy - eased.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < pushR2) {
            const d = Math.sqrt(d2) || 1;
            const k = 1 - d / PUSH_RADIUS;
            const p = (k * k * (3 - 2 * k) * PUSH * eased.strength) / d;
            sx += dx * p;
            sy += dy * p;
          }
        }

        const px = Math.round((sx - region.x) * dpr);
        const py = Math.round((sy - region.y) * dpr);
        if (px < 0 || py < 0 || px + size > pw || py + size > ph) continue;

        // Slow horizontal scanlines shimmer across the dot grid.
        const shine = 0.86 + 0.14 * Math.sin(0.0022 * t - 0.045 * Y[i] + 0.01 * X[i]);
        const lum = L[i] * shine;
        const color =
          (0xff000000 | (((B[i] * shine) & 0xff) << 16) | (((G[i] * shine) & 0xff) << 8) | ((R[i] * shine) & 0xff)) >>> 0;
        for (let oy = 0; oy < size; oy++) {
          let idx = (py + oy) * pw + px;
          for (let ox = 0; ox < size; ox++, idx++) {
            if (lum > lit[idx]) {
              lit[idx] = lum;
              pixels[idx] = color;
            }
          }
        }
      }
      lctx.putImageData(image, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const s of dust) {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size * 1.4, Math.max(1, s.size * 0.75));
      }

      renderMark(t);
      ctx.drawImage(layer, region.x, region.y, region.w, region.h);

      plane.style.transform = `translate3d(${6 * tilt.x}px, ${4 * tilt.y}px, 0)`;
    };

    const loop = (t: number) => {
      if (introStart < 0) introStart = t;
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
      if (!pointer.active) {
        eased.x = pointer.x;
        eased.y = pointer.y;
      }
      pointer.active = true;
      tiltTarget.x = Math.max(-1, Math.min(1, (pointer.x - w / 2) / (w / 2)));
      tiltTarget.y = Math.max(-1, Math.min(1, (pointer.y - markY) / (h / 2)));
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
