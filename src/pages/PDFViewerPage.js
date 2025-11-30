import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import materiList from '../data/materiData';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './PDFViewerPage.css';

function PDFViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const basePath = process.env.PUBLIC_URL || '';

  const item = materiList.find((m) => String(m.id) === String(id));

  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);
  const viewerRef = useRef(null);

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

  const handleDocumentLoaded = (e) => {
    setTotalPages(e.doc.numPages || 0);
    setCurrentPage(0);
  };

  const goToPage = (pageIndex) => {
    if (!viewerRef.current) return;
    if (pageIndex < 0 || pageIndex >= totalPages) return;

    const { jumpToPage } = viewerRef.current;
    if (jumpToPage) {
      jumpToPage(pageIndex);
      setCurrentPage(pageIndex);
    }
  };

  const handlePrev = () => {
    goToPage(currentPage - 1);
  };

  const handleNext = () => {
    goToPage(currentPage + 1);
  };

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
        <div className="pdfviewer-toolbar">
          <button
            className="pdfviewer-nav-btn"
            onClick={handlePrev}
            disabled={currentPage <= 0}
          >
            ‹ Prev
          </button>

          <span className="pdfviewer-page-info">
            Halaman {currentPage + 1} / {totalPages || '-'}
          </span>

          <button
            className="pdfviewer-nav-btn"
            onClick={handleNext}
            disabled={totalPages === 0 || currentPage >= totalPages - 1}
          >
            Next ›
          </button>
        </div>

        <div className="pdfviewer-frame">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={fileUrl}
              defaultScale={SpecialZoomLevel.PageFit}
              onDocumentLoad={handleDocumentLoaded}
              ref={viewerRef}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}

export default PDFViewerPage;
