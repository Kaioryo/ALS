import React, { useState } from 'react';
import { innerProduct, norm, angleBetween, parseScalar } from '../utils/innerProduct';
import './SolverPage.css';

function InnerProductPage() {
  const [dimension, setDimension] = useState(3);
  const [vectorU, setVectorU] = useState(Array(3).fill(''));
  const [vectorV, setVectorV] = useState(Array(3).fill(''));
  const [showAngle, setShowAngle] = useState(true);
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

  const handleUChange = (i, value) => {
    if (value === '' || validateInput(value)) {
      const newU = [...vectorU];
      newU[i] = value;
      setVectorU(newU);
    }
  };

  const handleVChange = (i, value) => {
    if (value === '' || validateInput(value)) {
      const newV = [...vectorV];
      newV[i] = value;
      setVectorV(newV);
    }
  };

  const applyDimensionChange = (dim) => {
    const d = clamp(dim, 1, 8);
    setDimension(d);
    setVectorU(Array(d).fill(''));
    setVectorV(Array(d).fill(''));
    setResult(null);
  };

  const handleDimensionChange = (dim) => {
    if (isNaN(dim)) return;
    applyDimensionChange(dim);
  };

  const incDimension = () => applyDimensionChange(dimension + 1);
  const decDimension = () => applyDimensionChange(dimension - 1);

  const handleCompute = () => {
    const u = vectorU.map(parseScalar);
    const v = vectorV.map(parseScalar);

    const ip = innerProduct(u, v);
    const nu = norm(u);
    const nv = norm(v);
    const angle = showAngle ? angleBetween(u, v) : null;

    setResult({
      inner: ip,
      normU: nu,
      normV: nv,
      angle
    });
  };

  return (
    <div className="solver-page">
      <div className="page-header">
        <h1>📊 Inner Product</h1>
        <p>Hitung hasil kali dalam, panjang vektor, dan sudut antar vektor</p>
      </div>

      <div className="solver-container-vertical">
        <div className="input-section">
          <h3>Input Vektor</h3>

          <div className="controls">
            <label>
              Dimensi:
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
                  onChange={(e) =>
                    handleDimensionChange(parseInt(e.target.value, 10) || 1)
                  }
                  min="1"
                  max="8"
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

            <label>
              Tampilkan Sudut:
              <select
                value={showAngle ? 'yes' : 'no'}
                onChange={(e) => setShowAngle(e.target.value === 'yes')}
              >
                <option value="yes">Ya (θ)</option>
                <option value="no">Tidak</option>
              </select>
            </label>
          </div>

          <div className="matrix-input-section">
            <h4>Vektor Basis u</h4>
            <div className="matrix-grid-container">
              <div className="matrix-input-row">
                {Array.from({ length: dimension }).map((_, i) => (
                  <input
                    key={`u-${i}`}
                    type="text"
                    placeholder={`u[${i + 1}]`}
                    value={vectorU[i] || ''}
                    onChange={(e) => handleUChange(i, e.target.value)}
                    className="matrix-cell-input"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="matrix-input-section">
            <h4>Vektor v</h4>
            <div className="matrix-grid-container">
              <div className="matrix-input-row">
                {Array.from({ length: dimension }).map((_, i) => (
                  <input
                    key={`v-${i}`}
                    type="text"
                    placeholder={`v[${i + 1}]`}
                    value={vectorV[i] || ''}
                    onChange={(e) => handleVChange(i, e.target.value)}
                    className="matrix-cell-input"
                  />
                ))}
              </div>
            </div>
          </div>

          <button className="solve-btn" onClick={handleCompute}>
            Hitung Inner Product
          </button>
        </div>

        {result && (
          <div className="result-section">
            <h2>✅ Hasil Perhitungan</h2>

            <div className="step-box">
              <h3>Vektor u dan v</h3>
              <div className="matrix-display">
                <div className="matrix-display-row">
                  <span>u = (</span>
                  {vectorU.slice(0, dimension).map((val, i) => (
                    <span key={`u-val-${i}`}>
                      {val || '0'}
                      {i < dimension - 1 ? ',' : ''}
                    </span>
                  ))}
                  <span>)</span>
                </div>
                <div className="matrix-display-row">
                  <span>v = (</span>
                  {vectorV.slice(0, dimension).map((val, i) => (
                    <span key={`v-val-${i}`}>
                      {val || '0'}
                      {i < dimension - 1 ? ',' : ''}
                    </span>
                  ))}
                  <span>)</span>
                </div>
              </div>
            </div>

            <div className="step-box">
              <h3>Langkah Inner Product ⟨u, v⟩</h3>
              <div className="step-content">
                <div className="calculation">
                  <p>
                    ⟨u, v⟩ = Σ (u[i] · v[i]) ={' '}
                    {result.inner.terms.map((t, idx) => (
                      <span key={idx}>
                        ({t.ui} · {t.vi})
                        {idx < result.inner.terms.length - 1 ? ' + ' : ''}
                      </span>
                    ))}{' '}
                    = <strong>{result.inner.value}</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="step-box">
              <h3>Panjang Vektor ||u|| dan ||v||</h3>
              <div className="step-content">
                <div className="calculation">
                  <p>
                    ||u||² = ⟨u, u⟩ ={' '}
                    {result.normU.terms.map((t, idx) => (
                      <span key={idx}>
                        ({t.ui}²)
                        {idx < result.normU.terms.length - 1 ? ' + ' : ''}
                      </span>
                    ))}{' '}
                    = {result.normU.value.toFixed(4)} → ||u|| = √
                    {result.normU.value.toFixed(4)} ≈{' '}
                    <strong>{result.normU.length.toFixed(4)}</strong>
                  </p>
                  <p>
                    ||v||² = ⟨v, v⟩ ={' '}
                    {result.normV.terms.map((t, idx) => (
                      <span key={idx}>
                        ({t.ui}²)
                        {idx < result.normV.terms.length - 1 ? ' + ' : ''}
                      </span>
                    ))}{' '}
                    = {result.normV.value.toFixed(4)} → ||v|| = √
                    {result.normV.value.toFixed(4)} ≈{' '}
                    <strong>{result.normV.length.toFixed(4)}</strong>
                  </p>
                </div>
              </div>
            </div>

            {showAngle && result.angle && (
              <div className="final-result">
                <h2>📐 Sudut Antar Vektor</h2>
                {result.angle.cosTheta === null ? (
                  <p>Sudut tidak terdefinisi karena salah satu vektor adalah nol.</p>
                ) : (
                  <>
                    <div className="matrix-display">
                      <div className="matrix-display-row">
                        <span>
                          cos θ = ⟨u, v⟩ / (||u|| · ||v||) ={' '}
                          {result.angle.inner.value.toFixed(4)} / (
                          {result.angle.normU.length.toFixed(4)} ·{' '}
                          {result.angle.normV.length.toFixed(4)}) ={' '}
                          <strong>{result.angle.cosTheta.toFixed(4)}</strong>
                        </span>
                      </div>
                    </div>
                    <div className="solution-info">
                      <p>
                        θ ≈ <strong>{result.angle.thetaRad.toFixed(4)}</strong> radian
                      </p>
                      <p>
                        θ ≈ <strong>{result.angle.thetaDeg.toFixed(2)}</strong>°
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InnerProductPage;
