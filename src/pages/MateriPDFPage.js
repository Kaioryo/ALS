import React from 'react';
import './MateriPDFPage.css';
import materiList from '../data/materiData';

function MateriPDFPage() {
  const basePath = process.env.PUBLIC_URL || '';

  const handleOpenNewTab = (filename) => {
    const url = `${basePath}/pdf/${encodeURIComponent(filename)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDownload = (filename) => {
    const url = `${basePath}/pdf/${encodeURIComponent(filename)}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="materi-page">
      <div className="materi-header">
        <h1>📚 Materi PDF Aljabar Linear</h1>
        <p>Akses slide kuliah per pertemuan untuk mendukung belajar mandiri.</p>
      </div>

      <div className="materi-grid">
        {materiList.map((item) => (
          <div key={item.id} className="materi-card">
            <div className="materi-icon">📄</div>
            <h3>{item.title}</h3>
            <p className="materi-topic">{item.topic}</p>

            <div className="materi-actions">
              <button
                className="materi-btn primary"
                onClick={() => handleOpenNewTab(item.filename)}
              >
                Lihat
              </button>
              <button
                className="materi-btn"
                onClick={() => handleDownload(item.filename)}
              >
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MateriPDFPage;
