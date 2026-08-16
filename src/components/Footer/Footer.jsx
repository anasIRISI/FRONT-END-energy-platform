import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3>EnergiePlus</h3>
            <p>Votre partenaire énergie durable en Belgique</p>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/catalogue">Catalogue</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Régions</h4>
            <ul>
              <li>Wallonie</li>
              <li>Bruxelles</li>
              <li>Flandre</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>info@energieplus.be</li>
              <li>+32 2 123 45 67</li>
              <li><Link to="/admin/login" className="admin-link">🔐 Espace Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 EnergiePlus. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
