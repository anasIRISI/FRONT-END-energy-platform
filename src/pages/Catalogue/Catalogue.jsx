import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productCategories, getProductsByType } from '../../data/products';
import { getProducts } from '../../services/api';
import './Catalogue.css';

const Catalogue = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getProducts(selectedCategory)
      .then((data) => {
        if (isMounted) {
          setProductList(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Erreur chargement produits API:', err);
        if (isMounted) {
          setProductList(getProductsByType(selectedCategory));
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [selectedCategory]);

  const filteredProducts = productList;

  return (
    <div className="catalogue">
      <section className="catalogue-hero">
        <div className="container">
          <h1 className="fade-in">Catalogue de produits</h1>
          <p className="fade-in">Découvrez nos solutions d'énergie durable pour votre habitation ou entreprise</p>
        </div>
      </section>

      <section className="catalogue-content">
        <div className="container">
          <div className="categories-filter">
            {productCategories.map((cat) => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="products-list">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-item card">
                <div className="product-header">
                  <div className="product-image">{product.image}</div>
                  <div className="product-badge">{product.power}</div>
                </div>
                <div className="product-body">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <ul className="product-specs">
                    {product.shortSpecs.map((spec, index) => (
                      <li key={index}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--secondary-color)">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                        </svg>
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="product-footer">
                  <div className="product-price">
                    <span className="price-label">À partir de</span>
                    <span className="price-value">{product.price.toLocaleString('fr-BE')} €</span>
                  </div>
                  <div className="product-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => navigate(`/produit/${product.id}`)}
                    >
                      Détails
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/formulaire/${product.id}`)}
                    >
                      Simuler
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="help-section">
        <div className="container">
          <div className="help-card card">
            <h2>Besoin d'aide pour choisir ?</h2>
            <p>Notre assistant IA peut vous guider vers le produit le plus adapté à vos besoins</p>
            <button className="btn btn-primary">Parler à l'assistant</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Catalogue;
