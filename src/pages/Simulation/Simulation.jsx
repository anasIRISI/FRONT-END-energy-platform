import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { generateSimulation } from '../../utils/simulation';
import { getSimulationById } from '../../services/api';
import './Simulation.css';

// Helper pour convertir et sécuriser les nombres
const safeNumber = (val, fallback = 0) => {
  if (val === null || val === undefined) return fallback;
  const num = parseFloat(val);
  return isNaN(num) ? fallback : num;
};

// Normalisation robuste des données de simulation (locales ou venant du backend Spring Boot)
const normalizeSimulation = (raw) => {
  if (!raw) {
    return generateSimulation({ profil: 'particulier', region: 'Wallonie', consommationActuelle: 3500 }, 1);
  }

  const estimatedCost = raw.coutEstime != null 
    ? safeNumber(raw.coutEstime, 8500) 
    : (raw.produit?.prix != null ? safeNumber(raw.produit.prix, 8500) : 8500);

  const totalPrimes = raw.primes?.total != null 
    ? safeNumber(raw.primes.total, 2500) 
    : 2500;

  const finalCost = raw.coutFinal != null 
    ? safeNumber(raw.coutFinal, Math.max(0, estimatedCost - totalPrimes)) 
    : Math.max(0, estimatedCost - totalPrimes);

  const annualSavings = raw.economiesAnnuelles != null 
    ? safeNumber(raw.economiesAnnuelles, 1200) 
    : 1200;

  const roi = raw.retourInvestissement != null 
    ? safeNumber(raw.retourInvestissement, 5.0) 
    : (finalCost > 0 ? parseFloat((finalCost / Math.max(1, annualSavings)).toFixed(1)) : 5.0);

  const scoreVal = raw.score?.valeur != null 
    ? safeNumber(raw.score.valeur, 8.5) 
    : (typeof raw.score === 'number' ? raw.score : 8.5);

  let recommendations = [
    { icon: '☀️', titre: 'Production solaire optimale', description: 'Orientation et inclinaison idéales.' },
    { icon: '🔋', titre: 'Autoconsommation', description: 'Stockage par batterie fortement conseillé.' },
  ];

  if (Array.isArray(raw.score?.recommandations) && raw.score.recommandations.length > 0) {
    recommendations = raw.score.recommandations.map((r) => ({
      icon: '💡',
      titre: r.titre || 'Recommandation IA',
      description: typeof r === 'string' ? r : (r.description || 'Optimisation énergétique conseillée.'),
    }));
  } else if (Array.isArray(raw.recommandations) && raw.recommandations.length > 0) {
    recommendations = raw.recommandations.map((r) => typeof r === 'string' ? { icon: '💡', titre: 'Conseil', description: r } : r);
  }

  return {
    id: raw.id || 1,
    score: scoreVal,
    coutEstime: estimatedCost,
    primes: {
      total: totalPrimes,
      regionale: raw.primes?.regionale || totalPrimes,
      degressivite: raw.primes?.degressivite || 0,
    },
    coutFinal: finalCost,
    economiesAnnuelles: annualSavings,
    retourInvestissement: roi,
    reductionCO2: raw.reductionCO2 || '2.8',
    productionAnnuelle: raw.productionAnnuelle || 4500,
    autoconsommation: raw.autoconsommation || 75,
    recommandations: recommendations,
  };
};

const Simulation = () => {
  const { simulationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [simulationData, setSimulationData] = useState(null);

  useEffect(() => {
    if (location.state?.simulation) {
      setSimulationData(normalizeSimulation(location.state.simulation));
    } else if (simulationId) {
      getSimulationById(simulationId)
        .then((res) => {
          setSimulationData(normalizeSimulation(res));
        })
        .catch(() => {
          setSimulationData(normalizeSimulation(null));
        });
    } else {
      setSimulationData(normalizeSimulation(null));
    }
  }, [location, simulationId]);

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
      value: `${safeNumber(simulationData.productionAnnuelle, 4500).toLocaleString('fr-BE')} kWh`,
    });
  }
  if (simulationData.autoconsommation) {
    details.push({
      label: 'Autoconsommation',
      value: `${safeNumber(simulationData.autoconsommation, 75)}%`,
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
          <p>Simulation #{simulationId || simulationData.id}</p>
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
                    {safeNumber(simulationData.coutEstime, 8500).toLocaleString('fr-BE')} €
                  </span>
                </div>
                <div className="cost-row highlight">
                  <span>Primes et aides</span>
                  <span className="cost-value green">
                    -{safeNumber(simulationData.primes?.total, 2500).toLocaleString('fr-BE')} €
                  </span>
                </div>
                <div className="cost-row total">
                  <span>Coût final</span>
                  <span className="cost-value">
                    {safeNumber(simulationData.coutFinal, 6000).toLocaleString('fr-BE')} €
                  </span>
                </div>
              </div>
              <div className="savings-info">
                <div className="savings-item">
                  <div className="savings-icon">💰</div>
                  <div>
                    <p className="savings-label">Économies annuelles</p>
                    <p className="savings-value">
                      {safeNumber(simulationData.economiesAnnuelles, 1200).toLocaleString('fr-BE')} €/an
                    </p>
                  </div>
                </div>
                <div className="savings-item">
                  <div className="savings-icon">📊</div>
                  <div>
                    <p className="savings-label">Retour sur investissement</p>
                    <p className="savings-value">{safeNumber(simulationData.retourInvestissement, 5.0)} ans</p>
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
                    <div className="recommendation-icon">{reco.icon || '💡'}</div>
                    <div>
                      <h4>{reco.titre || 'Conseil'}</h4>
                      <p>{reco.description || reco}</p>
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
