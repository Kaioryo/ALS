import { Fraction } from './Fraction';

// Convert matrix of numbers to matrix of Fractions
export function toFractionMatrix(matrix) {
  return matrix.map(row => 
    row.map(val => Fraction.fromNumber(val))
  );
}

// Clone fraction matrix
export function cloneMatrix(matrix) {
  return matrix.map(row => row.map(frac => new Fraction(frac.num, frac.den)));
}

// Calculate rank
export function calculateRank(matrix) {
  let rank = 0;
  for (let i = 0; i < matrix.length; i++) {
    const hasNonZero = matrix[i].some(frac => !frac.isZero());
    if (hasNonZero) rank++;
  }
  return rank;
}

// Gauss-Jordan Elimination (RREF) dengan langkah
export function gaussJordan(inputMatrix, augmented = false) {
  const steps = [];
  let matrix = toFractionMatrix(inputMatrix);
  const rows = matrix.length;
  const cols = matrix[0].length;
  
  let currentRow = 0;

  for (let col = 0; col < cols && currentRow < rows; col++) {
    // Pivot
    let pivotRow = currentRow;
    for (let i = currentRow + 1; i < rows; i++) {
      if (Math.abs(matrix[i][col].toDecimal()) > Math.abs(matrix[pivotRow][col].toDecimal())) {
        pivotRow = i;
      }
    }

    if (matrix[pivotRow][col].isZero()) continue;

    // Swap
    if (pivotRow !== currentRow) {
      [matrix[currentRow], matrix[pivotRow]] = [matrix[pivotRow], matrix[currentRow]];
      steps.push({
        operation: `b${currentRow + 1} ↔ b${pivotRow + 1}`,
        matrix: cloneMatrix(matrix)
      });
    }

    // Scale pivot row to 1
    const pivot = matrix[currentRow][col];
    if (!pivot.isZero() && !(pivot.num === 1 && pivot.den === 1)) {
      const scale = new Fraction(1, 1).divide(pivot);
      for (let j = 0; j < cols; j++) {
        matrix[currentRow][j] = matrix[currentRow][j].multiply(scale);
      }
      steps.push({
        operation: `(${scale.toString()}) · b${currentRow + 1}`,
        matrix: cloneMatrix(matrix)
      });
    }

    // Eliminate other rows
    for (let i = 0; i < rows; i++) {
      if (i === currentRow) continue;
      const factor = matrix[i][col];
      if (!factor.isZero()) {
        const mult = factor.negate();
        for (let j = 0; j < cols; j++) {
          matrix[i][j] = matrix[i][j].add(matrix[currentRow][j].multiply(mult));
        }
        steps.push({
          operation: `${mult.toString() !== '-1' ? mult.toString() + ' · ' : '-'}b${currentRow + 1} + b${i + 1}`,
          matrix: cloneMatrix(matrix)
        });
      }
    }

    currentRow++;
  }

  return {
    steps,
    finalMatrix: matrix,
    rank: calculateRank(matrix)
  };
}

// SPL: Ax = b
export function analyzeSPL(matrixA, vectorB) {
  const augmented = matrixA.map((row, i) => [...row, vectorB[i]]);
  const result = gaussJordan(augmented, true);
  
  const rankA = calculateRank(result.finalMatrix.map(row => row.slice(0, -1)));
  const rankAugmented = result.rank;
  const n = matrixA[0].length;

  let solutionType;
  if (rankA < rankAugmented) {
    solutionType = 'Tidak ada solusi (inkonsisten)';
  } else if (rankA === n) {
    solutionType = 'Solusi unik';
  } else {
    solutionType = `Solusi tak hingga (${n - rankA} parameter bebas)`;
  }

  return {
    ...result,
    rankA,
    rankAugmented,
    solutionType
  };
}

// Determinan dengan langkah OBE
export function determinantWithSteps(matrixNum) {
  const n = matrixNum.length;
  if (n === 0 || matrixNum[0].length !== n) {
    return { det: null, steps: [] };
  }

  let mat = toFractionMatrix(matrixNum);
  const steps = [];
  let det = new Fraction(1, 1);
  let sign = 1;

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    while (pivotRow < n && mat[pivotRow][col].isZero()) {
      pivotRow++;
    }

    if (pivotRow === n) {
      steps.push({
        operation: `Semua elemen di kolom ${col + 1} dari baris ${col + 1} ke bawah nol → det(A) = 0`,
        matrix: cloneMatrix(mat)
      });
      return { det: new Fraction(0, 1), steps };
    }

    if (pivotRow !== col) {
      [mat[col], mat[pivotRow]] = [mat[pivotRow], mat[col]];
      sign *= -1;
      steps.push({
        operation: `b${col + 1} ↔ b${pivotRow + 1} (det dikali -1)`,
        matrix: cloneMatrix(mat)
      });
    }

    const pivot = mat[col][col];
    det = det.multiply(pivot);

    for (let i = col + 1; i < n; i++) {
      if (!mat[i][col].isZero()) {
        const factor = mat[i][col].divide(pivot);
        const mult = factor.negate();
        for (let j = col; j < n; j++) {
          mat[i][j] = mat[i][j].add(mat[col][j].multiply(mult));
        }
        steps.push({
          operation: `${mult.toString()} · b${col + 1} + b${i + 1}`,
          matrix: cloneMatrix(mat)
        });
      }
    }
  }

  if (sign === -1) det = det.negate();
  det.simplify();

  steps.push({
    operation: 'det(A) = hasil kali elemen diagonal utama',
    matrix: cloneMatrix(mat)
  });

  return { det, steps };
}

// Determinan cepat (tanpa langkah)
export function determinant(matrixNum) {
  const { det } = determinantWithSteps(matrixNum);
  return det;
}

// Invers dengan langkah OBE pada [A | I]
export function inverseWithSteps(matrixNum) {
  const n = matrixNum.length;
  if (n === 0 || matrixNum[0].length !== n) return { inv: null, steps: [] };

  let left = toFractionMatrix(matrixNum);
  let right = toFractionMatrix(identityMatrix(n));
  const rows = n;
  const cols = n;
  const steps = [];

  for (let col = 0, currentRow = 0; col < cols && currentRow < rows; col++) {
    // Cari pivot
    let pivotRow = currentRow;
    for (let i = currentRow + 1; i < rows; i++) {
      if (Math.abs(left[i][col].toDecimal()) > Math.abs(left[pivotRow][col].toDecimal())) {
        pivotRow = i;
      }
    }

    if (left[pivotRow][col].isZero()) continue;

    // Swap baris
    if (pivotRow !== currentRow) {
      [left[currentRow], left[pivotRow]] = [left[pivotRow], left[currentRow]];
      [right[currentRow], right[pivotRow]] = [right[pivotRow], right[currentRow]];
      steps.push({
        operation: `b${currentRow + 1} ↔ b${pivotRow + 1}`,
        left: cloneMatrix(left),
        right: cloneMatrix(right)
      });
    }

    // Skala supaya pivot = 1
    const pivot = left[currentRow][col];
    if (!pivot.isZero() && !(pivot.num === 1 && pivot.den === 1)) {
      const scale = new Fraction(1, 1).divide(pivot);
      for (let j = 0; j < cols; j++) {
        left[currentRow][j] = left[currentRow][j].multiply(scale);
        right[currentRow][j] = right[currentRow][j].multiply(scale);
      }
      steps.push({
        operation: `(${scale.toString()}) · b${currentRow + 1}`,
        left: cloneMatrix(left),
        right: cloneMatrix(right)
      });
    }

    // Eliminasi kolom lain
    for (let i = 0; i < rows; i++) {
      if (i === currentRow) continue;
      const factor = left[i][col];
      if (!factor.isZero()) {
        const mult = factor.negate();
        for (let j = 0; j < cols; j++) {
          left[i][j] = left[i][j].add(left[currentRow][j].multiply(mult));
          right[i][j] = right[i][j].add(right[currentRow][j].multiply(mult));
        }
        steps.push({
          operation: `${mult.toString() !== '-1' ? mult.toString() + ' · ' : '-'}b${currentRow + 1} + b${i + 1}`,
          left: cloneMatrix(left),
          right: cloneMatrix(right)
        });
      }
    }

    currentRow++;
  }

  // Cek apakah left sudah identitas
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) {
        if (left[i][j].isZero() || !(left[i][j].num === 1 && left[i][j].den === 1)) {
          return { inv: null, steps };
        }
      } else {
        if (!left[i][j].isZero()) {
          return { inv: null, steps };
        }
      }
    }
  }

  return { inv: right, steps };
}

// Invers cepat tanpa langkah (kalau diperlukan)
export function inverseMatrix(matrixNum) {
  const { inv } = inverseWithSteps(matrixNum);
  return inv;
}

export function identityMatrix(n) {
  const I = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) {
      row.push(i === j ? 1 : 0);
    }
    I.push(row);
  }
  return I;
}
