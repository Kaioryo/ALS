import { gaussJordan } from './rowEchelon';

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

// Cek independensi linear: vectors diatur sebagai baris dalam matriks
// Linear independent jika rank = jumlah vektor
export function checkLinearIndependence(vectors) {
  if (vectors.length === 0) return { independent: true, rank: 0, rref: null, steps: [] };
  
  // Buat matriks dengan vektor sebagai baris
  const matrix = vectors.map(v => v.map(val => parseScalar(val)));
  const result = gaussJordan(matrix);
  
  // Hitung jumlah baris tak nol
  const rank = result.rank;
  const numVectors = vectors.length;
  
  return {
    independent: rank === numVectors,
    rank,
    numVectors,
    rref: result.finalMatrix,
    steps: result.steps
  };
}

// Cari basis dari span vectors (ambil baris tak nol dari RREF)
export function findBasis(vectors) {
  if (vectors.length === 0) return { basis: [], dimension: 0, rref: null, steps: [] };
  
  const matrix = vectors.map(v => v.map(val => parseScalar(val)));
  const result = gaussJordan(matrix);
  
  // Basis = baris tak nol dari RREF
  const basis = [];
  const basisIndices = [];
  
  result.finalMatrix.forEach((row, idx) => {
    const hasNonZero = row.some(frac => !frac.isZero());
    if (hasNonZero) {
      basis.push(row);
      basisIndices.push(idx);
    }
  });
  
  return {
    basis,
    basisIndices,
    dimension: basis.length,
    rank: result.rank,
    rref: result.finalMatrix,
    steps: result.steps
  };
}

// Cek apakah vectors span Rⁿ (rank harus = n, dimensi ruang)
export function checkSpansRn(vectors) {
  if (vectors.length === 0) return { spans: false, dimension: 0, rank: 0 };
  
  const n = vectors[0].length; // dimensi ruang
  const matrix = vectors.map(v => v.map(val => parseScalar(val)));
  const result = gaussJordan(matrix);
  
  return {
    spans: result.rank === n,
    dimension: n,
    rank: result.rank,
    rref: result.finalMatrix
  };
}
