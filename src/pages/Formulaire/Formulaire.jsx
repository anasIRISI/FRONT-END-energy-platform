import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { isStrictlyPositiveNumber, validateFormData } from '../../utils/simulation';
import {
  createSimulation,
  findCompatibleBackendProduct,
  getBackendProducts,
  getLatestSimulationForProduct,
  rememberSimulation,
  submitForm,
} from '../../services/api';
import { productSlug as toProductSlug, simulationPath } from '../../utils/routes';
import './Formulaire.css';

const Formulaire = () => {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [previousSimulation, setPreviousSimulation] = useState(null);
  const [pendingProductId, setPendingProductId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    profil: '',
    region: '',
    nom: '',
    email: '',
    telephone: '',
    typeLogement: '',
    chauffage: '',
    tarifMode: '',
    tarifKwh: '',
    niveauIsolation: '',
    anneeBatiment: '',
    scorePebOfficiel: '',
    demanderEstimationPrime: false,
    anneeConstruction: '',
    surfaceTravauxM2: '',
    coutTravauxTtc: '',
    statutDemandeur: '',
    categorieRevenus: '',
    categorieRevenusFlandre: '',
    coutTravauxHtva: '',
    entrepreneurEnregistre: '',
    isolantBiosource: 'non',
    surfaceHabitable: '',
    raisonSociale: '',
    numeroTVA: '',
    secteurActivite: '',
    adresse: '',
    consommationActuelle: '',
    objectifs: [],
    besoinEnergetique: '', // Nouveau champ pour déterminer le type de produit
  });

  const totalSteps = 6; // Ajout d'une étape pour le besoin énergétique

  const handleInputChange = (field, value) => {
    setSubmissionError('');
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleObjectifToggle = (objectif) => {
    setFormData((prev) => ({
      ...prev,
      objectifs: prev.objectifs.includes(objectif)
        ? prev.objectifs.filter((o) => o !== objectif)
        : [...prev.objectifs, objectif],
    }));
  };

  const canProceedToNextStep = () => {
    return validateFormData(formData, currentStep);
  };

  const handleNext = () => {
    if (canProceedToNextStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resolveSelectedProductId = async () => {
    if (productSlug !== undefined) {
      const backendProducts = await getBackendProducts();
      const selectedProduct = backendProducts.find((product) => toProductSlug(product) === productSlug);
      if (!selectedProduct) {
        throw new Error('Le produit sélectionné depuis le catalogue est invalide.');
      }
      return selectedProduct.id;
    }

    const backendProducts = await getBackendProducts();
    const compatibleProduct = findCompatibleBackendProduct(backendProducts, formData.besoinEnergetique);

    if (!compatibleProduct) {
      const needLabels = {
        panneaux: 'panneaux solaires',
        batterie: 'batterie',
        pompe: 'pompe à chaleur',
        isolation: 'isolation de toiture',
      };
      const label = needLabels[formData.besoinEnergetique];
      throw new Error(label
        ? `Aucun produit backend compatible avec le besoin « ${label} » n’est disponible.`
        : 'Sélectionnez un besoin précis (panneaux, batterie ou pompe à chaleur) pour créer la simulation.');
    }

    return compatibleProduct.id;
  };

  const createNewSimulation = async (selectedProductId) => {
    // 1. Envoi au backend Spring Boot (création visiteur, formulaire et réponses).
    const formRes = await submitForm(formData);
    if (!formRes?.id) {
      throw new Error('Le backend n’a pas retourné l’identifiant du formulaire créé.');
    }

    // 2. La simulation n'est demandée qu'après la sauvegarde réussie des réponses.
    const backendSimulation = await createSimulation(formRes.id, selectedProductId);
    if (!backendSimulation?.id) {
      throw new Error('Le backend n’a pas retourné l’identifiant de la simulation créée.');
    }

    rememberSimulation(backendSimulation);
    navigate(simulationPath(backendSimulation), {
      state: { simulation: backendSimulation },
    });
  };

  const formatSubmissionError = (error) => {
    const backendError = error.response?.data;
    const details = backendError?.errors && typeof backendError.errors === 'object'
      ? Object.values(backendError.errors).flat().join(' ')
      : '';
    return details || backendError?.message || backendError?.detail || error.message || 'La simulation n’a pas pu être créée.';
  };

  const handleSubmit = async () => {
    if (!isStrictlyPositiveNumber(formData.surfaceHabitable) || !isStrictlyPositiveNumber(formData.consommationActuelle)) {
      setSubmissionError('La surface et la consommation annuelle doivent être des nombres strictement positifs.');
      setCurrentStep(4);
      return;
    }

    setSubmissionError('');
    setSubmitting(true);

    try {
      const selectedProductId = await resolveSelectedProductId();
      const previousResult = getLatestSimulationForProduct(selectedProductId);

      if (previousResult) {
        setPendingProductId(selectedProductId);
        setPreviousSimulation(previousResult);
        return;
      }

      await createNewSimulation(selectedProductId);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      setSubmissionError(formatSubmissionError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecalculate = async () => {
    if (!pendingProductId) return;

    setPreviousSimulation(null);
    setSubmissionError('');
    setSubmitting(true);
    try {
      await createNewSimulation(pendingProductId);
    } catch (error) {
      console.error('Erreur lors du recalcul de la simulation:', error);
      setSubmissionError(formatSubmissionError(error));
    } finally {
      setSubmitting(false);
      setPendingProductId(null);
    }
  };

  return (
    <div className="formulaire">
      <div className="container">
        <div className="formulaire-container">
          <div className="formulaire-sidebar">
            <h2>Votre simulation</h2>
            <p>Remplissez le formulaire pour obtenir une estimation personnalisée</p>
            <div className="progress-steps">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className={`progress-step ${
                    step === currentStep ? 'active' : step < currentStep ? 'completed' : ''
                  }`}
                >
                  <div className="step-number">{step}</div>
                  <div className="step-label">
                    {step === 1 && 'Profil'}
                    {step === 2 && 'Région'}
                    {step === 3 && 'Coordonnées'}
                    {step === 4 && 'Logement'}
                    {step === 5 && 'Besoins'}
                    {step === 6 && 'Objectifs'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="formulaire-content card">
            <div className="step-indicator">
              Étape {currentStep} sur {totalSteps}
            </div>

            {/* Étape 1: Choix du profil */}
            {currentStep === 1 && (
              <div className="form-step fade-in">
                <h2>Quel est votre profil ?</h2>
                <p>Choisissez le profil qui correspond à votre situation</p>
                <div className="profile-options">
                  <button
                    className={`profile-card ${formData.profil === 'particulier' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('profil', 'particulier')}
                  >
                    <div className="profile-icon">🏠</div>
                    <h3>Particulier</h3>
                    <p>Pour votre habitation personnelle</p>
                  </button>
                  <button
                    className={`profile-card ${formData.profil === 'societe' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('profil', 'societe')}
                  >
                    <div className="profile-icon">🏢</div>
                    <h3>Société</h3>
                    <p>Pour votre entreprise ou bâtiment professionnel</p>
                  </button>
                </div>
              </div>
            )}

            {/* Étape 2: Région */}
            {currentStep === 2 && (
              <div className="form-step fade-in">
                <h2>Dans quelle région êtes-vous situé(e) ?</h2>
                <p>Cela nous permet de calculer les primes et aides disponibles</p>
                <div className="region-options">
                  {['Wallonie', 'Bruxelles', 'Flandre'].map((region) => (
                    <button
                      key={region}
                      className={`region-card ${formData.region === region ? 'selected' : ''}`}
                      onClick={() => handleInputChange('region', region)}
                    >
                      <div className="region-icon">📍</div>
                      <h3>{region}</h3>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Étape 3: Coordonnées */}
            {currentStep === 3 && (
              <div className="form-step fade-in">
                <h2>Vos coordonnées</h2>
                <p>Ces informations nous permettront de vous recontacter</p>
                <div className="form-fields">
                  {formData.profil === 'particulier' ? (
                    <>
                      <div className="form-group">
                        <label>Nom complet *</label>
                        <input
                          type="text"
                          value={formData.nom}
                          onChange={(e) => handleInputChange('nom', e.target.value)}
                          placeholder="Ex: Jean Dupont"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="jean.dupont@email.com"
                        />
                      </div>
                      <div className="form-group">
                        <label>Téléphone *</label>
                        <input
                          type="tel"
                          value={formData.telephone}
                          onChange={(e) => handleInputChange('telephone', e.target.value)}
                          placeholder="+32 XXX XX XX XX"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Raison sociale *</label>
                        <input
                          type="text"
                          value={formData.raisonSociale}
                          onChange={(e) => handleInputChange('raisonSociale', e.target.value)}
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                      <div className="form-group">
                        <label>Numéro TVA *</label>
                        <input
                          type="text"
                          value={formData.numeroTVA}
                          onChange={(e) => handleInputChange('numeroTVA', e.target.value)}
                          placeholder="BE0XXX.XXX.XXX"
                        />
                      </div>
                      <div className="form-group">
                        <label>Secteur d'activité</label>
                        <input
                          type="text"
                          value={formData.secteurActivite}
                          onChange={(e) => handleInputChange('secteurActivite', e.target.value)}
                          placeholder="Ex: Commerce, Industrie..."
                        />
                      </div>
                      <div className="form-group">
                        <label>Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="contact@entreprise.be"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Étape 4: Informations logement */}
            {currentStep === 4 && (
              <div className="form-step fade-in">
                <h2>Informations sur votre {formData.profil === 'particulier' ? 'logement' : 'bâtiment'}</h2>
                <p>Ces détails nous aident à dimensionner votre installation</p>
                <div className="form-fields">
                  <div className="form-group">
                    <label>Adresse complète *</label>
                    <input
                      type="text"
                      value={formData.adresse}
                      onChange={(e) => handleInputChange('adresse', e.target.value)}
                      placeholder="Rue, numéro, code postal, ville"
                    />
                  </div>
                  {formData.profil === 'particulier' && (
                    <div className="form-group">
                      <label>Type de logement *</label>
                      <select
                        value={formData.typeLogement}
                        onChange={(e) => handleInputChange('typeLogement', e.target.value)}
                      >
                        <option value="">Sélectionnez</option>
                        <option value="maison">Maison</option>
                        <option value="appartement">Appartement</option>
                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label>Surface habitable (m²) *</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={formData.surfaceHabitable}
                      onChange={(e) => handleInputChange('surfaceHabitable', e.target.value)}
                      placeholder="150"
                    />
                    {formData.surfaceHabitable !== '' && !isStrictlyPositiveNumber(formData.surfaceHabitable) && (
                      <p className="field-error">Saisissez une surface strictement positive.</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Consommation annuelle d’énergie (kWh) *</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      required
                      value={formData.consommationActuelle}
                      onChange={(e) => handleInputChange('consommationActuelle', e.target.value)}
                      placeholder="3500"
                    />
                    {formData.consommationActuelle !== '' && !isStrictlyPositiveNumber(formData.consommationActuelle) && (
                      <p className="field-error">Saisissez une consommation strictement positive.</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Chauffage principal *</label>
                    <select value={formData.chauffage} onChange={(e) => handleInputChange('chauffage', e.target.value)}>
                      <option value="">Sélectionnez</option><option value="gaz">Gaz naturel</option><option value="electricite">Électricité</option><option value="pompe_chaleur">Pompe à chaleur</option><option value="mazout">Mazout</option><option value="inconnu">Je ne sais pas</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Niveau actuel d’isolation de la toiture *</label>
                    <select value={formData.niveauIsolation} onChange={(e) => handleInputChange('niveauIsolation', e.target.value)}>
                      <option value="">Sélectionnez</option><option value="aucune">Aucune isolation visible</option><option value="faible">Isolation ancienne ou faible</option><option value="recente">Isolation récente</option><option value="inconnu">Je ne sais pas</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Année approximative de construction *</label>
                    <select value={formData.anneeBatiment} onChange={(e) => handleInputChange('anneeBatiment', e.target.value)}>
                      <option value="">Sélectionnez</option><option value="avant_1970">Avant 1970</option><option value="1970_1990">1970 à 1990</option><option value="1991_2010">1991 à 2010</option><option value="apres_2010">Après 2010</option><option value="inconnu">Je ne sais pas</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Score PEB / EPC officiel (kWh/m².an) <span className="optional-label">facultatif</span></label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={formData.scorePebOfficiel}
                      onChange={(e) => handleInputChange('scorePebOfficiel', e.target.value)}
                      placeholder="Ex. 254"
                    />
                    <p className="form-hint">Recopiez uniquement la valeur de votre certificat. Elle améliore la comparaison régionale et n’est pas envoyée avec votre adresse.</p>
                  </div>
                  <div className="form-group">
                    <label>Prix de l’énergie *</label>
                    <select value={formData.tarifMode} onChange={(e) => handleInputChange('tarifMode', e.target.value)}>
                      <option value="">Sélectionnez</option><option value="facture">Je le saisis depuis ma facture</option><option value="inconnu">Je ne le connais pas</option>
                    </select>
                    {formData.tarifMode === 'facture' && <input type="number" min="0" step="0.001" required value={formData.tarifKwh} onChange={(e) => handleInputChange('tarifKwh', e.target.value)} placeholder="Ex. 0,30 €/kWh" />}
                    <p className="form-hint">Le prix €/kWh est indiqué sur votre facture. Sans ce prix, l’application affichera seulement une économie en kWh.</p>
                  </div>
                  {formData.region === 'Wallonie' && (
                    <div className="prime-profile-section">
                      <label className="prime-profile-toggle">
                        <input type="checkbox" checked={formData.demanderEstimationPrime} onChange={(event) => handleInputChange('demanderEstimationPrime', event.target.checked)} />
                        Estimer ma prime régionale (facultatif)
                      </label>
                      <p className="form-hint">Nous demandons une catégorie de revenus, jamais votre revenu exact. Ces informations sont optionnelles : vous pouvez continuer la simulation même si elles ne sont pas encore complétées.</p>
                      {formData.demanderEstimationPrime && (
                        <div className="prime-profile-fields">
                          <div className="form-group"><label>Année de construction *</label><input type="number" min="1800" max="2026" value={formData.anneeConstruction} onChange={(event) => handleInputChange('anneeConstruction', event.target.value)} placeholder="Ex. 1995" /></div>
                          <div className="form-group"><label>Surface de toiture à isoler (m²) *</label><input type="number" min="1" step="any" value={formData.surfaceTravauxM2} onChange={(event) => handleInputChange('surfaceTravauxM2', event.target.value)} placeholder="Ex. 100" /></div>
                          <div className="form-group"><label>Montant TTC du devis (€) *</label><input type="number" min="1" step="0.01" value={formData.coutTravauxTtc} onChange={(event) => handleInputChange('coutTravauxTtc', event.target.value)} placeholder="Ex. 5 400" /></div>
                          <div className="form-group"><label>Votre statut *</label><select value={formData.statutDemandeur} onChange={(event) => handleInputChange('statutDemandeur', event.target.value)}><option value="">Sélectionnez</option><option value="proprietaire">Propriétaire</option><option value="usufruitier">Usufruitier</option><option value="copropriete">Copropriété</option><option value="inconnu">Je ne sais pas</option></select></div>
                          <div className="form-group"><label>Catégorie de revenus wallonne *</label><select value={formData.categorieRevenus} onChange={(event) => handleInputChange('categorieRevenus', event.target.value)}><option value="">Sélectionnez</option><option value="r1">R1 — jusqu’à 28 900 €</option><option value="r2">R2 — 28 900 à 41 100 €</option><option value="r3">R3 — 41 100 à 54 300 €</option><option value="r4">R4 — 54 300 à 122 800 €</option><option value="inconnu">Je ne sais pas</option></select></div>
                          <div className="form-group"><label>Entrepreneur enregistré ? *</label><select value={formData.entrepreneurEnregistre} onChange={(event) => handleInputChange('entrepreneurEnregistre', event.target.value)}><option value="">Sélectionnez</option><option value="oui">Oui</option><option value="non">Non ou je ne sais pas</option></select></div>
                          <div className="form-group"><label>Isolant biosourcé ?</label><select value={formData.isolantBiosource} onChange={(event) => handleInputChange('isolantBiosource', event.target.value)}><option value="non">Non ou je ne sais pas</option><option value="oui">Oui</option></select></div>
                        </div>
                      )}
                    </div>
                  )}
                  {formData.region === 'Flandre' && (
                    <div className="prime-profile-section">
                      <label className="prime-profile-toggle">
                        <input type="checkbox" checked={formData.demanderEstimationPrime} onChange={(event) => handleInputChange('demanderEstimationPrime', event.target.checked)} />
                        Estimer ma Mijn VerbouwPremie (facultatif)
                      </label>
                      <p className="form-hint">Nous demandons une catégorie, jamais votre revenu exact. Ces informations sont optionnelles : vous pouvez continuer la simulation même si elles ne sont pas encore complétées.</p>
                      {formData.demanderEstimationPrime && (
                        <div className="prime-profile-fields">
                          <div className="form-group"><label>Montant TTC du devis (€) *</label><input type="number" min="1" step="0.01" value={formData.coutTravauxTtc} onChange={(event) => handleInputChange('coutTravauxTtc', event.target.value)} placeholder="Ex. 5 400" /></div>
                          <div className="form-group"><label>Montant HTVA du devis (€) *</label><input type="number" min="1" step="0.01" value={formData.coutTravauxHtva} onChange={(event) => handleInputChange('coutTravauxHtva', event.target.value)} placeholder="Ex. 4 500" /></div>
                          <div className="form-group"><label>Catégorie flamande *</label><select value={formData.categorieRevenusFlandre} onChange={(event) => handleInputChange('categorieRevenusFlandre', event.target.value)}><option value="">Sélectionnez</option><option value="f3">F3 — revenu bas</option><option value="f4">F4 — revenu le plus bas / location sociale</option><option value="autre">Autre catégorie</option></select></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Étape 5: Besoins énergétiques */}
            {currentStep === 5 && (
              <div className="form-step fade-in">
                <h2>Quel est votre besoin énergétique principal ?</h2>
                <p>Sélectionnez le type de solution qui vous intéresse</p>
                <div className="region-options">
                  <button
                    className={`region-card ${formData.besoinEnergetique === 'panneaux' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('besoinEnergetique', 'panneaux')}
                  >
                    <div className="region-icon">☀️</div>
                    <h3>Panneaux solaires</h3>
                    <p>Production d'électricité</p>
                  </button>
                  <button
                    className={`region-card ${formData.besoinEnergetique === 'batterie' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('besoinEnergetique', 'batterie')}
                  >
                    <div className="region-icon">🔋</div>
                    <h3>Batterie</h3>
                    <p>Stockage d'énergie</p>
                  </button>
                  <button
                    className={`region-card ${formData.besoinEnergetique === 'pompe' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('besoinEnergetique', 'pompe')}
                  >
                    <div className="region-icon">🌡️</div>
                    <h3>Pompe à chaleur</h3>
                    <p>Chauffage et climatisation</p>
                  </button>
                  <button
                    className={`region-card ${formData.besoinEnergetique === 'isolation' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('besoinEnergetique', 'isolation')}
                  >
                    <div className="region-icon">🏠</div>
                    <h3>Isolation toiture</h3>
                    <p>Confort et réduction des pertes de chaleur</p>
                  </button>
                  <button
                    className={`region-card ${formData.besoinEnergetique === 'tout' ? 'selected' : ''}`}
                    onClick={() => handleInputChange('besoinEnergetique', 'tout')}
                  >
                    <div className="region-icon">⚡</div>
                    <h3>Solution complète</h3>
                    <p>Conseil personnalisé</p>
                  </button>
                </div>
              </div>
            )}

            {/* Étape 6: Objectifs */}
            {currentStep === 6 && (
              <div className="form-step fade-in">
                <h2>Quels sont vos objectifs ?</h2>
                <p>Sélectionnez un ou plusieurs objectifs</p>
                <div className="objectives-grid">
                  {[
                    { id: 'economies', label: 'Réduire mes factures', icon: '💰' },
                    { id: 'autonomie', label: 'Être autonome en énergie', icon: '🔋' },
                    { id: 'ecologie', label: 'Réduire mon empreinte carbone', icon: '🌱' },
                    { id: 'valorisation', label: 'Valoriser mon bien', icon: '📈' },
                  ].map((obj) => (
                    <button
                      key={obj.id}
                      className={`objective-card ${
                        formData.objectifs.includes(obj.id) ? 'selected' : ''
                      }`}
                      onClick={() => handleObjectifToggle(obj.id)}
                    >
                      <div className="objective-icon">{obj.icon}</div>
                      <p>{obj.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="form-actions">
              {currentStep > 1 && (
                <button className="btn btn-secondary" onClick={handlePrevious}>
                  Précédent
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  className="btn btn-primary"
                  onClick={handleNext}
                  disabled={!canProceedToNextStep()}
                >
                  Suivant
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting || !canProceedToNextStep()}
                >
                  {submitting ? 'Création de la simulation...' : 'Voir ma simulation'}
                </button>
              )}
            </div>
            {submissionError && <p className="form-submission-error" role="alert">{submissionError}</p>}
            {previousSimulation && (
              <div className="previous-simulation-card" role="dialog" aria-labelledby="previous-simulation-title">
                <h3 id="previous-simulation-title">Une simulation existe déjà pour ce produit</h3>
                <p>
                  Consultez votre dernier résultat ou créez un nouveau calcul avec les informations que vous venez de saisir.
                </p>
                <div className="previous-simulation-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(simulationPath(previousSimulation), { state: { simulation: previousSimulation } })}
                  >
                    Voir le résultat précédent
                  </button>
                  <button className="btn btn-primary" onClick={handleRecalculate} disabled={submitting}>
                    {submitting ? 'Recalcul en cours...' : 'Recalculer'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulaire;
