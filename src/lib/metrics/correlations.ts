export function pearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const avgX = x.reduce((acc, value) => acc + value, 0) / n;
  const avgY = y.reduce((acc, value) => acc + value, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i += 1) {
    const xi = x[i];
    const yi = y[i];
    if (xi == null || yi == null) continue;

    const dx = xi - avgX;
    const dy = yi - avgY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
}
