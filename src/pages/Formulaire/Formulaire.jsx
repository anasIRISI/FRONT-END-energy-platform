import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { validateFormData, generateSimulation } from '../../utils/simulation';
import { submitForm, createSimulation } from '../../services/api';
import './Formulaire.css';

const Formulaire = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    profil: '',
    region: '',
    nom: '',
    email: '',
    telephone: '',
    typeLogement: '',
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

  const handleSubmit = async () => {
    setSubmitting(true);
    let recommendedProductId = productId ? parseInt(productId) : 1;
    
    if (!productId) {
      if (formData.besoinEnergetique === 'panneaux') {
        recommendedProductId = formData.consommationActuelle > 4000 ? 1 : 2;
      } else if (formData.besoinEnergetique === 'batterie') {
        recommendedProductId = formData.consommationActuelle > 4000 ? 3 : 4;
      } else if (formData.besoinEnergetique === 'pompe') {
        recommendedProductId = formData.profil === 'societe' ? 5 : 6;
      } else {
        recommendedProductId = 1;
      }
    }

    try {
      // 1. Envoi au backend Spring Boot (Création Visiteur + Formulaire)
      const formRes = await submitForm(formData);
      
      // 2. Création de la demande de simulation dans Spring Boot si possible
      let backendSimulation = null;
      if (formRes && formRes.id) {
        try {
          backendSimulation = await createSimulation(formRes.id, recommendedProductId);
        } catch (simErr) {
          console.warn('Création simulation API échouée, fallback local:', simErr);
        }
      }

      // 3. Obtenir simulation locale fallback au cas où
      const localSimulation = generateSimulation(formData, recommendedProductId);
      const simulationId = backendSimulation?.id || formRes?.id || localSimulation.id;

      navigate(`/simulation/${simulationId}`, {
        state: { simulation: backendSimulation || localSimulation },
      });
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      const localSimulation = generateSimulation(formData, recommendedProductId);
      navigate(`/simulation/${localSimulation.id}`, {
        state: { simulation: localSimulation },
      });
    } finally {
      setSubmitting(false);
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
                      <label>Type de logement</label>
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
                    <label>Surface habitable (m²)</label>
                    <input
                      type="number"
                      value={formData.surfaceHabitable}
                      onChange={(e) => handleInputChange('surfaceHabitable', e.target.value)}
                      placeholder="150"
                    />
                  </div>
                  <div className="form-group">
                    <label>Consommation électrique annuelle (kWh) *</label>
                    <input
                      type="number"
                      value={formData.consommationActuelle}
                      onChange={(e) => handleInputChange('consommationActuelle', e.target.value)}
                      placeholder="3500"
                    />
                  </div>
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
                  disabled={!canProceedToNextStep()}
                >
                  Voir ma simulation
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formulaire;
