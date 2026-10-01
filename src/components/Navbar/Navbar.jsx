import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getLatestSimulation } from '../../services/api';
import { simulationPath } from '../../utils/routes';
import ecoRenoLogo from '../../assets/ecoreno-logo.jpeg';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [latestSimulation, setLatestSimulation] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const refreshLatestSimulation = () => setLatestSimulation(getLatestSimulation());
    refreshLatestSimulation();
    const intervalId = window.setInterval(refreshLatestSimulation, 3000);
    window.addEventListener('storage', refreshLatestSimulation);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('storage', refreshLatestSimulation);
    };
  }, [location.pathname]);

  const simulationIsComplete = ['TERMINEE', 'TERMINE', 'COMPLETEE', 'COMPLETED']
    .includes(String(latestSimulation?.statut || latestSimulation?.status || '').toUpperCase());

  const navLinks = [
    { path: '/', label: 'Accueil' },
    { path: '/catalogue', label: 'Catalogue' },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={ecoRenoLogo} alt="EcoReno+" className="navbar-logo" />
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {latestSimulation?.referencePublique && (
            <Link
              to={simulationPath(latestSimulation)}
              className={`navbar-simulation-link ${simulationIsComplete ? 'is-complete' : ''}`}
              title={`Voir ma simulation : ${latestSimulation.produit?.nom || latestSimulation.produit?.name || 'produit sélectionné'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span aria-hidden="true">{simulationIsComplete ? '✓' : '⏳'}</span>
              {simulationIsComplete ? 'Résultat prêt' : 'Ma simulation'}
            </Link>
          )}
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
