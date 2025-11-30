import React, { useState } from 'react';
import { diagonalizeMatrix } from '../utils/diagonalization';
import './SolverPage.css';

const validateInput = (value) => {
  return /^-?\d*\.?\d*$|^-?\d+\/\d*$/.test(value);
};

function DiagonalizationPage() {
  const [size, setSize] = useState(2);
  const [matrix, setMatrix] = useState(
    Array(2).fill().map(() => Array(2).fill(''))
  );
  const [result, setResult] = useState(null);

  const handleSizeChange = (n) => {
    const k = n === 3 ? 3 : 2;
    setSize(k);
    setMatrix(
      Array(k).fill().map((_, i) =>
        Array(k).fill().map((_, j) => (matrix[i] && matrix[i][j]) || '')
      )
    );
    setResult(null);
  };

  const handleMatrixChange = (i, j, value) => {
    if (value === '' || validateInput(value)) {
      const newMat = [...matrix];
      newMat[i][j] = value;
      setMatrix(newMat);
    }
  };

  const handleDiagonalize = () => {
    const diagResult = diagonalizeMatrix(matrix);
    setResult(diagResult);
  };

  const renderNumber = (x) => {
    if (typeof x !== 'number' || isNaN(x)) return x;
    const rounded = Math.round(x * 10000) / 10000;
    return rounded.toString();
  };

  return (
    <div className="solver-page">
      <div className="page-header">
        <h1>🔄 Diagonalization</h1>
        <p>Cari P dan D sehingga A = P D P⁻¹ jika matriks dapat didiagonalisasi</p>
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

          <button className="solve-btn" onClick={handleDiagonalize}>
            Cek Diagonalization
          </button>
        </div>

        {result && (
          <div className="result-section">
            <h2>✅ Analisis Diagonalization</h2>

            {!result.supported && (
              <p>Untuk saat ini hanya mendukung matriks 2×2 dan 3×3.</p>
            )}

            {result.supported && (
              <>
                <div className="step-box">
                  <h3>Matriks A</h3>
                  <div className="matrix-display">
                    {result.A && result.A.map((row, i) => (
                      <div key={i} className="matrix-display-row">
                        {row.map((val, j) => (
                          <span key={j}>{renderNumber(val)}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="final-result">
                  <h2>📌 Status</h2>
                  {result.diagonalizable ? (
                    <p style={{ color: 'green', fontWeight: 'bold' }}>
                      Matriks dapat didiagonalisasi (diagonalizable).
                    </p>
                  ) : (
                    <>
                      <p style={{ color: 'orange', fontWeight: 'bold' }}>
                        Matriks tidak dapat didiagonalisasi.
                      </p>
                      {result.reason && <p>Alasan: {result.reason}</p>}
                    </>
                  )}
                </div>

                {result.diagonalizable && (
                  <>
                    <div className="step-box">
                      <h3>Eigenvalue & Eigenvector</h3>
                      <div className="matrix-display">
                        {result.eigenvalues.map((lambda, i) => (
                          <div key={i} className="matrix-display-row">
                            <span>
                              λ{i + 1} ≈ {renderNumber(lambda)} , v{i + 1} = (
                            </span>
                            {result.eigenvectors[i].map((x, j) => (
                              <span key={j}>
                                {renderNumber(x)}
                                {j < result.eigenvectors[i].length - 1 ? ', ' : ''}
                              </span>
                            ))}
                            <span>)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="step-box">
                      <h3>Matriks P (kolom = vektor eigen)</h3>
                      <div className="matrix-display">
                        {result.P && result.P.map((row, i) => (
                          <div key={i} className="matrix-display-row">
                            {row.map((val, j) => (
                              <span key={j}>{renderNumber(val)}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="step-box">
                      <h3>Matriks D (diagonal eigenvalue)</h3>
                      <div className="matrix-display">
                        {result.D && result.D.map((row, i) => (
                          <div key={i} className="matrix-display-row">
                            {row.map((val, j) => (
                              <span key={j}>{renderNumber(val)}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="step-box">
                      <h3>Matriks P⁻¹</h3>
                      <div className="matrix-display">
                        {result.P_inv && result.P_inv.map((row, i) => (
                          <div key={i} className="matrix-display-row">
                            {row.map((val, j) => (
                              <span key={j}>{renderNumber(val)}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="final-result">
                      <h2>📐 Relasi A = P D P⁻¹</h2>
                      <p>
                        Kolom-kolom P adalah vektor eigen, D berisi eigenvalue pada diagonal utama.
                        Secara teori berlaku A = P · D · P⁻¹.
                      </p>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DiagonalizationPage;
