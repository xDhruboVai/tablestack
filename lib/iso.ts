/** Isometric projection helpers for the exploded table. */
export const C = Math.cos(Math.PI / 6);
export const S = 0.5;

/** Project a 3D point (x → right-down, y → left-down, z → up) to 2D screen space. */
export function iso(x: number, y: number, z: number): [number, number] {
  return [(x - y) * C, (x + y) * S - z];
}

const f = (n: number) => Math.round(n * 100) / 100;

export function points(list: [number, number, number][]) {
  return list
    .map(([x, y, z]) => {
      const [px, py] = iso(x, y, z);
      return `${f(px)},${f(py)}`;
    })
    .join(" ");
}

/** SVG transform that maps flat (u, v) drawing coordinates onto a horizontal plane at height z. */
export function planeMatrix(z: number) {
  return `matrix(${f(C)} ${S} ${f(-C)} ${S} 0 ${-z})`;
}

/** Maps (u, w) onto the front-left vertical face (y = depth), w pointing down. */
export function leftFaceMatrix(depth: number) {
  return `matrix(${f(C)} ${S} 0 1 ${f(-depth * C)} ${depth * S})`;
}
