import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import GramSchmidtPage from './pages/GramSchmidtPage';
import SPLSolverPage from './pages/SPLSolverPage';
import InnerProductPage from './pages/InnerProductPage';
import ProjectionPage from './pages/ProjectionPage';
import SubspacePage from './pages/SubspacePage';
import EigenPage from './pages/EigenPage';
import DiagonalizationPage from './pages/DiagonalizationPage';
import MateriPDFPage from './pages/MateriPDFPage';
import PDFViewerPage from './pages/PDFViewerPage';
import './App.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gram-schmidt" element={<GramSchmidtPage />} />
            <Route path="/spl-solver" element={<SPLSolverPage />} />
            <Route path="/inner-product" element={<InnerProductPage />} />
            <Route path="/projection" element={<ProjectionPage />} />
            <Route path="/subspace" element={<SubspacePage />} />
            <Route path="/eigen" element={<EigenPage />} />
            <Route path="/diagonalization" element={<DiagonalizationPage />} />
            <Route path="/materi" element={<MateriPDFPage />} />
            <Route path="/materi/:id" element={<PDFViewerPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
