import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { generateSimulation } from '../../utils/simulation';
import './Simulation.css';

const Simulation = () => {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [simulationData, setSimulationData] = useState(null);

  useEffect(() => {
    // Récupérer les données depuis le state de navigation ou générer une simulation par défaut
    if (location.state?.simulation) {
      setSimulationData(location.state.simulation);
    } else {
      // Simulation par défaut pour démonstration
      const defaultFormData = {
        profil: 'particulier',
        region: 'Wallonie',
        consommationActuelle: 3500,
        surfaceHabitable: 150,
        objectifs: ['economies', 'ecologie'],
      };
      const simulation = generateSimulation(defaultFormData, 1);
      setSimulationData(simulation);
    }
  }, [location]);

  if (!simulationData) {
    return (
      <div className="simulation">
        <div className="container">
          <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
            <h2>Chargement de votre simulation...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Construction des détails à afficher
  const details = [];
  if (simulationData.productionAnnuelle) {
    details.push({
      label: 'Production annuelle estimée',
      value: `${simulationData.productionAnnuelle.toLocaleString('fr-BE')} kWh`,
    });
  }
  if (simulationData.autoconsommation) {
    details.push({
      label: 'Autoconsommation',
      value: `${simulationData.autoconsommation}%`,
    });
  }
  details.push({
    label: 'Réduction CO2',
    value: `${simulationData.reductionCO2} tonnes/an`,
  });
  details.push({
    label: 'Durée de vie',
    value: '25 ans',
  });

  const getScoreColor = (score) => {
    if (score >= 8) return 'var(--secondary-color)';
    if (score >= 6) return 'var(--accent-color)';
    return 'var(--danger-color)';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Bon';
    return 'À améliorer';
  };

  return (
    <div className="simulation">
      <div className="container">
        <div className="simulation-header">
          <button className="back-btn" onClick={() => navigate('/catalogue')}>
            ← Retour au catalogue
          </button>
          <h1>Résultats de votre simulation</h1>
          <p>Simulation #{simulationId}</p>
        </div>

        <div className="simulation-grid">
          <div className="simulation-main">
            <div className="score-card card">
              <h2>Votre score énergie</h2>
              <div className="score-display">
                <div
                  className="score-circle"
                  style={{
                    background: `conic-gradient(${getScoreColor(simulationData.score)} ${
                      simulationData.score * 10
                    }%, var(--bg-secondary) 0)`,
                  }}
                >
                  <div className="score-inner">
                    <span className="score-value">{simulationData.score}</span>
                    <span className="score-max">/10</span>
                  </div>
                </div>
                <div className="score-label">{getScoreLabel(simulationData.score)}</div>
              </div>
            </div>

            <div className="cost-card card">
              <h2>Estimation financière</h2>
              <div className="cost-breakdown">
                <div className="cost-row">
                  <span>Coût initial</span>
                  <span className="cost-value">
                    {simulationData.coutEstime.toLocaleString('fr-BE')} €
                  </span>
                </div>
                <div className="cost-row highlight">
                  <span>Primes et aides</span>
                  <span className="cost-value green">
                    -{simulationData.primes.total.toLocaleString('fr-BE')} €
                  </span>
                </div>
                <div className="cost-row total">
                  <span>Coût final</span>
                  <span className="cost-value">
                    {simulationData.coutFinal.toLocaleString('fr-BE')} €
                  </span>
                </div>
              </div>
              <div className="savings-info">
                <div className="savings-item">
                  <div className="savings-icon">💰</div>
                  <div>
                    <p className="savings-label">Économies annuelles</p>
                    <p className="savings-value">
                      {simulationData.economiesAnnuelles.toLocaleString('fr-BE')} €/an
                    </p>
                  </div>
                </div>
                <div className="savings-item">
                  <div className="savings-icon">📊</div>
                  <div>
                    <p className="savings-label">Retour sur investissement</p>
                    <p className="savings-value">{simulationData.retourInvestissement} ans</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="details-card card">
              <h2>Détails techniques</h2>
              <div className="details-grid">
                {details.map((detail, index) => (
                  <div key={index} className="detail-item">
                    <span className="detail-label">{detail.label}</span>
                    <span className="detail-value">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="simulation-sidebar">
            <div className="recommendations-card card">
              <h3>Recommandations</h3>
              <div className="recommendations-list">
                {simulationData.recommandations.map((reco, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="recommendation-icon">{reco.icon}</div>
                    <div>
                      <h4>{reco.titre}</h4>
                      <p>{reco.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="actions-card card">
              <h3>Prochaines étapes</h3>
              <button className="btn btn-primary" onClick={() => navigate('/rendez-vous')}>
                Prendre rendez-vous
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/catalogue')}>
                Voir d'autres produits
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
