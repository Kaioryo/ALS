import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
// Hapus penggunaan useAppContext untuk bahasa
import { useAppContext } from '../context/AppContext';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // Hapus 'language' dan 'toggleLanguage' dari context
  const { theme, toggleTheme } = useAppContext();

  const toggleMenu = () => setIsOpen(prev => !prev);
  const closeMenu = () => setIsOpen(false);

  // Tetapkan hanya satu bahasa; misal gunakan bahasa Indonesia tetap
  const labels = {
    brand: 'Aljabar Linear Solver',
    menu: 'Menu',
    gram: 'Gram-Schmidt',
    spl: 'SPL/Matrix',
    inner: 'Inner Product',
    proj: 'Projection & LS',
    sub: 'Subspace',
    eigen: 'Eigen',
    diag: 'Diagonalization',
    materi: 'Materi PDF',
  };

  const t = labels;

  const navItems = [
    { to: '/gram-schmidt', key: 'gram', label: t.gram },
    { to: '/spl-solver', key: 'spl', label: t.spl },
    { to: '/inner-product', key: 'inner', label: t.inner },
    { to: '/projection', key: 'proj', label: t.proj },
    { to: '/subspace', key: 'sub', label: t.sub },
    { to: '/eigen', key: 'eigen', label: t.eigen },
    { to: '/diagonalization', key: 'diag', label: t.diag },
    { to: '/materi', key: 'materi', label: t.materi },
  ];

  return (
    <>
      {/* Drawer mobile dari kiri */}
      <div className={`nav-drawer-backdrop ${isOpen ? 'open' : ''}`} onClick={closeMenu}></div>
      <div className={`nav-drawer ${isOpen ? 'open' : ''}`}>
        <div className="nav-drawer-header">
          <span className="nav-drawer-title">{t.menu}</span>
          <button onClick={closeMenu} aria-label="Close menu">×</button>
        </div>
        <nav className="nav-drawer-links">
          {navItems.map(item => (
            <NavLink
              key={item.key}
              to={item.to}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Navbar utama */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <button
              className={`navbar-burger ${isOpen ? 'is-active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
            <Link to="/" className="navbar-brand">{t.brand}</Link>
          </div>
          <nav className="navbar-links-desktop">
            {navItems.map(item => (
              <NavLink
                key={item.key}
                to={item.to}
                className={({ isActive }) => isActive ? 'active' : ''}
                onClick={closeMenu}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="navbar-right">
            {/* Hapus tombol toggle bahasa */}
            <button
              className="navbar-icon-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
