import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../../services/api';
import { productSlug } from '../../utils/routes';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getProducts()
      .then((products) => {
        const data = products.find((item) => productSlug(item) === slug) || null;
        if (isMounted) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProduct(null);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="product-detail">
        <div className="container">
          <p>Chargement des détails du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="container">
          <h1>Produit non trouvé</h1>
          <button className="btn btn-primary" onClick={() => navigate('/catalogue')}>
            Retour au catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button className="back-btn" onClick={() => navigate('/catalogue')}>
          ← Retour au catalogue
        </button>

        <div className="product-hero">
          <div className="product-hero-image">
            <div className="product-image-display">{product.image}</div>
            <div className="product-badge">{product.power}</div>
          </div>
          <div className="product-hero-content">
            <h1>{product.name}</h1>
            <p className="product-intro">{product.fullDescription}</p>
            <div className="product-cta-section">
              <div className="product-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/formulaire/${productSlug(product)}`)}
                >
                  Obtenir ma simulation
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/rendez-vous')}
                >
                  Prendre rendez-vous
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="product-content">
          <div className="product-main">
            <section className="specifications-section card">
              <h2>Caractéristiques techniques</h2>
              <div className="specifications-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <span className="spec-label">{key}</span>
                    <span className="spec-value">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="features-section card">
              <h2>Inclus dans votre installation</h2>
              <ul className="features-list">
                {product.features.map((feature, index) => (
                  <li key={index}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--secondary-color)">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="advantages-section">
              <h2>Les avantages</h2>
              <div className="advantages-grid">
                {product.advantages.map((advantage, index) => (
                  <div key={index} className="advantage-card card">
                    <div className="advantage-icon">{advantage.icon}</div>
                    <h3>{advantage.title}</h3>
                    <p>{advantage.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="process-section card">
              <h2>Comment ça marche ?</h2>
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-number">1</div>
                  <h3>Simulation en ligne</h3>
                  <p>Remplissez notre formulaire pour obtenir une estimation personnalisée</p>
                </div>
                <div className="process-step">
                  <div className="step-number">2</div>
                  <h3>Visite technique</h3>
                  <p>Un expert évalue votre installation et confirme la faisabilité</p>
                </div>
                <div className="process-step">
                  <div className="step-number">3</div>
                  <h3>Installation</h3>
                  <p>Nos techniciens certifiés procèdent à l'installation complète</p>
                </div>
                <div className="process-step">
                  <div className="step-number">4</div>
                  <h3>Suivi & Maintenance</h3>
                  <p>Profitez de votre installation avec un suivi régulier</p>
                </div>
              </div>
            </section>
          </div>

          <div className="product-sidebar">
            <div className="cta-card card">
              <h3>Intéressé par ce produit ?</h3>
              <p>Obtenez votre simulation personnalisée en moins de 5 minutes</p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/formulaire/${productSlug(product)}`)}
              >
                Lancer ma simulation
              </button>
            </div>

            <div className="help-card card">
              <h3>Besoin de conseils ?</h3>
              <p>Notre assistant IA est disponible pour répondre à toutes vos questions</p>
              <button className="btn btn-secondary" onClick={() => window.dispatchEvent(new Event('energieplus:open-luna'))}>
                Parler à l'assistant
              </button>
            </div>

            <div className="info-card card">
              <h3>Aides régionales</h3>
              <p>Selon votre région et votre dossier, vous pourrez vérifier :</p>
              <ul className="primes-list">
                <li>
                  <span className="prime-icon">🏛️</span>
                  <span>Primes régionales</span>
                </li>
                <li>
                  <span className="prime-icon">🇧🇪</span>
                  <span>Conditions d’éligibilité</span>
                </li>
                <li>
                  <span className="prime-icon">💶</span>
                  <span>Portail officiel régional</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
