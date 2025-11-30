import React, { useState } from 'react';
import { checkLinearIndependence, findBasis, checkSpansRn } from '../utils/subspace';
import './SolverPage.css';

function SubspacePage() {
  const [numVectors, setNumVectors] = useState(3);
  const [dimension, setDimension] = useState(3);
  const [vectors, setVectors] = useState(
    Array(3).fill().map(() => Array(3).fill(''))
  );
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

  const handleVectorChange = (i, j, value) => {
    if (value === '' || validateInput(value)) {
      const newVectors = [...vectors];
      newVectors[i][j] = value;
      setVectors(newVectors);
    }
  };

  const applyNumVectorsChange = (num) => {
    const n = clamp(num, 1, 6);
    setNumVectors(n);
    setVectors(
      Array(n).fill().map((_, i) =>
        vectors[i] ? vectors[i].slice(0, dimension) : Array(dimension).fill('')
      )
    );
    setResult(null);
  };

  const handleNumVectorsChange = (num) => {
    if (isNaN(num)) return;
    applyNumVectorsChange(num);
  };

  const incNumVectors = () => applyNumVectorsChange(numVectors + 1);
  const decNumVectors = () => applyNumVectorsChange(numVectors - 1);

  const applyDimensionChange = (dim) => {
    const d = clamp(dim, 1, 6);
    setDimension(d);
    setVectors(
      Array(numVectors).fill().map((_, i) =>
        Array(d).fill().map((_, j) => (vectors[i] && vectors[i][j]) || '')
      )
    );
    setResult(null);
  };

  const handleDimensionChange = (dim) => {
    if (isNaN(dim)) return;
    applyDimensionChange(dim);
  };

  const incDimension = () => applyDimensionChange(dimension + 1);
  const decDimension = () => applyDimensionChange(dimension - 1);

  const handleCompute = () => {
    const independence = checkLinearIndependence(vectors);
    const basis = findBasis(vectors);
    const spansRn = checkSpansRn(vectors);

    setResult({
      independence,
      basis,
      spansRn
    });
  };

  return (
    <div className="solver-page">
      <div className="page-header">
        <h1>🧮 Subspace</h1>
        <p>Cek independensi linear, basis, dan dimensi subspace</p>
      </div>

      <div className="solver-container-vertical">
        <div className="input-section">
          <h3>Input Vektor-Vektor</h3>

          <div className="controls">
            <label>
              Jumlah Vektor:
              <div className="number-spinner">
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={decNumVectors}
                >
                  −
                </button>
                <input
                  type="number"
                  value={numVectors}
                  min="1"
                  max="6"
                  onChange={(e) =>
                    handleNumVectorsChange(parseInt(e.target.value, 10) || 1)
                  }
                />
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={incNumVectors}
                >
                  +
                </button>
              </div>
            </label>

            <label>
              Dimensi (Rⁿ):
              <div className="number-spinner">
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={decDimension}
                >
                  −
                </button>
                <input
                  type="number"
                  value={dimension}
                  min="1"
                  max="6"
                  onChange={(e) =>
                    handleDimensionChange(parseInt(e.target.value, 10) || 1)
                  }
                />
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={incDimension}
                >
                  +
                </button>
              </div>
            </label>
          </div>

          <div className="matrix-input-section">
            <h4>Masukkan Vektor (setiap baris = satu vektor)</h4>
            <div className="matrix-grid-container">
              {vectors.map((vector, i) => (
                <div key={i} className="matrix-input-row">
                  {vector.map((val, j) => (
                    <input
                      key={`${i}-${j}`}
                      type="text"
                      placeholder={j === 0 ? `v${i + 1}[1]` : `v${i + 1}[${j + 1}]`}
                      value={val}
                      onChange={(e) => handleVectorChange(i, j, e.target.value)}
                      className="matrix-cell-input"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button className="solve-btn" onClick={handleCompute}>
            Analisis Subspace
          </button>
        </div>

        {result && (
          <div className="result-section">
            <h2>✅ Hasil Analisis</h2>

            <div className="step-box">
              <h3>Vektor-Vektor Input</h3>
              <div className="matrix-display">
                {vectors.map((v, i) => (
                  <div key={i} className="matrix-display-row">
                    <span style={{ marginRight: '8px' }}>v{i + 1} =</span>
                    <span>(</span>
                    {v.map((val, j) => (
                      <span key={j}>
                        {val || '0'}
                        {j < v.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                    <span>)</span>
                  </div>
                ))}
              </div>
            </div>

            {result.independence.steps && result.independence.steps.length > 0 && (
              <>
                <h2 style={{ marginTop: '2rem' }}>🔄 Langkah-Langkah RREF</h2>
                {result.independence.steps.map((step, index) => (
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
              </>
            )}

            <div className="final-result">
              <h2>📊 Independensi Linear</h2>
              <div className="solution-info">
                <p>
                  <strong>Status:</strong>{' '}
                  {result.independence.independent ? (
                    <span style={{ color: 'green' }}>Linear Independen ✓</span>
                  ) : (
                    <span style={{ color: 'orange' }}>Linear Dependen</span>
                  )}
                </p>
                <p>
                  <strong>Rank:</strong> {result.independence.rank}
                </p>
                <p>
                  <strong>Jumlah Vektor:</strong> {result.independence.numVectors}
                </p>
              </div>

              <h2 style={{ marginTop: '2rem' }}>📐 Basis dan Dimensi</h2>
              <div className="solution-info">
                <p>
                  <strong>Dimensi Subspace:</strong> {result.basis.dimension}
                </p>
                <p>
                  <strong>Basis dari Span(v₁, v₂, ...):</strong>
                </p>
              </div>

              {result.basis.basis.length > 0 ? (
                <div className="matrix-display">
                  {result.basis.basis.map((row, i) => (
                    <div key={i} className="matrix-display-row">
                      <span style={{ marginRight: '8px' }}>b{i + 1} =</span>
                      <span>(</span>
                      {row.map((frac, j) => (
                        <span key={j}>
                          {frac.toString()}
                          {j < row.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                      <span>)</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Basis kosong (vektor nol semua).</p>
              )}

              <h2 style={{ marginTop: '2rem' }}>🌐 Span R<sup>{dimension}</sup>?</h2>
              <div className="solution-info">
                <p>
                  <strong>Apakah span vektor = R<sup>{dimension}</sup>:</strong>{' '}
                  {result.spansRn.spans ? (
                    <span style={{ color: 'green' }}>Ya ✓</span>
                  ) : (
                    <span style={{ color: 'orange' }}>Tidak</span>
                  )}
                </p>
                <p>
                  Rank = {result.spansRn.rank}, dimensi = {result.spansRn.dimension}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubspacePage;
