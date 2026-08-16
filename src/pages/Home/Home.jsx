import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7V17.5C2 21 12 22 12 22S22 21 22 17.5V7L12 2ZM12 12C10.9 12 10 11.1 10 10S10.9 8 12 8 14 8.9 14 10 13.1 12 12 12Z" />
        </svg>
      ),
      title: 'Simulation gratuite',
      description: 'Obtenez une estimation précise de votre installation en quelques minutes',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12S9.24 7 12 7 17 9.24 17 12 14.76 17 12 17Z" />
        </svg>
      ),
      title: 'Assistant IA intelligent',
      description: 'Notre chatbot vous guide et répond à toutes vos questions en temps réel',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" />
        </svg>
      ),
      title: 'Primes régionales',
      description: 'Calcul automatique des primes selon votre région (Wallonie, Bruxelles, Flandre)',
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
        </svg>
      ),
      title: 'Accompagnement complet',
      description: 'De la simulation à l\'installation, nous vous accompagnons à chaque étape',
    },
  ];

  const products = [
    {
      id: 'panneaux',
      name: 'Panneaux photovoltaïques',
      description: 'Produisez votre propre électricité et réduisez vos factures',
      image: '☀️',
    },
    {
      id: 'batteries',
      name: 'Batteries de stockage',
      description: 'Stockez l\'énergie pour une autonomie maximale',
      image: '🔋',
    },
    {
      id: 'pompe',
      name: 'Pompes à chaleur',
      description: 'Chauffage et climatisation économiques',
      image: '🌡️',
    },
  ];

  const regions = [
    { name: 'Wallonie', color: '#ea4335' },
    { name: 'Bruxelles', color: '#fbbc04' },
    { name: 'Flandre', color: '#34a853' },
  ];

  return (
    <div className="home">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content fade-in">
            <h1>Votre transition énergétique commence ici</h1>
            <p>
              Découvrez les meilleures solutions d'énergie durable pour votre habitation ou votre entreprise en Belgique.
              Simulation gratuite, primes régionales incluses.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate('/formulaire')}>
                Commencer la simulation
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/catalogue')}>
                Découvrir le catalogue
              </button>
            </div>
          </div>
          <div className="hero-visual fade-in">
            <div className="hero-card">
              <div className="energy-icon">⚡</div>
              <h3>100% Personnalisé</h3>
              <p>Adapté à votre profil et région</p>
            </div>
          </div>
        </div>
      </section>

      <section className="regions-section">
        <div className="container">
          <h2>Nous couvrons toute la Belgique</h2>
          <div className="regions-grid">
            {regions.map((region) => (
              <div key={region.name} className="region-card" style={{ '--region-color': region.color }}>
                <div className="region-marker"></div>
                <h3>{region.name}</h3>
                <p>Primes et réglementations locales prises en compte</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <h2>Nos solutions énergétiques</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card card" onClick={() => navigate('/catalogue')}>
                <div className="product-icon">{product.image}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <button className="btn btn-secondary">En savoir plus</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2>Pourquoi choisir EnergiePlus ?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Prêt à passer à l'énergie durable ?</h2>
            <p>Lancez votre simulation gratuite en moins de 5 minutes</p>
            <button className="btn btn-primary" onClick={() => navigate('/formulaire')}>
              Commencer maintenant
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
