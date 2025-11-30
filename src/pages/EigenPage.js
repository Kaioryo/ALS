import React, { useState } from 'react';
import { eigenvalues2x2, eigenvalues3x3, eigenvectorsForEigenvalue } from '../utils/eigen';
import { parseScalar } from '../utils/subspace'; // sudah ada di subspace.js
import './SolverPage.css';

function EigenPage() {
  const [size, setSize] = useState(2); // 2 atau 3
  const [matrix, setMatrix] = useState(
    Array(2).fill().map(() => Array(2).fill(''))
  );
  const [selectedLambda, setSelectedLambda] = useState(null);
  const [result, setResult] = useState(null);
  const [evResult, setEvResult] = useState(null);

  const validateInput = (value) => {
    return /^-?\d*\.?\d*$|^-?\d+\/\d*$/.test(value);
  };

  const handleMatrixChange = (i, j, value) => {
    if (value === '' || validateInput(value)) {
      const newMat = [...matrix];
      newMat[i][j] = value;
      setMatrix(newMat);
    }
  };

  const handleSizeChange = (n) => {
    const k = n === 3 ? 3 : 2;
    setSize(k);
    setMatrix(
      Array(k).fill().map((_, i) =>
        Array(k).fill().map((_, j) => (matrix[i] && matrix[i][j]) || '')
      )
    );
    setResult(null);
    setEvResult(null);
    setSelectedLambda(null);
  };

  const handleComputeEigenvalues = () => {
    const numMatrix = matrix.map(row => row.map(parseScalar));

    let lambdas = [];
    if (size === 2) {
      lambdas = eigenvalues2x2(numMatrix);
    } else if (size === 3) {
      lambdas = eigenvalues3x3(numMatrix);
    }

    setResult({
      matrix: numMatrix,
      eigenvalues: lambdas
    });
    setEvResult(null);
    setSelectedLambda(null);
  };

  const handleComputeEigenvectors = (lambda) => {
    const numMatrix = matrix.map(row => row.map(parseScalar));
    const ev = eigenvectorsForEigenvalue(numMatrix, lambda);
    setSelectedLambda(lambda);
    setEvResult(ev);
  };

  return (
    <div className="solver-page">
      <div className="page-header">
        <h1>🧩 Eigenvalue & Eigenvector</h1>
        <p>Hitung nilai eigen dan vektor eigen untuk matriks 2×2 dan 3×3</p>
      </div>

      <div className="solver-container-vertical">
        <div className="input-section">
          <h3>Input Matriks Persegi</h3>

          <div className="controls">
            <label>
              Ordo:
              <select
                value={size}
                onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              >
                <option value={2}>2 × 2</option>
                <option value={3}>3 × 3</option>
              </select>
            </label>
          </div>

          <div className="matrix-input-section">
            <h4>Matriks A</h4>
            <div className="matrix-grid-container">
              {matrix.map((row, i) => (
                <div key={i} className="matrix-input-row">
                  {row.map((val, j) => (
                    <input
                      key={`${i}-${j}`}
                      type="text"
                      placeholder="0"
                      value={val}
                      onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                      className="matrix-cell-input"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button className="solve-btn" onClick={handleComputeEigenvalues}>
            Hitung Eigenvalue
          </button>
        </div>

        {result && (
          <div className="result-section">
            <h2>✅ Eigenvalue Matriks A</h2>

            <div className="step-box">
              <h3>Matriks A</h3>
              <div className="matrix-display">
                {result.matrix.map((row, i) => (
                  <div key={i} className="matrix-display-row">
                    {row.map((val, j) => (
                      <span key={j}>{val}</span>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="final-result">
              <h2>📌 Nilai Eigen (λ)</h2>
              {result.eigenvalues.length === 0 ? (
                <p>Tidak ditemukan eigenvalue real (atau ordo tidak didukung).</p>
              ) : (
                <>
                  <div className="matrix-display">
                    {result.eigenvalues.map((lambda, i) => (
                      <div key={i} className="matrix-display-row">
                        <span>
                          λ{i + 1} ≈ <strong>{lambda.toFixed(4)}</strong>
                        </span>
                        <button
                          className="small-btn"
                          style={{ marginLeft: '12px' }}
                          onClick={() => handleComputeEigenvectors(lambda)}
                        >
                          Cari Eigenvector untuk λ{i + 1}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {evResult && (
              <>
                <h2 style={{ marginTop: '2rem' }}>📐 Eigenvector untuk λ ≈ {selectedLambda.toFixed(4)}</h2>

                <div className="step-box">
                  <h3>RREF(A − λI)</h3>
                  <div className="matrix-display">
                    {evResult.rref && evResult.rref.map((row, i) => (
                      <div key={i} className="matrix-display-row">
                        {row.map((frac, j) => (
                          <span key={j}>{frac.toString()}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="final-result">
                  <h3>Basis Ruang Null (Vektor Eigen)</h3>
                  {evResult.basis && evResult.basis.length > 0 ? (
                    <div className="matrix-display">
                      {evResult.basis.map((vec, i) => (
                        <div key={i} className="matrix-display-row">
                          <span>v{i + 1} = (</span>
                          {vec.map((x, j) => (
                            <span key={j}>
                              {x.toFixed ? x.toFixed(4) : x}
                              {j < vec.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                          <span>)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>Tidak ditemukan vektor eigen non-nol (kemungkinan kesalahan numerik).</p>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EigenPage;
