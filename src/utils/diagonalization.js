import { parseScalar } from './subspace';
import { eigenvalues2x2, eigenvalues3x3, eigenvectorsForEigenvalue } from './eigen';
import { inverseMatrix } from './rowEchelon';

// Cek diagonalization dan bentuk P, D (hanya real, ordo 2 atau 3)
export function diagonalizeMatrix(matrixStr) {
  const n = matrixStr.length;
  if (n !== matrixStr[0].length || (n !== 2 && n !== 3)) {
    return { supported: false };
  }

  // Konversi ke number
  const A = matrixStr.map(row => row.map(parseScalar));

  // 1) Cari eigenvalue
  let lambdas = [];
  if (n === 2) {
    lambdas = eigenvalues2x2(A);
  } else {
    lambdas = eigenvalues3x3(A);
  }

  if (!lambdas || lambdas.length === 0) {
    return {
      supported: true,
      diagonalizable: false,
      reason: 'Tidak ada eigenvalue real yang terdeteksi.'
    };
  }

  // 2) Kelompokkan eigenvalue (handle multiplicity approx)
  const groups = groupEigenvalues(lambdas);

  // 3) Untuk setiap eigenvalue, cari basis eigenvector
  const eigenvectors = [];
  const eigenvaluesExpanded = [];

  groups.forEach(g => {
    const lambda = g.rep;
    const ev = eigenvectorsForEigenvalue(A, lambda);
    const basis = ev.basis || [];
    basis.forEach(vec => {
      eigenvaluesExpanded.push(lambda);
      eigenvectors.push(vec);
    });
  });

  const rankEigenvectors = eigenvectors.length;

  if (rankEigenvectors < n) {
    // Tidak cukup vektor eigen → tidak diagonalizable
    return {
      supported: true,
      diagonalizable: false,
      reason: `Jumlah vektor eigen hanya ${rankEigenvectors}, kurang dari ordo matriks ${n}.`,
      eigenvalues: lambdas,
      eigenvectorsRaw: eigenvectors
    };
  }

  // 4) Bentuk P dari n vektor eigen pertama sebagai kolom
  const P = Array.from({ length: n }, () => Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    const v = eigenvectors[j];
    for (let i = 0; i < n; i++) {
      P[i][j] = v[i];
    }
  }

  // 5) Hitung invers P via rowEchelon.inverseMatrix (fraction-based)
  const P_invFrac = inverseMatrix(P);
  if (!P_invFrac) {
    return {
      supported: true,
      diagonalizable: false,
      reason: 'Matriks vektor eigen tidak invertible (det(P) = 0).',
      eigenvalues: lambdas,
      eigenvectorsRaw: eigenvectors
    };
  }

  const P_inv = P_invFrac.map(row => row.map(frac => frac.toDecimal()));
  const D = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? eigenvaluesExpanded[i] : 0))
  );

  return {
    supported: true,
    diagonalizable: true,
    A,
    P,
    D,
    P_inv,
    eigenvalues: eigenvaluesExpanded,
    eigenvectors,
    groups
  };
}

// Kelompokkan eigenvalue yang hampir sama (untuk handle duplikat numerik)
function groupEigenvalues(lambdas, tol = 1e-5) {
  const groups = [];
  lambdas.forEach(l => {
    let found = false;
    for (const g of groups) {
      if (Math.abs(g.rep - l) < tol) {
        g.values.push(l);
        found = true;
        break;
      }
    }
    if (!found) {
      groups.push({ rep: l, values: [l] });
    }
  });
  return groups;
}
