import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
} from '@react-pdf-viewer/core';
import {
  pageNavigationPlugin,
} from '@react-pdf-viewer/page-navigation';
import materiList from '../data/materiData';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import './PDFViewerPage.css';

function PDFViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const basePath = process.env.PUBLIC_URL || '';

  const item = materiList.find((m) => String(m.id) === String(id));

  const [currentPage, setCurrentPage] = useState(0); // 0-based
  const [totalPages, setTotalPages] = useState(0);

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { jumpToNextPage, jumpToPreviousPage } = pageNavigationPluginInstance;

  if (!item) {
    return (
      <div className="pdfviewer-page">
        <div className="pdfviewer-header">
          <button className="pdfviewer-back" onClick={() => navigate('/materi')}>
            Kembali ke daftar materi
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
    const pages = e.doc.numPages || 0;
    setTotalPages(pages);
    setCurrentPage(0);
  };

  const handlePageChange = (e) => {
    setCurrentPage(e.currentPage);
  };

  return (
    <div className="pdfviewer-page">
      <div className="pdfviewer-header">
        <button className="pdfviewer-back" onClick={() => navigate('/materi')}>
          Kembali
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
            onClick={jumpToPreviousPage}
            disabled={currentPage <= 0}
          >
            ‹ Prev
          </button>

          <span className="pdfviewer-page-info">
            Halaman {currentPage + 1} / {totalPages || '-'}
          </span>

          <button
            className="pdfviewer-nav-btn"
            onClick={jumpToNextPage}
            disabled={totalPages === 0 || currentPage >= totalPages - 1}
          >
            Next ›
          </button>
        </div>

        <div className="pdfviewer-frame">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={fileUrl}
              plugins={[pageNavigationPluginInstance]}
              defaultScale={SpecialZoomLevel.PageFit}
              onDocumentLoad={handleDocumentLoaded}
              onPageChange={handlePageChange}
            />
          </Worker>
        </div>
      </div>
    </div>
  );
}

export default PDFViewerPage;
