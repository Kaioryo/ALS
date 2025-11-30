import { parseScalar } from './subspace';
import { gaussJordan } from './rowEchelon';

// Proyeksi u ke arah v (vektor tunggal, dimensi sama)
export function projOntoVector(bArr, uArr) {
  const b = bArr.map(parseScalar);
  const u = uArr.map(parseScalar);

  const dim = Math.min(b.length, u.length);
  const bCut = b.slice(0, dim);
  const uCut = u.slice(0, dim);

  const dotBU = bCut.reduce((s, bi, i) => s + bi * uCut[i], 0);
  const dotUU = uCut.reduce((s, ui) => s + ui * ui, 0);

  if (dotUU === 0) {
    return {
      defined: false,
      reason: 'Vektor basis u adalah vektor nol, proyeksi tidak terdefinisi.'
    };
  }

  const scalar = dotBU / dotUU;
  const proj = uCut.map(ui => scalar * ui);
  const error = bCut.map((bi, i) => bi - proj[i]);

  return {
    defined: true,
    b: bCut,
    u: uCut,
    scalar,
    proj,
    error
  };
}

// Least squares Ax ≈ b  (A: m×n, b: m×1)
export function leastSquares(Astr, bStr) {
  const m = Astr.length;
  if (m === 0) {
    return { defined: false, reason: 'Matriks A kosong.' };
  }
  const n = Astr[0].length;

  // Parse A dan b
  const A = Astr.map(row => row.map(parseScalar));
  const b = bStr.map(parseScalar).slice(0, m);

  // Hitung At, AtA, Atb (numeric)
  const At = transposeNumeric(A);
  const AtA = multiplyNN(At, A);      // n×n
  const Atb = multiplyNv(At, b);      // n×1

  // Bentuk matriks augmented (AtA | Atb) dalam Fraction untuk Gauss-Jordan
  const augmented = AtA.map((row, i) => [...row, Atb[i]]);

  const gj = gaussJordan(augmented);
  const R = gj.finalMatrix;
  const steps = gj.steps || [];

  const x = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    x[i] = R[i][n].toDecimal();
  }

  // Proyeksi p = A x (numeric)
  const p = multiplyNv(A, x);
  const error = b.map((bi, i) => bi - p[i]);

  const errNorm2 = error.reduce((s, ei) => s + ei * ei, 0);

  return {
    defined: true,
    A,
    b,
    x,
    p,
    error,
    errNorm2,
    AtA,
    Atb,
    stepsNormalEq: steps
  };
}

// Util matriks numeric sederhana
function transposeNumeric(M) {
  const m = M.length;
  const n = M[0].length;
  const T = Array.from({ length: n }, () => Array(m).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      T[j][i] = M[i][j];
    }
  }
  return T;
}

function multiplyNN(A, B) {
  const m = A.length;
  const k = A[0].length;
  const n = B[0].length;
  const C = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) {
        s += A[i][t] * B[t][j];
      }
      C[i][j] = s;
    }
  }
  return C;
}

function multiplyNv(A, x) {
  const m = A.length;
  const n = A[0].length;
  const v = Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) {
      s += A[i][j] * x[j];
    }
    v[i] = s;
  }
  return v;
}
