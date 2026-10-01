import { useNavigate } from 'react-router-dom';
import { formPath, productPath } from '../../utils/routes';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="product-card-item card" onClick={() => navigate(productPath(product))}>
      <div className="product-card-header">
        <div className="product-card-image">{product.image}</div>
        <div className="product-card-badge">{product.power}</div>
      </div>
      <div className="product-card-body">
        <h3>{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        <ul className="product-card-specs">
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
      <div className="product-card-footer">
        <div className="product-card-actions">
          <button
            className="btn btn-secondary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(productPath(product));
            }}
          >
            Détails
          </button>
          <button
            className="btn btn-primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(formPath(product));
            }}
          >
            Simuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
