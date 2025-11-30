import React, { useState } from 'react';
import { gramSchmidt } from '../utils/gramSchmidt';
import './SolverPage.css';

function GramSchmidtPage() {
  const [dimension, setDimension] = useState(3);
  const [numVectors, setNumVectors] = useState(3);
  const [vectors, setVectors] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);
  const [hkdType, setHkdType] = useState('euclid');
  const [weights, setWeights] = useState(['', '', '']);
  const [result, setResult] = useState(null);

  const clamp = (value, min, max) => {
    if (Number.isNaN(value)) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
  };

  const handleVectorChange = (vecIndex, compIndex, value) => {
    const newVectors = [...vectors];
    newVectors[vecIndex][compIndex] = value;
    setVectors(newVectors);
  };

  const handleWeightChange = (index, value) => {
    const newWeights = [...weights];
    newWeights[index] = value;
    setWeights(newWeights);
  };

  const handleSolve = () => {
    const numericVectors = vectors.map(vec =>
      vec.map(v => parseFloat(v) || 0)
    );
    const numericWeights = weights.map(w => parseFloat(w) || 1);

    const solution = gramSchmidt(numericVectors, hkdType, numericWeights);
    setResult(solution);
  };

  const applyDimensionChange = (newDim) => {
    setDimension(newDim);
    const newVectors = Array(newDim < 0 ? 0 : numVectors).fill(null).map(() =>
      Array(newDim).fill('')
    );
    setVectors(newVectors);
    setWeights(Array(newDim).fill(''));
  };

  const handleDimensionChange = (raw) => {
    const newDim = clamp(raw, 2, 5);
    applyDimensionChange(newDim);
  };

  const handleNumVectorsChange = (raw) => {
    const newNum = clamp(raw, 2, 5);
    setNumVectors(newNum);
    const newVectors = Array(newNum).fill(null).map(() =>
      Array(dimension).fill('')
    );
    setVectors(newVectors);
  };

  const incDimension = () => handleDimensionChange(dimension + 1);
  const decDimension = () => handleDimensionChange(dimension - 1);

  const incNumVectors = () => handleNumVectorsChange(numVectors + 1);
  const decNumVectors = () => handleNumVectorsChange(numVectors - 1);

  return (
    <div className="solver-page">
      <div className="page-header">
        <h1>📐 Gram-Schmidt Process</h1>
        <p>Ubah basis menjadi basis ortonormal dengan langkah detail</p>
      </div>

      <div className="solver-container-vertical">
        <div className="input-section">
          <h3>Input Basis Awal</h3>

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
                    handleDimensionChange(parseInt(e.target.value, 10) || 0)
                  }
                  min="2"
                  max="5"
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
                  onChange={(e) =>
                    handleNumVectorsChange(parseInt(e.target.value, 10) || 0)
                  }
                  min="2"
                  max="5"
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
              Tipe HKD:
              <select value={hkdType} onChange={(e) => setHkdType(e.target.value)}>
                <option value="euclid">Euclid (Standar)</option>
                <option value="weighted">Weighted (Terboboti)</option>
              </select>
            </label>
          </div>

          {hkdType === 'weighted' && (
            <div className="weights-section">
              <h4>Bobot (w₁, w₂, w₃, ...)</h4>
              <div className="vector-row">
                {weights.slice(0, dimension).map((w, i) => (
                  <input
                    key={i}
                    type="number"
                    placeholder={`w${i + 1}`}
                    value={w}
                    onChange={(e) => handleWeightChange(i, e.target.value)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="vectors-section">
            <h4>Vektor Basis (u₁, u₂, u₃, ...)</h4>
            <div className="vectors-input">
              {vectors.map((vec, vecIndex) => (
                <div key={vecIndex} className="vector-input">
                  <div className="vector-row">
                    {vec.slice(0, dimension).map((comp, compIndex) => (
                      <input
                        key={compIndex}
                        type="number"
                        placeholder={`u${vecIndex + 1}[${compIndex + 1}]`}
                        value={comp}
                        onChange={(e) =>
                          handleVectorChange(vecIndex, compIndex, e.target.value)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="solve-btn" onClick={handleSolve}>
            Hitung Basis Ortonormal
          </button>
        </div>

        {result && (
          <div className="result-section">
            <h2>✅ Hasil & Langkah-Langkah</h2>

            {result.steps.map((step, index) => (
              <div key={index} className="step-box">
                <h3>{step.title}</h3>
                <div className="step-content">
                  {step.calculations.map((calc, i) => (
                    <div key={i} className="calculation">
                      <p dangerouslySetInnerHTML={{ __html: calc }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="final-result">
              <h2>📐 Basis Ortonormal Final</h2>
              {result.orthonormal.map((vec, i) => (
                <div key={i} className="result-vector">
                  <strong>v{i + 1} = </strong>
                  <span>({vec.join(', ')})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GramSchmidtPage;
