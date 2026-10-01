import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSimulationByReference, rememberSimulation } from '../../services/api';
import './Simulation.css';

const POLLING_INTERVAL_MS = 3000;
const POLLING_TIMEOUT_MS = 60000;
const PENDING_STATUSES = new Set(['EN_ATTENTE', 'EN_COURS', 'PENDING', 'PROCESSING']);
const COMPLETED_STATUSES = new Set(['TERMINEE', 'TERMINE', 'COMPLETEE', 'COMPLETED']);
const RECOMMENDATION_PRESENTATION = [
  { icon: '📊', title: 'Votre position PEB' },
  { icon: '🏠', title: 'Priorité pour votre logement' },
  { icon: '⚙️', title: 'Optimiser votre projet' },
  { icon: '✅', title: 'Avant de décider' },
];

const getSimulationStatus = (simulation) => String(simulation?.statut || simulation?.status || '').toUpperCase();

const getApiErrorMessage = (error) => {
  const payload = error?.response?.data;
  const validationErrors = payload?.errors;

  if (Array.isArray(validationErrors)) return validationErrors.join(' ');
  if (validationErrors && typeof validationErrors === 'object') {
    return Object.values(validationErrors).flat().join(' ');
  }

  return payload?.message || payload?.detail || error?.message || 'Impossible de récupérer cette simulation.';
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const formatCurrencyOrPending = (value) => {
  const number = toNumberOrNull(value);
  return number === null ? 'À confirmer' : `${number.toLocaleString('fr-BE')} €`;
};

const formatNumberOrPending = (value, unit) => {
  const number = toNumberOrNull(value);
  return number === null ? 'À confirmer' : `${number.toLocaleString('fr-BE')} ${unit}`;
};

const formatRangeOrPending = (minimum, maximum, unit) => {
  const min = toNumberOrNull(minimum);
  const max = toNumberOrNull(maximum);
  if (min === null || max === null) return 'À confirmer';
  return `${min.toLocaleString('fr-BE')} – ${max.toLocaleString('fr-BE')} ${unit}`;
};

// Normalisation des résultats effectivement terminés par le backend Spring Boot.
const normalizeSimulation = (raw) => {
  const scoreVal = raw.score?.valeur != null
    ? toNumberOrNull(raw.score.valeur)
    : (raw.scoreValeur != null ? toNumberOrNull(raw.scoreValeur) : (typeof raw.score === 'number' ? raw.score : null));

  let recommendations = [];

  if (Array.isArray(raw.score?.recommandations) && raw.score.recommandations.length > 0) {
    recommendations = raw.score.recommandations.slice(0, 4).map((r, index) => ({
      icon: RECOMMENDATION_PRESENTATION[index].icon,
      titre: RECOMMENDATION_PRESENTATION[index].title,
      description: typeof r === 'string' ? r : (r.description || r.contenu || ''),
    }));
  } else if (Array.isArray(raw.recommandations) && raw.recommandations.length > 0) {
    recommendations = raw.recommandations.slice(0, 4).map((r, index) => {
      const presentation = RECOMMENDATION_PRESENTATION[index];
      return typeof r === 'string'
        ? { icon: presentation.icon, titre: presentation.title, description: r }
        : { ...r, icon: r.icon || presentation.icon, titre: r.titre || r.title || presentation.title };
    });
  }

  const coutEstime = toNumberOrNull(raw.coutEstime) ?? toNumberOrNull(raw.produit?.prix);
  const economiesEnergieMinKwh = toNumberOrNull(raw.economiesEnergieMinKwh);
  const economiesEnergieMaxKwh = toNumberOrNull(raw.economiesEnergieMaxKwh);
  const economiesAnnuelles = toNumberOrNull(raw.economiesAnnuelles);
  const economiesAnnuellesMin = toNumberOrNull(raw.economiesAnnuellesMin);
  const economiesAnnuellesMax = toNumberOrNull(raw.economiesAnnuellesMax);
  const coutEnergieAnnuelAvant = toNumberOrNull(raw.coutEnergieAnnuelAvant);
  const coutEnergieAnnuelApresMin = toNumberOrNull(raw.coutEnergieAnnuelApresMin);
  const coutEnergieAnnuelApresMax = toNumberOrNull(raw.coutEnergieAnnuelApresMax);
  const primeEstimee = toNumberOrNull(raw.primeEstimee);
  const primesTotal = primeEstimee ?? toNumberOrNull(raw.primes?.total) ?? 0;
  const coutFinal = toNumberOrNull(raw.coutFinal) ?? (coutEstime === null ? null : Math.max(0, coutEstime - primesTotal));
  const averageAnnualSavings = economiesAnnuelles !== null
    ? economiesAnnuelles
    : (economiesAnnuellesMin !== null && economiesAnnuellesMax !== null
      ? (economiesAnnuellesMin + economiesAnnuellesMax) / 2
      : null);
  const retourInvestissement = toNumberOrNull(raw.retourInvestissement)
    ?? (coutFinal !== null && averageAnnualSavings && averageAnnualSavings > 0
      ? Number((coutFinal / averageAnnualSavings).toFixed(1))
      : null);

  return {
    id: raw.id,
    productName: raw.produit?.nom || raw.produit?.name || raw.product?.nom || raw.product?.name || '',
    productType: raw.produit?.type || '',
    score: scoreVal,
    scoreCriteres: raw.score?.criteres || raw.scoreCriteres || '',
    coutEstime,
    primes: {
      total: primesTotal,
      regionale: toNumberOrNull(raw.primes?.regionale),
      degressivite: toNumberOrNull(raw.primes?.degressivite),
    },
    primeEstimee,
    primeStatut: raw.primeStatut || '',
    primeSourceUrl: raw.primeSourceUrl || '',
    coutFinal,
    economiesAnnuelles,
    economiesAnnuellesMin,
    economiesAnnuellesMax,
    coutEnergieAnnuelAvant,
    coutEnergieAnnuelApresMin,
    coutEnergieAnnuelApresMax,
    economiesEnergieMinKwh,
    economiesEnergieMaxKwh,
    retourInvestissement,
    reductionCO2: toNumberOrNull(raw.reductionCO2),
    productionAnnuelle: toNumberOrNull(raw.productionAnnuelle),
    autoconsommation: toNumberOrNull(raw.autoconsommation),
    recommandations: recommendations,
  };
};

const Simulation = () => {
  const { reference } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [simulationData, setSimulationData] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const initialSimulation = location.state?.simulation;

  useEffect(() => {
    const simulationReference = reference || initialSimulation?.referencePublique;
    let cancelled = false;
    let timerId;
    let initialResult = initialSimulation;
    const startedAt = Date.now();

    setSimulationData(null);
    setIsWaiting(false);
    setPollingTimedOut(false);
    setStatus('');
    setError('');

    if (!simulationReference) {
      setError('Aucune simulation à afficher. Veuillez relancer le formulaire.');
      return undefined;
    }

    const pollSimulation = async () => {
      try {
        const result = initialResult || await getSimulationByReference(simulationReference);
        initialResult = null;

        if (cancelled) return;

        const backendStatus = getSimulationStatus(result);
        setStatus(backendStatus);

        if (COMPLETED_STATUSES.has(backendStatus)) {
          rememberSimulation(result);
          setSimulationData(normalizeSimulation(result));
          setIsWaiting(false);
          return;
        }

        if (PENDING_STATUSES.has(backendStatus)) {
          setIsWaiting(true);

          if (Date.now() - startedAt >= POLLING_TIMEOUT_MS) {
            setPollingTimedOut(true);
            return;
          }

          timerId = window.setTimeout(pollSimulation, POLLING_INTERVAL_MS);
          return;
        }

        throw new Error(`Statut de simulation inattendu : ${backendStatus || 'inconnu'}.`);
      } catch (requestError) {
        if (!cancelled) {
          setError(getApiErrorMessage(requestError));
          setIsWaiting(false);
        }
      }
    };

    pollSimulation();

    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [initialSimulation, reference]);

  if (error) {
    return (
      <div className="simulation">
        <div className="container">
          <div className="simulation-status-card card simulation-status-card--error">
            <h1>Simulation indisponible</h1>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={() => navigate('/formulaire')}>
              Retour au formulaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isWaiting || !simulationData) {
    return (
      <div className="simulation">
        <div className="container">
          <div className="simulation-status-card card">
            <div className="simulation-status-icon" aria-hidden="true">⏳</div>
            <h1>Votre simulation est en cours de calcul</h1>
            <p>
              {pollingTimedOut
                ? 'Le calcul prend plus de temps que prévu. Votre demande est enregistrée : revenez dans quelques instants pour consulter le résultat.'
                : 'Nous récupérons automatiquement le résultat dès que le calcul est terminé.'}
            </p>
            <button className="btn btn-secondary" onClick={() => navigate('/catalogue')}>
              Retour au catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Construction des détails à afficher
  const details = [];
  const isSolarProduct = simulationData.productType.toLocaleLowerCase('fr-BE').includes('panneau');
  if (isSolarProduct && simulationData.productionAnnuelle !== null) {
    details.push({
      label: 'Production annuelle estimée',
      value: formatNumberOrPending(simulationData.productionAnnuelle, 'kWh'),
    });
  }
  if (isSolarProduct && simulationData.autoconsommation !== null) {
    details.push({
      label: 'Autoconsommation',
      value: formatNumberOrPending(simulationData.autoconsommation, '%'),
    });
  }
  if (simulationData.reductionCO2 !== null) {
    details.push({
      label: 'Réduction CO2',
      value: formatNumberOrPending(simulationData.reductionCO2, 'tonnes/an'),
    });
  }

  const hasEuroSavings = simulationData.economiesAnnuellesMin !== null && simulationData.economiesAnnuellesMax !== null;
  const hasEnergySavings = simulationData.economiesEnergieMinKwh !== null && simulationData.economiesEnergieMaxKwh !== null;
  const savingsLabel = hasEuroSavings ? 'Économies annuelles estimées' : 'Économies d’énergie estimées';
  const savingsValue = hasEuroSavings
    ? formatRangeOrPending(simulationData.economiesAnnuellesMin, simulationData.economiesAnnuellesMax, '€/an')
    : hasEnergySavings
      ? formatRangeOrPending(simulationData.economiesEnergieMinKwh, simulationData.economiesEnergieMaxKwh, 'kWh/an')
      : formatNumberOrPending(simulationData.economiesAnnuelles, '€/an');
  const monthlySavings = hasEuroSavings
    ? formatRangeOrPending(simulationData.economiesAnnuellesMin / 12, simulationData.economiesAnnuellesMax / 12, '€/mois')
    : 'Renseignez votre prix €/kWh';

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
          {simulationData.productName && (
            <p className="simulation-selected-product">
              Solution sélectionnée : <strong>{simulationData.productName}</strong>
            </p>
          )}
          <div className="simulation-complete-badge" role="status">
            <span aria-hidden="true">✓</span>
            Simulation terminée
          </div>
        </div>

        <div className="simulation-grid">
          <div className="simulation-main">
            <div className="score-card card">
              <h2>Votre score énergie</h2>
              <div className="score-display">
                <div
                  className="score-circle"
                  style={{
                    background: simulationData.score === null
                      ? 'var(--bg-secondary)'
                      : `conic-gradient(${getScoreColor(simulationData.score)} ${simulationData.score * 10}%, var(--bg-secondary) 0)`,
                  }}
                >
                  <div className="score-inner">
                    <span className="score-value">{simulationData.score ?? '—'}</span>
                    {simulationData.score !== null && <span className="score-max">/10</span>}
                  </div>
                </div>
                <div className="score-label">
                  {simulationData.score === null ? 'À confirmer' : getScoreLabel(simulationData.score)}
                </div>
              </div>
            </div>

            <div className="cost-card card">
              <h2>Estimation financière</h2>
              <div className="cost-breakdown">
                <div className="cost-row">
                  <span>Budget indicatif de la solution</span>
                  <span className="cost-value">
                    {formatCurrencyOrPending(simulationData.coutEstime)}
                  </span>
                </div>
                {simulationData.primeEstimee !== null && <>
                  <div className="cost-row highlight">
                    <span>Aide régionale estimée déduite du budget</span>
                    <span className="cost-value green">{formatCurrencyOrPending(simulationData.primes.total)}</span>
                  </div>
                  {simulationData.primeStatut && <p className="prime-status">{simulationData.primeStatut}</p>}
                  {simulationData.primeSourceUrl && <a className="prime-source-link" href={simulationData.primeSourceUrl} target="_blank" rel="noreferrer">Vérifier les conditions officielles</a>}
                </>}
                {simulationData.primeEstimee !== null && (
                  <div className="cost-row total">
                    <span>Coût net estimé</span>
                    <span className="cost-value">
                      {formatCurrencyOrPending(simulationData.coutFinal)}
                    </span>
                  </div>
                )}
              </div>
              <p className="financial-estimate-note">Le budget correspond au devis TTC renseigné ou, sans devis, au prix catalogue. Un devis professionnel reste nécessaire.</p>
              <div className="savings-info">
                {simulationData.coutEnergieAnnuelAvant !== null && (
                  <div className="savings-item">
                    <div className="savings-icon">🏡</div>
                    <div>
                      <p className="savings-label">Votre coût énergie actuel</p>
                      <p className="savings-value">{formatCurrencyOrPending(simulationData.coutEnergieAnnuelAvant)} / an</p>
                    </div>
                  </div>
                )}
                {simulationData.coutEnergieAnnuelApresMin !== null && simulationData.coutEnergieAnnuelApresMax !== null && (
                  <div className="savings-item">
                    <div className="savings-icon">📉</div>
                    <div>
                      <p className="savings-label">Coût énergie après projet</p>
                      <p className="savings-value">{formatRangeOrPending(simulationData.coutEnergieAnnuelApresMin, simulationData.coutEnergieAnnuelApresMax, '€/an')}</p>
                    </div>
                  </div>
                )}
                <div className="savings-item">
                  <div className="savings-icon">💰</div>
                  <div>
                    <p className="savings-label">{savingsLabel}</p>
                    <p className="savings-value">
                      {savingsValue}
                    </p>
                  </div>
                </div>
                <div className="savings-item">
                  <div className="savings-icon">📊</div>
                  <div>
                    <p className="savings-label">Retour sur investissement estimé</p>
                    <p className="savings-value">{formatNumberOrPending(simulationData.retourInvestissement, 'ans')}</p>
                  </div>
                </div>
                <div className="savings-item">
                  <div className="savings-icon">📅</div>
                  <div>
                    <p className="savings-label">Économie mensuelle estimée</p>
                    <p className="savings-value">{monthlySavings}</p>
                  </div>
                </div>
              </div>
            </div>

            {details.length > 0 && (
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
            )}
          </div>

          <div className="simulation-sidebar">
            <div className="recommendations-card card">
              <h3>Conseils EcoReno+</h3>
              <div className="recommendations-list">
                {simulationData.recommandations.length > 0 ? (
                  simulationData.recommandations.slice(0, 4).map((reco, index) => (
                    <div key={index} className="recommendation-item">
                      <div className="recommendation-icon">{reco.icon || '💡'}</div>
                      <div>
                        <h4>{reco.titre || 'Conseil'}</h4>
                        <p>{reco.description || reco}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="recommendations-pending">Les recommandations sont à confirmer.</p>
                )}
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
