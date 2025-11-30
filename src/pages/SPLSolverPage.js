import React, { useState } from 'react';
import { 
  gaussJordan, 
  analyzeSPL, 
  determinantWithSteps, 
  inverseWithSteps 
} from '../utils/rowEchelon';
import './SolverPage.css';

function SPLSolverPage() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [mode, setMode] = useState('rref');
  const [matrix, setMatrix] = useState(Array(3).fill().map(() => Array(4).fill('')));
  const [vectorB, setVectorB] = useState(Array(3).fill(''));
  const [result, setResult] = useState(null);

  const clamp = (value, min, max) => {
    if (Number.isNaN(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const validateInput = (value) => {
    return /^-?\d*\.?\d*$|^-?\d+\/\d*$/.test(value);
  };

  const handleMatrixChange = (i, j, value) => {
    if (value === '' || validateInput(value)) {
      const newMatrix = [...matrix];
      newMatrix[i][j] = value;
      setMatrix(newMatrix);
    }
  };

  const handleVectorChange = (i, value) => {
    if (value === '' || validateInput(value)) {
      const newVector = [...vectorB];
      newVector[i] = value;
      setVectorB(newVector);
    }
  };

  const handleRowsChange = (newRows) => {
    const clamped = clamp(newRows, 2, 6);
    setRows(clamped);
    const newMatrix = Array(clamped).fill().map((_, i) => 
      matrix[i] ? matrix[i].slice(0, cols) : Array(cols).fill('')
    );
    setMatrix(newMatrix);
    setVectorB(Array(clamped).fill(''));
  };

  const handleColsChange = (newCols) => {
    const clamped = clamp(newCols, 2, 6);
    setCols(clamped);
    const newMatrix = matrix.map(row => {
      const newRow = Array(clamped).fill('');
      for (let j = 0; j < Math.min(row.length, clamped); j++) {
        newRow[j] = row[j];
      }
      return newRow;
    });
    setMatrix(newMatrix);
  };

  const incRows = () => handleRowsChange(rows + 1);
  const decRows = () => handleRowsChange(rows - 1);

  const incCols = () => handleColsChange(cols + 1);
  const decCols = () => handleColsChange(cols - 1);

  const parseValue = (val) => {
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
  };

  const handleSolve = () => {
    const numMatrix = matrix.map(row => row.map(val => parseValue(val)));

    if (mode === 'spl') {
      const numVector = vectorB.map(val => parseValue(val));
      const solution = analyzeSPL(numMatrix, numVector);
      setResult({ type: 'spl', ...solution });
    } else if (mode === 'rref') {
      const solution = gaussJordan(numMatrix);
      setResult({ type: 'rref', ...solution });
    } else if (mode === 'det') {
      const { det, steps } = determinantWithSteps(numMatrix);
      setResult({ type: 'det', det, stepsDet: steps });
    } else if (mode === 'inv') {
      const { inv, steps } = inverseWithSteps(numMatrix);
      setResult({ type: 'inv', inv, stepsInv: steps });
    } else if (mode === 'basis') {
      const rref = gaussJordan(numMatrix);
      const rowBasis = rref.finalMatrix.filter(row => 
        row.some(frac => !frac.isZero())
      );

      const pivotCols = [];
      const r = rref.finalMatrix.length;
      const c = rref.finalMatrix[0].length;
      for (let j = 0; j < c; j++) {
        let pivotRowIndex = -1;
        let isPivotCol = true;
        for (let i = 0; i < r; i++) {
          const val = rref.finalMatrix[i][j];
          if (!val.isZero()) {
            if (pivotRowIndex === -1 && val.num === 1 && val.den === 1) {
              pivotRowIndex = i;
            } else {
              isPivotCol = false;
              break;
            }
          }
        }
        if (pivotRowIndex !== -1 && isPivotCol) {
          pivotCols.push(j);
        }
      }

      const colBasis = pivotCols.map(colIndex =>
        numMatrix.map(row => row[colIndex])
      );

      setResult({
        type: 'basis',
        rref,
        rowBasis,
        colBasis,
        pivotCols
      });
    }
  };

  return (
    <div className="solver-page">
      <div className="page-header">
        <h1>🔢 SPL & Matrix Solver</h1>
        <p>Operasi Baris Elementer (OBE) dengan langkah detail</p>
      </div>

      <div className="solver-container-vertical">
        <div className="input-section">
          <h3>Input Matriks</h3>

          <div className="controls">
            <label>
              Baris:
              <div className="number-spinner">
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={decRows}
                >
                  −
                </button>
                <input
                  type="number"
                  value={rows}
                  onChange={(e) => handleRowsChange(parseInt(e.target.value, 10) || 2)}
                  min="2"
                  max="6"
                />
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={incRows}
                >
                  +
                </button>
              </div>
            </label>

            <label>
              Kolom:
              <div className="number-spinner">
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={decCols}
                >
                  −
                </button>
                <input
                  type="number"
                  value={cols}
                  onChange={(e) => handleColsChange(parseInt(e.target.value, 10) || 2)}
                  min="2"
                  max="6"
                />
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={incCols}
                >
                  +
                </button>
              </div>
            </label>

            <label>
              Mode:
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="rref">Bentuk Eselon Tereduksi</option>
                <option value="spl">Sistem Persamaan Linear (SPL)</option>
                <option value="det">Determinan (det A)</option>
                <option value="inv">Invers Matriks (A⁻¹)</option>
                <option value="basis">Basis Baris & Kolom</option>
              </select>
            </label>
          </div>

          <div className="matrix-input-section">
            <h4>{mode === 'spl' ? 'Matriks (A | b)' : 'Matriks A'}</h4>
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
                  {mode === 'spl' && (
                    <>
                      <span className="separator">|</span>
                      <input
                        type="text"
                        placeholder="0"
                        value={vectorB[i]}
                        onChange={(e) => handleVectorChange(i, e.target.value)}
                        className="matrix-cell-input vector-cell"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="solve-btn" onClick={handleSolve}>
            Lakukan OBE
          </button>
        </div>

        {result && (
          <div className="result-section">
            <h2>✅ Langkah-Langkah OBE</h2>

            {(result.type === 'rref' || result.type === 'spl' || result.type === 'basis' || result.type === 'det' || result.type === 'inv') && (
              <>
                <div className="step-box">
                  <h3>Matriks Awal</h3>
                  <div className="matrix-display">
                    {matrix.map((row, i) => (
                      <div key={i} className="matrix-display-row">
                        {row.map((val, j) => (
                          <span key={j}>{val || '0'}</span>
                        ))}
                        {mode === 'spl' && (
                          <>
                            <span className="sep">|</span>
                            <span>{vectorB[i] || '0'}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {result.steps && result.steps.map((step, index) => (
                  <div key={index} className="step-box">
                    <h3>Langkah {index + 1}: {step.operation}</h3>
                    <div className="matrix-display">
                      {step.matrix.map((row, i) => (
                        <div key={i} className="matrix-display-row">
                          {row.map((frac, j) => (
                            <span key={j}>{frac.toString()}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {result.type === 'det' && result.stepsDet && result.stepsDet.map((step, index) => (
                  <div key={`det-${index}`} className="step-box">
                    <h3>Langkah Det {index + 1}: {step.operation}</h3>
                    <div className="matrix-display">
                      {step.matrix.map((row, i) => (
                        <div key={i} className="matrix-display-row">
                          {row.map((frac, j) => (
                            <span key={j}>{frac.toString()}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {result.type === 'inv' && result.stepsInv && result.stepsInv.map((step, index) => (
                  <div key={`inv-${index}`} className="step-box">
                    <h3>Langkah Invers {index + 1}: {step.operation}</h3>
                    <div className="matrix-display">
                      {step.left.map((row, i) => (
                        <div key={i} className="matrix-display-row">
                          {row.map((frac, j) => (
                            <span key={j}>{frac.toString()}</span>
                          ))}
                          <span className="sep">|</span>
                          {step.right[i].map((frac, j) => (
                            <span key={`r-${j}`}>{frac.toString()}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            <div className="final-result">
              {result.type === 'rref' && (
                <>
                  <h2>📐 Hasil Akhir (RREF)</h2>
                  <div className="matrix-display">
                    {result.finalMatrix.map((row, i) => (
                      <div key={i} className="matrix-display-row">
                        {row.map((frac, j) => (
                          <span key={j}>{frac.toString()}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {result.type === 'spl' && (
                <>
                  <h2>📐 Hasil RREF & Informasi SPL</h2>
                  <div className="matrix-display">
                    {result.finalMatrix.map((row, i) => (
                      <div key={i} className="matrix-display-row">
                        {row.map((frac, j) => (
                          <span key={j}>{frac.toString()}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="solution-info">
                    <p><strong>Rank(A):</strong> {result.rankA}</p>
                    <p><strong>Rank(A|b):</strong> {result.rankAugmented}</p>
                    <p><strong>Jenis Solusi:</strong> {result.solutionType}</p>
                  </div>
                </>
              )}

              {result.type === 'det' && (
                <>
                  <h2>📐 Determinan Matriks</h2>
                  <p style={{ fontSize: '1.2rem' }}>
                    det(A) = <strong>{result.det ? result.det.toString() : 'Tidak terdefinisi'}</strong>
                  </p>
                </>
              )}

              {result.type === 'inv' && (
                <>
                  <h2>📐 Invers Matriks A⁻¹</h2>
                  {result.inv ? (
                    <div className="matrix-display">
                      {result.inv.map((row, i) => (
                        <div key={i} className="matrix-display-row">
                          {row.map((frac, j) => (
                            <span key={j}>{frac.toString()}</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ fontSize: '1.1rem' }}>
                      Matriks <strong>tidak memiliki invers</strong> (singular).
                    </p>
                  )}
                </>
              )}

              {result.type === 'basis' && (
                <>
                  <h2>📐 Basis Baris & Kolom</h2>

                  <h3>RREF(A)</h3>
                  <div className="matrix-display">
                    {result.rref.finalMatrix.map((row, i) => (
                      <div key={i} className="matrix-display-row">
                        {row.map((frac, j) => (
                          <span key={j}>{frac.toString()}</span>
                        ))}
                      </div>
                    ))}
                  </div>

                  <h3 style={{ marginTop: '1.5rem' }}>Basis Ruang Baris</h3>
                  <div className="matrix-display">
                    {result.rowBasis.map((row, i) => (
                      <div key={i} className="matrix-display-row">
                        {row.map((frac, j) => (
                          <span key={j}>{frac.toString()}</span>
                        ))}
                      </div>
                    ))}
                  </div>

                  <h3 style={{ marginTop: '1.5rem' }}>Basis Ruang Kolom</h3>
                  <p>Pivot kolom: {result.pivotCols.map(i => i + 1).join(', ')}</p>
                  <div className="matrix-display">
                    {result.colBasis.map((colVec, i) => (
                      <div key={i} className="matrix-display-row">
                        {colVec.map((val, j) => (
                          <span key={j}>{val}</span>
                        ))}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SPLSolverPage;
