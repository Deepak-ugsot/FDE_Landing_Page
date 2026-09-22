// Outline of a union of axis-aligned rectangles, drawn as an SVG path with
// rounded corners (convex corners bulge, concave corners become fillets).
// Used to morph a stepped shape frame by frame as its rectangles grow.

export type Rect = readonly [x0: number, y0: number, x1: number, y1: number];
type Pt = [number, number];

/** Traces the boundary loops of the union, clockwise in screen coordinates (y down). */
function traceUnion(rects: Rect[]): Pt[][] {
  const rs = rects.filter(([x0, y0, x1, y1]) => x1 - x0 > 0.5 && y1 - y0 > 0.5);
  if (!rs.length) return [];

  const xs = [...new Set(rs.flatMap((r) => [r[0], r[2]]))].sort((a, b) => a - b);
  const ys = [...new Set(rs.flatMap((r) => [r[1], r[3]]))].sort((a, b) => a - b);
  const cols = xs.length - 1;
  const rows = ys.length - 1;

  const filled: boolean[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const cx = (xs[i] + xs[i + 1]) / 2;
      const cy = (ys[j] + ys[j + 1]) / 2;
      filled[j * cols + i] = rs.some(([x0, y0, x1, y1]) => cx > x0 && cx < x1 && cy > y0 && cy < y1);
    }
  }
  const isFilled = (i: number, j: number) => i >= 0 && j >= 0 && i < cols && j < rows && filled[j * cols + i];

  // Directed boundary edges between grid points, keyed by start point.
  const next = new Map<string, string[]>();
  const add = (a: Pt, b: Pt) => {
    const k = `${a[0]},${a[1]}`;
    const list = next.get(k) ?? [];
    list.push(`${b[0]},${b[1]}`);
    next.set(k, list);
  };
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (!isFilled(i, j)) continue;
      if (!isFilled(i, j - 1)) add([i, j], [i + 1, j]); // top, left → right
      if (!isFilled(i + 1, j)) add([i + 1, j], [i + 1, j + 1]); // right, top → bottom
      if (!isFilled(i, j + 1)) add([i + 1, j + 1], [i, j + 1]); // bottom, right → left
      if (!isFilled(i - 1, j)) add([i, j + 1], [i, j]); // left, bottom → top
    }
  }

  const loops: Pt[][] = [];
  for (const start of [...next.keys()]) {
    while (next.get(start)?.length) {
      const loop: Pt[] = [];
      let cur = start;
      do {
        const [gi, gj] = cur.split(",").map(Number);
        loop.push([xs[gi], ys[gj]]);
        const outs = next.get(cur)!;
        const nxt = outs.shift()!;
        cur = nxt;
      } while (cur !== start && next.get(cur)?.length);

      // Drop points that sit in the middle of a straight run.
      const n = loop.length;
      const corners = loop.filter((p, i) => {
        const a = loop[(i - 1 + n) % n];
        const b = loop[(i + 1) % n];
        return !((a[0] === p[0] && p[0] === b[0]) || (a[1] === p[1] && p[1] === b[1]));
      });
      if (corners.length >= 4) loops.push(corners);
    }
  }
  return loops;
}

/** Rounds each corner; the radius shrinks on short edges so small in-between shapes stay smooth. */
function roundLoop(points: Pt[], radius: number) {
  const n = points.length;
  let d = "";
  points.forEach(([cx, cy], i) => {
    const [px, py] = points[(i - 1 + n) % n];
    const [nx, ny] = points[(i + 1) % n];
    const r = Math.min(radius, Math.hypot(cx - px, cy - py) / 2, Math.hypot(nx - cx, ny - cy) / 2);
    const inX = Math.sign(cx - px), inY = Math.sign(cy - py);
    const outX = Math.sign(nx - cx), outY = Math.sign(ny - cy);
    const sweep = inX * outY - inY * outX > 0 ? 1 : 0; // right turn in a clockwise loop = convex
    const f = (v: number) => Math.round(v * 10) / 10;
    d += `${i === 0 ? "M" : "L"}${f(cx - inX * r)},${f(cy - inY * r)} A${f(r)},${f(r)} 0 0 ${sweep} ${f(cx + outX * r)},${f(cy + outY * r)} `;
  });
  return `${d}Z`;
}

export function roundedUnionPath(rects: Rect[], radius: number) {
  return traceUnion(rects)
    .map((loop) => roundLoop(loop, radius))
    .join(" ");
}

export const lerpRect = (from: Rect, to: Rect, t: number): Rect => [
  from[0] + (to[0] - from[0]) * t,
  from[1] + (to[1] - from[1]) * t,
  from[2] + (to[2] - from[2]) * t,
  from[3] + (to[3] - from[3]) * t,
];
