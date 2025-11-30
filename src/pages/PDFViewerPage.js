import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import materiList from '../data/materiData';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './PDFViewerPage.css';

function PDFViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const basePath = process.env.PUBLIC_URL || '';

  const item = materiList.find((m) => String(m.id) === String(id));
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!item) {
    return (
      <div className="pdfviewer-page">
        <div className="pdfviewer-header">
          <button className="pdfviewer-back" onClick={() => navigate('/materi')}>
            ← Kembali ke daftar materi
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          Materi tidak ditemukan.
        </p>
      </div>
    );
  }

  const fileUrl = `${basePath}/pdf/${encodeURIComponent(item.filename)}`;

  return (
    <div className="pdfviewer-page">
      <div className="pdfviewer-header">
        <button className="pdfviewer-back" onClick={() => navigate('/materi')}>
          ← Kembali
        </button>
        <div className="pdfviewer-meta">
          <h1>{item.title}</h1>
          <p>{item.topic}</p>
        </div>
        <a
          className="pdfviewer-download"
          href={fileUrl}
          download={item.filename}
        >
          Download PDF
        </a>
      </div>

      <div className="pdfviewer-container">
        <Worker
          workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
        >
          <Viewer fileUrl={fileUrl} plugins={[defaultLayoutPluginInstance]} />
        </Worker>
      </div>
    </div>
  );
}

export default PDFViewerPage;
