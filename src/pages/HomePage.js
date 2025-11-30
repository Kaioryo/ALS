import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const modules = [
    {
      title: 'Gram-Schmidt Process',
      description: 'Ubah basis menjadi basis ortonormal dengan HKD custom',
      path: '/gram-schmidt',
      icon: '📐'
    },
    {
      title: 'SPL & Matrix Solver',
      description: 'Selesaikan SPL dengan Gauss, Gauss-Jordan, hitung determinan, rank, invers',
      path: '/spl-solver',
      icon: '🔢'
    },
    {
      title: 'Inner Product & HKD',
      description: 'Hitung hasil kali dalam, norm, jarak, proyeksi, cek ortogonalitas',
      path: '/inner-product',
      icon: '📊'
    },
    {
      title: 'Projection & Least Squares',
      description: 'Hitung proyeksi ortogonal dan solusi least squares Ax ≈ b',
      path: '/projection',
      icon: '🎯'
    },
    {
      title: 'Subspace Checker',
      description: 'Verifikasi ruang vektor, subruang, cari basis dan dimensi',
      path: '/subspace',
      icon: '🧮'
    },
    {
      title: 'Eigenvalue & Eigenvector',
      description: 'Hitung nilai eigen dan vektor eigen untuk matriks 2×2 dan 3×3',
      path: '/eigen',
      icon: '🧩'
    },
    {
      title: 'Diagonalization',
      description: 'Cek apakah A diagonalizable dan bentuk A = P D P⁻¹',
      path: '/diagonalization',
      icon: '🔄'
    },
    {
      title: 'Materi PDF',
      description: 'Akses slide pertemuan dan materi referensi',
      path: '/materi',
      icon: '📚'
    }
  ];

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Aljabar Linear Elementer</h1>
        <p>Solver & Calculator dengan Langkah-Langkah Detail</p>
      </div>

      <div className="modules-grid">
        {modules.map((module, index) => (
          <Link to={module.path} key={index} className="module-card">
            <div className="module-icon">{module.icon}</div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
