import React, { useState } from 'react';
import { projOntoVector, leastSquares } from '../utils/projection';
import './SolverPage.css';

const validateInput = (value) =>
  /^-?\d*\.?\d*$|^-?\d+\/\d*$/.test(value);

function ProjectionPage() {
  // Mode 1: proyeksi b ke garis span{u}
  const [dim, setDim] = useState(3);
  const [bVec, setBVec] = useState(Array(3).fill(''));
  const [uVec, setUVec] = useState(Array(3).fill(''));
  const [projResult, setProjResult] = useState(null);

  // Mode 2: least squares Ax ≈ b
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(2);
  const [A, setA] = useState(
    Array(3).fill().map(() => Array(2).fill(''))
  );
  const [bLS, setBLS] = useState(Array(3).fill(''));
  const [lsResult, setLsResult] = useState(null);

  const clamp = (v, min, max) => {
    if (Number.isNaN(v)) return min;
    if (v < min) return min;
    if (v > max) return max;
    return v;
  };

  const handleDimChange = (d) => {
    const k = clamp(d, 1, 6);
    setDim(k);
    setBVec(Array(k).fill(''));
    setUVec(Array(k).fill(''));
    setProjResult(null);
  };

  const incDim = () => handleDimChange(dim + 1);
  const decDim = () => handleDimChange(dim - 1);

  const handleBChange = (i, v) => {
    if (v === '' || validateInput(v)) {
      const nv = [...bVec];
      nv[i] = v;
      setBVec(nv);
    }
  };

  const handleUChange = (i, v) => {
    if (v === '' || validateInput(v)) {
      const nv = [...uVec];
      nv[i] = v;
      setUVec(nv);
    }
  };

  const computeProj = () => {
    const res = projOntoVector(bVec, uVec);
    setProjResult(res);
  };

  const handleRowsChange = (r) => {
    const m = clamp(r, 1, 6);
    setRows(m);
    setA(
      Array(m).fill().map((_, i) =>
        A[i] ? A[i].slice(0, cols) : Array(cols).fill('')
      )
    );
    setBLS(Array(m).fill(''));
    setLsResult(null);
  };

  const handleColsChange = (c) => {
    const n = clamp(c, 1, 6);
    setCols(n);
    setA(
      Array(rows).fill().map((_, i) =>
        Array(n).fill().map((_, j) => (A[i] && A[i][j]) || '')
      )
    );
    setLsResult(null);
  };

  const incRows = () => handleRowsChange(rows + 1);
  const decRows = () => handleRowsChange(rows - 1);

  const incCols = () => handleColsChange(cols + 1);
  const decCols = () => handleColsChange(cols - 1);

  const handleAChange = (i, j, v) => {
    if (v === '' || validateInput(v)) {
      const M = [...A];
      M[i][j] = v;
      setA(M);
    }
  };

  const handleBLSChange = (i, v) => {
    if (v === '' || validateInput(v)) {
      const nv = [...bLS];
      nv[i] = v;
      setBLS(nv);
    }
  };

  const computeLeastSquares = () => {
    const res = leastSquares(A, bLS);
    setLsResult(res);
  };

  const renderNum = (x) => {
    if (typeof x !== 'number' || isNaN(x)) return x;
    return (Math.round(x * 10000) / 10000).toString();
  };

  const renderFracMatrix = (M) => (
    <div className="matrix-display">
      {M.map((row, i) => (
        <div key={i} className="matrix-display-row">
          {row.map((val, j) => (
            <span key={j}>{val.toString()}</span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="solver-page">
      <div className="page-header">
        <h1>🎯 Projection & Least Squares</h1>
        <p>Hitung proyeksi ortogonal dan solusi least squares Ax ≈ b</p>
      </div>

      <div className="solver-container-vertical">
        {/* Bagian 1: Proyeksi ke garis */}
        <div className="input-section">
          <h3 className="section-subtitle">
            1. Proyeksi b ke garis span&#123;u&#125;
          </h3>

          <div className="controls">
            <label>
              Dimensi:
              <div className="number-spinner">
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={decDim}
                >
                  −
                </button>
                <input
                  type="number"
                  value={dim}
                  min="1"
                  max="6"
                  onChange={(e) =>
                    handleDimChange(parseInt(e.target.value, 10) || 1)
                  }
                />
                <button
                  type="button"
                  className="spinner-btn"
                  onClick={incDim}
                >
                  +
                </button>
              </div>
            </label>
          </div>

          <div className="matrix-input-section">
            <h4>Vektor b</h4>
            <div className="matrix-grid-container">
              <div className="matrix-input-row">
                {Array.from({ length: dim }).map((_, i) => (
                  <input
                    key={`b-${i}`}
                    type="text"
                    className="matrix-cell-input"
                    placeholder={`b[${i + 1}]`}
                    value={bVec[i] || ''}
                    onChange={(e) => handleBChange(i, e.target.value)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="matrix-input-section">
            <h4>Vektor Basis u (garis)</h4>
            <div className="matrix-grid-container">
              <div className="matrix-input-row">
                {Array.from({ length: dim }).map((_, i) => (
                  <input
                    key={`u-${i}`}
                    type="text"
                    className="matrix-cell-input"
                    placeholder={`u[${i + 1}]`}
                    value={uVec[i] || ''}
                    onChange={(e) => handleUChange(i, e.target.value)}
                  />
                ))}
              </div>
            </div>
          </div>

          <button className="solve-btn" onClick={computeProj}>
            Hitung Proyeksi b ke span&#123;u&#125;
          </button>

          {projResult && (
            <div className="result-section" style={{ marginTop: '1.5rem' }}>
              <h3 className="section-subtitle">Hasil Proyeksi</h3>
              {!projResult.defined ? (
                <p>{projResult.reason}</p>
              ) : (
                <>
                  <div className="step-box">
                    <h4>Langkah 1: Rumus Proyeksi</h4>
                    <p>
                      proj<span style={{ fontFamily: 'serif' }}>₍u₎</span>(b) =
                      (⟨b, u⟩ / ⟨u, u⟩) · u
                    </p>
                  </div>

                  <div className="step-box">
                    <h4>Langkah 2: Hitung Inner Product</h4>
                    <p>
                      ⟨b, u⟩ = {renderNum(
                        projResult.b.reduce(
                          (s, bi, i) => s + bi * projResult.u[i],
                          0
                        )
                      )}{' '}
                      dan ⟨u, u⟩ = {renderNum(
                        projResult.u.reduce((s, ui) => s + ui * ui, 0)
                      )}{' '}
                      sehingga skalar = ⟨b, u⟩ / ⟨u, u⟩ =
                      {' '}<strong>{renderNum(projResult.scalar)}</strong>
                    </p>
                  </div>

                  <div className="step-box">
                    <h4>Langkah 3: Bentuk Proyeksi dan Error</h4>
                    <div className="matrix-display">
                      <div className="matrix-display-row">
                        <span>proj(b) = (</span>
                        {projResult.proj.map((pi, i) => (
                          <span key={i}>
                            {renderNum(pi)}
                            {i < projResult.proj.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                        <span>)</span>
                      </div>
                      <div className="matrix-display-row">
                        <span>error = b − proj(b) = (</span>
                        {projResult.error.map((ei, i) => (
                          <span key={i}>
                            {renderNum(ei)}
                            {i < projResult.error.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                        <span>)</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bagian 2: Least Squares */}
        <div className="input-section" style={{ marginTop: '2.5rem' }}>
          <h3 className="section-subtitle">
            2. Least Squares Ax ≈ b
          </h3>

          <div className="controls">
            <label>
              Baris (m):
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
                  min="1"
                  max="6"
                  onChange={(e) =>
                    handleRowsChange(parseInt(e.target.value, 10) || 1)
                  }
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
              Kolom (n):
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
                  min="1"
                  max="6"
                  onChange={(e) =>
                    handleColsChange(parseInt(e.target.value, 10) || 1)
                  }
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
          </div>

          <div className="matrix-input-section">
            <h4>Matriks A (m×n)</h4>
            <div className="matrix-grid-container">
              {A.map((row, i) => (
                <div key={i} className="matrix-input-row">
                  {row.map((val, j) => (
                    <input
                      key={`${i}-${j}`}
                      type="text"
                      className="matrix-cell-input"
                      placeholder="0"
                      value={val}
                      onChange={(e) => handleAChange(i, j, e.target.value)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="matrix-input-section">
            <h4>Vektor b (m×1)</h4>
            <div className="matrix-grid-container">
              {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="matrix-input-row">
                  <input
                    type="text"
                    className="matrix-cell-input"
                    placeholder={`b[${i + 1}]`}
                    value={bLS[i] || ''}
                    onChange={(e) => handleBLSChange(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <button className="solve-btn" onClick={computeLeastSquares}>
            Hitung Solusi Least Squares
          </button>

          {lsResult && (
            <div className="result-section" style={{ marginTop: '1.5rem' }}>
              {!lsResult.defined ? (
                <p>{lsResult.reason}</p>
              ) : (
                <>
                  {/* Langkah 1: Bentuk Normal Equation */}
                  <div className="step-box">
                    <h4>Langkah 1: Bentuk Normal Equation</h4>
                    <p>
                      Normal equation: (AᵀA) x = Aᵀ b. Di bawah ini matriks
                      augmented (AᵀA | Aᵀb).
                    </p>
                    <div className="matrix-display">
                      {lsResult.AtA.map((row, i) => (
                        <div key={i} className="matrix-display-row">
                          {row.map((val, j) => (
                            <span key={j}>{renderNum(val)}</span>
                          ))}
                          <span>|</span>
                          <span>{renderNum(lsResult.Atb[i])}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Langkah 2: Gauss-Jordan pada Normal Equation */}
                  {lsResult.stepsNormalEq && lsResult.stepsNormalEq.length > 0 && (
                    <div className="step-box">
                      <h4>Langkah 2: Eliminasi Gauss–Jordan</h4>
                      <p>
                        Lakukan operasi baris elementer pada (AᵀA | Aᵀb) hingga
                        diperoleh bentuk eselon tereduksi. Setiap langkah di
                        bawah mengikuti pedoman solver SPL.
                      </p>

                      {lsResult.stepsNormalEq.map((step, index) => (
                        <div key={index} className="rref-step">
                          <h5>Langkah {index + 1}</h5>
                          {step.description && (
                            <p className="rref-step-desc">
                              {step.description}
                            </p>
                          )}
                          {renderFracMatrix(step.matrix)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Langkah 3: Baca x_LS dan Proyeksi p */}
                  <div className="step-box">
                    <h4>Langkah 3: Baca xₗₛ dan Proyeksi p</h4>
                    <p>
                      Solusi least squares x<sub>LS</sub> didapat dari kolom
                      terakhir hasil Gauss–Jordan. Proyeksi p = A x<sub>LS</sub>{' '}
                      adalah bayangan b pada kolom space A.
                    </p>
                    <div className="matrix-display">
                      <div className="matrix-display-row">
                        <span>x<sub>LS</sub> = (</span>
                        {lsResult.x.map((xi, i) => (
                          <span key={i}>
                            {renderNum(xi)}
                            {i < lsResult.x.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                        <span>)</span>
                      </div>
                      <div className="matrix-display-row">
                        <span>p = A x<sub>LS</sub> = (</span>
                        {lsResult.p.map((pi, i) => (
                          <span key={i}>
                            {renderNum(pi)}
                            {i < lsResult.p.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                        <span>)</span>
                      </div>
                      <div className="matrix-display-row">
                        <span>error = b − p = (</span>
                        {lsResult.error.map((ei, i) => (
                          <span key={i}>
                            {renderNum(ei)}
                            {i < lsResult.error.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                        <span>)</span>
                      </div>
                    </div>
                    <p>
                      ‖b − p‖² ≈ <strong>{renderNum(lsResult.errNorm2)}</strong>
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectionPage;
