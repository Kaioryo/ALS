import { toFractionMatrix, gaussJordan } from './rowEchelon';

// Konversi number-matrix ke Fraction-matrix (ulang di sini untuk kemandirian)
function toFrac(mat) {
  return toFractionMatrix(mat);
}

// Hitung eigenvalue matriks 2x2 secara eksak (pakai rumus kuadrat)
export function eigenvalues2x2(matrixNum) {
  if (matrixNum.length !== 2 || matrixNum[0].length !== 2) return [];

  const a = matrixNum[0][0];
  const b = matrixNum[0][1];
  const c = matrixNum[1][0];
  const d = matrixNum[1][1];

  // karakteristik: λ^2 - (a + d)λ + (ad - bc) = 0
  const trace = a + d;
  const det = a * d - b * c;
  const discriminant = trace * trace - 4 * det;

  if (discriminant < 0) {
    // Untuk sekarang, hanya real eigenvalue
    return [];
  }

  const sqrtDisc = Math.sqrt(discriminant);
  const lambda1 = (trace + sqrtDisc) / 2;
  const lambda2 = (trace - sqrtDisc) / 2;

  return [lambda1, lambda2];
}

// Hitung eigenvalue matriks 3x3 dengan pendekatan numerik (iterasi QR sederhana)
export function eigenvalues3x3(matrixNum, iterations = 50) {
  if (matrixNum.length !== 3 || matrixNum[0].length !== 3) return [];

  // Copy matrix
  let A = matrixNum.map(row => row.map(x => x));

  const n = 3;

  for (let iter = 0; iter < iterations; iter++) {
    // QR decomposition sederhana via Gram-Schmidt (numeric)
    const { Q, R } = qrDecomposition(A);
    // A_{k+1} = R Q
    A = multiplyMatrices(R, Q);
  }

  // Eigenvalue ≈ diagonal A
  const lambdas = [];
  for (let i = 0; i < n; i++) {
    lambdas.push(A[i][i]);
  }
  return lambdas;
}

// QR decomposition via Gram-Schmidt (numeric, 3x3)
function qrDecomposition(A) {
  const n = A.length;
  // Ambil kolom
  const a = [];
  for (let j = 0; j < n; j++) {
    a[j] = [];
    for (let i = 0; i < n; i++) {
      a[j][i] = A[i][j];
    }
  }

  const q = [];
  const r = Array.from({ length: n }, () => Array(n).fill(0));

  for (let k = 0; k < n; k++) {
    // v_k = a_k - sum_{j<k} r_{jk} q_j
    let v = a[k].slice();
    for (let j = 0; j < k; j++) {
      const rjk = dot(q[j], a[k]);
      r[j][k] = rjk;
      v = subtract(v, scale(q[j], rjk));
    }
    const normV = Math.sqrt(dot(v, v));
    if (normV === 0) {
      q[k] = Array(n).fill(0);
    } else {
      q[k] = scale(v, 1 / normV);
    }
    r[k][k] = normV;
  }

  // Bentuk Q dan R sebagai matriks
  const Q = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      Q[i][j] = q[j][i]; // kolom q_j
    }
  }
  return { Q, R: r };
}

function dot(u, v) {
  return u.reduce((s, ui, i) => s + ui * v[i], 0);
}
function scale(u, k) {
  return u.map(x => x * k);
}
function subtract(u, v) {
  return u.map((x, i) => x - v[i]);
}
function multiplyMatrices(A, B) {
  const m = A.length;
  const n = B[0].length;
  const p = B.length;
  const C = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < p; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

// Cari eigenvector untuk eigenvalue λ dengan menyelesaikan (A - λI)x = 0 via gaussJordan
export function eigenvectorsForEigenvalue(matrixNum, lambda) {
  const n = matrixNum.length;
  if (n === 0 || matrixNum[0].length !== n) return { rref: null, steps: [], basis: [] };

  // A - λI
  const shifted = matrixNum.map((row, i) =>
    row.map((val, j) => (i === j ? val - lambda : val))
  );

  const result = gaussJordan(shifted);
  const rref = result.finalMatrix;

  // Cari basis ruang null dari (A - λI) dari RREF dengan parameter bebas.
  // Untuk kesederhanaan, ambil vektor-vektor basis secara numerik:
  const basis = nullSpaceFromRREF(rref);

  return {
    rref,
    steps: result.steps,
    basis
  };
}

// Dapatkan basis nullspace (numeric approx) dari RREF (matrix Fraction)
function nullSpaceFromRREF(rref) {
  const rows = rref.length;
  const cols = rref[0].length;

  const isPivotCol = Array(cols).fill(false);
  const pivotRowForCol = Array(cols).fill(-1);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const val = rref[i][j];
      if (!val.isZero()) {
        if (val.num === 1 && val.den === 1) {
          isPivotCol[j] = true;
          pivotRowForCol[j] = i;
          break;
        } else {
          break;
        }
      }
    }
  }

  const freeCols = [];
  for (let j = 0; j < cols; j++) {
    if (!isPivotCol[j]) freeCols.push(j);
  }

  const basis = [];

  freeCols.forEach(freeCol => {
    // Buat satu vektor basis untuk parameter bebas ini
    const vec = Array(cols).fill(0);
    vec[freeCol] = 1;

    for (let j = 0; j < cols; j++) {
      if (isPivotCol[j]) {
        const i = pivotRowForCol[j];
        const coeff = rref[i][freeCol];
        if (!coeff.isZero()) {
          // x_j = -coeff * parameter
          vec[j] = -coeff.toDecimal();
        }
      }
    }
    basis.push(vec);
  });

  return basis;
}
