// Utility untuk Inner Product, Norm, dan Sudut

// Parse input string ke number (mendukung "a/b")
export function parseScalar(val) {
  if (val === '' || val === '-') return 0;
  if (val.includes('/')) {
    const parts = val.split('/');
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      return num / den;
    }
    return 0;
  }
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

// Inner product <u, v> = sum u_i v_i
export function innerProduct(u, v) {
  const n = Math.min(u.length, v.length);
  let sum = 0;
  const terms = [];
  for (let i = 0; i < n; i++) {
    const prod = u[i] * v[i];
    terms.push({ index: i + 1, ui: u[i], vi: v[i], prod });
    sum += prod;
  }
  return { value: sum, terms };
}

// Norm ||u|| = sqrt(<u, u>)
export function norm(u) {
  const { value, terms } = innerProduct(u, u);
  const length = Math.sqrt(value);
  return { length, value, terms };
}

// Sudut antara u dan v: cos θ = <u, v> / (||u|| ||v||)
export function angleBetween(u, v) {
  const ip = innerProduct(u, v);
  const nu = norm(u);
  const nv = norm(v);

  const denom = nu.length * nv.length;
  if (denom === 0) {
    return {
      inner: ip,
      normU: nu,
      normV: nv,
      cosTheta: null,
      thetaRad: null,
      thetaDeg: null
    };
  }

  let cosTheta = ip.value / denom;
  // Clamp agar tidak lewat dari [-1, 1] karena error floating
  if (cosTheta > 1) cosTheta = 1;
  if (cosTheta < -1) cosTheta = -1;

  const thetaRad = Math.acos(cosTheta);
  const thetaDeg = thetaRad * 180 / Math.PI;

  return {
    inner: ip,
    normU: nu,
    normV: nv,
    cosTheta,
    thetaRad,
    thetaDeg
  };
}
