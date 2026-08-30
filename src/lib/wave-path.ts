/**
 * Wave paths that tile.
 *
 * Every scrolling wave in the app is two copies of one SVG laid end to end and
 * slid sideways forever. That only reads as water if the path *tiles* — which
 * needs two things, and an earlier hand-drawn path had neither:
 *
 *   1. The first and last node share a y value, or the join shows a step.
 *   2. Both ends leave horizontally, or the join shows a kink.
 *
 * `tilingWave` enforces both by construction: it gives every node a horizontal
 * tangent and closes the loop back to the starting height. Node heights are
 * free to vary, so the water still looks hand-drawn rather than like a sine.
 */

const VIEW_W = 1200;
const VIEW_H = 160;

export const WAVE_VIEWBOX = `0 0 ${VIEW_W} ${VIEW_H}`;

interface Node {
  /** Distance along the tile, 0 → 1200. */
  x: number;
  /** Height in viewBox units; smaller is higher up. */
  y: number;
}

/**
 * Builds the crest line. Nodes must start at x=0 and end at x=1200 with equal
 * y, which the caller is responsible for — the constants below all do.
 */
function crestFrom(nodes: Node[]): string {
  let d = `M${nodes[0].x},${nodes[0].y}`;
  for (let i = 1; i < nodes.length; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    // Horizontal control handles a third of the way in from each end give the
    // node a flat tangent, so consecutive segments meet smoothly.
    const handle = (b.x - a.x) / 3;
    d += ` C${(a.x + handle).toFixed(1)},${a.y} ${(b.x - handle).toFixed(1)},${b.y} ${b.x},${b.y}`;
  }
  return d;
}

/** The crest line, plus walls and a floor, so it can be filled as water. */
function fillFrom(crest: string): string {
  return `${crest} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`;
}

export interface WavePath {
  /** Stroke this for the white crest. */
  crest: string;
  /** Fill this for the body of the water. */
  fill: string;
}

function tilingWave(nodes: Node[]): WavePath {
  if (nodes[0].y !== nodes[nodes.length - 1].y) {
    throw new Error("tilingWave: first and last node must share a y to tile");
  }
  const crest = crestFrom(nodes);
  return { crest, fill: fillFrom(crest) };
}

/** The shore's swell — long, lazy, three crests to a tile. */
export const SHORE_WAVE = tilingWave([
  { x: 0, y: 42 },
  { x: 200, y: 100 },
  { x: 430, y: 48 },
  { x: 640, y: 104 },
  { x: 860, y: 40 },
  { x: 1050, y: 96 },
  { x: 1200, y: 42 },
]);

/** The intro surf — tighter and choppier than the shore behind it. */
export const SURF_WAVE = tilingWave([
  { x: 0, y: 54 },
  { x: 170, y: 96 },
  { x: 360, y: 44 },
  { x: 560, y: 100 },
  { x: 760, y: 46 },
  { x: 980, y: 92 },
  { x: 1200, y: 54 },
]);
