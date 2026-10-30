/** Small geometry helpers for convex shapes in the room scene (the desk top). Pure. */

export interface PolygonPoint {
  x: number;
  y: number;
}

/** A point put on an edge by clampToConvexPolygon is a rounding error away from it. */
const ON_EDGE_TOLERANCE = 1e-9;

function cross(a: PolygonPoint, b: PolygonPoint, p: PolygonPoint): number {
  return (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
}

/** Whether `point` lies inside (or on the edge of) the convex polygon `corners`, listed in order. */
export function isInConvexPolygon(corners: PolygonPoint[], point: PolygonPoint): boolean {
  const sides = corners.map((corner, i) => cross(corner, corners[(i + 1) % corners.length], point));
  return sides.every((side) => side >= -ON_EDGE_TOLERANCE) || sides.every((side) => side <= ON_EDGE_TOLERANCE);
}

function nearestOnSegment(a: PolygonPoint, b: PolygonPoint, p: PolygonPoint): PolygonPoint {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.min(1, Math.max(0, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lengthSquared));
  return { x: a.x + t * dx, y: a.y + t * dy };
}

/** The point of the convex polygon nearest to `point`: the point itself when it is inside. */
export function clampToConvexPolygon(corners: PolygonPoint[], point: PolygonPoint): PolygonPoint {
  if (isInConvexPolygon(corners, point)) return point;
  const candidates = corners.map((corner, i) => nearestOnSegment(corner, corners[(i + 1) % corners.length], point));
  return candidates.reduce((best, candidate) =>
    Math.hypot(candidate.x - point.x, candidate.y - point.y) < Math.hypot(best.x - point.x, best.y - point.y) ? candidate : best
  );
}

/** The polygon shrunk towards its middle to `share` of its size. */
export function shrinkPolygon(corners: PolygonPoint[], share: number): PolygonPoint[] {
  const middle = {
    x: corners.reduce((sum, corner) => sum + corner.x, 0) / corners.length,
    y: corners.reduce((sum, corner) => sum + corner.y, 0) / corners.length,
  };
  return corners.map((corner) => ({ x: middle.x + (corner.x - middle.x) * share, y: middle.y + (corner.y - middle.y) * share }));
}
