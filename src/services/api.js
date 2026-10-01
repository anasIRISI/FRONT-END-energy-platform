import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, CHATBOT_SERVICE_URL, STORAGE_KEYS } from '../config/constants';
import { products as mockProducts, getProductById as getMockProductById } from '../data/products';

// Configuration d'Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête (ajoute admin_token ou auth_token si présent)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse (gestion globale des erreurs)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      if (error.response.status === 401 || error.response.status === 403) {
        // En cas d'erreur de sécurité sur l'espace d'administration, nettoyer le token invalide
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          console.warn('Token JWT invalide ou expiré (401/403). Redirection vers /admin/login...');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          window.location.href = '/admin/login';
        }
      }
    } else if (error.request) {
      console.warn('Pas de réponse du serveur Spring Boot. Mode hors-ligne / fallback.');
    } else {
      console.error('Erreur configuration requête:', error.message);
    }
    return Promise.reject(error);
  }
);

// Helper pour formater/enrichir les produits venus du backend Spring Boot
const formatProduct = (backendProduct) => {
  if (!backendProduct) return null;
  const mockMatch = mockProducts.find((p) => p.id === backendProduct.id || (p.name && p.name.toLowerCase() === (backendProduct.nom || '').toLowerCase()));
  return {
    id: backendProduct.id,
    name: backendProduct.nom || mockMatch?.name || 'Produit Énergie',
    nom: backendProduct.nom || mockMatch?.name || 'Produit Énergie',
    type: backendProduct.type || mockMatch?.type || 'panneaux',
    price: backendProduct.prix ?? mockMatch?.price ?? 5000,
    prix: backendProduct.prix ?? mockMatch?.price ?? 5000,
    power: mockMatch?.power || 'Solution Énergie',
    description: backendProduct.specifications || mockMatch?.description || 'Solution d\'énergie durable et performante.',
    fullDescription: backendProduct.specifications || mockMatch?.fullDescription || 'Solution d\'énergie durable et performante pour votre maison.',
    image: mockMatch?.image || (backendProduct.type?.includes('batterie') ? '🔋' : backendProduct.type?.includes('pompe') ? '🌡️' : '☀️'),
    specifications: backendProduct.specifications ? { 'Spécifications': backendProduct.specifications } : (mockMatch?.specifications || {}),
    shortSpecs: mockMatch?.shortSpecs || ['Haute performance', 'Garantie constructeur'],
    features: mockMatch?.features || ['Économie d\'énergie', 'Installation certifiée'],
    advantages: mockMatch?.advantages || [],
  };
};

// ==================== PRODUITS ====================

// Lecture stricte du catalogue backend. Contrairement à getProducts, cette
// fonction ne bascule pas sur les mocks : une simulation doit toujours
// référencer un produit réellement disponible côté Spring Boot.
export const getBackendProducts = async () => {
  const response = await api.get(API_ENDPOINTS.products);
  if (!Array.isArray(response.data)) {
    throw new Error('Le catalogue backend est invalide ou indisponible.');
  }
  return response.data.map(formatProduct);
};

export const findCompatibleBackendProduct = (products, energyNeed) => {
  const predicates = {
    panneaux: (type) => type.includes('panneau'),
    batterie: (type) => type.includes('batterie'),
    pompe: (type) => type.includes('pompe') && type.includes('chaleur'),
    isolation: (type) => type.includes('isolation'),
  };

  const predicate = predicates[energyNeed];
  if (!predicate) return null;

  return products.find((product) => predicate(String(product.type || '').toLocaleLowerCase('fr-BE'))) || null;
};

export const getProducts = async (type) => {
  try {
    const params = (type && type !== 'all') ? { type } : {};
    const response = await api.get(API_ENDPOINTS.products, { params });
    if (Array.isArray(response.data)) {
      return response.data.map(formatProduct);
    }
    return [];
  } catch (error) {
    console.warn('Backend non disponible pour getProducts, utilisation des données locales:', error.message);
    return type && type !== 'all' ? mockProducts.filter((p) => p.type === type) : mockProducts;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.products}/${id}`);
    if (response.data) {
      return formatProduct(response.data);
    }
    return getMockProductById(id);
  } catch (error) {
    console.warn(`Backend non disponible pour getProductById(${id}), utilisation du mock:`, error.message);
    return getMockProductById(id);
  }
};

// ==================== REGIONS ====================

export const getRegions = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.regions);
    return response.data;
  } catch (error) {
    console.warn('Backend non disponible pour getRegions:', error.message);
    return [];
  }
};

// ==================== VISITEURS & FORMULAIRES ====================

export const createVisiteur = async (visiteurData) => {
  try {
    const response = await api.post(API_ENDPOINTS.visiteurs, visiteurData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du visiteur:', error);
    throw error;
  }
};

export const createFormulaire = async (visiteurId, regionIds = [1]) => {
  try {
    const response = await api.post(API_ENDPOINTS.forms, { visiteurId, regionIds });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du formulaire:', error);
    throw error;
  }
};

export const updateFormulaireEtape = async (formulaireId, etape, reponses) => {
  try {
    const response = await api.put(`${API_ENDPOINTS.forms}/${formulaireId}/etape`, { etape, reponses });
    return response.data;
  } catch (error) {
    console.error(`Erreur mise à jour étape ${etape} du formulaire ${formulaireId}:`, error);
    throw error;
  }
};

export const submitFormulaire = async (formulaireId) => {
  try {
    const response = await api.post(`${API_ENDPOINTS.forms}/${formulaireId}/soumettre`);
    return response.data;
  } catch (error) {
    console.error(`Erreur finalisation du formulaire ${formulaireId}:`, error);
    throw error;
  }
};

// Création atomique du parcours formulaire : aucun résultat local n'est créé
// si une étape backend échoue.
export const submitForm = async (formData) => {
  const surface = String(formData.surfaceHabitable ?? '').trim();
  const consommation = String(formData.consommationActuelle ?? '').trim();
  const valuesAreValid = (value) => /^\d+(?:[.,]\d+)?$/.test(value) && Number(value.replace(',', '.')) > 0;

  if (!valuesAreValid(surface) || !valuesAreValid(consommation)) {
    const error = new Error('La surface et la consommation doivent être des nombres strictement positifs.');
    error.code = 'INVALID_SIMULATION_INPUT';
    throw error;
  }

  const regionIdsByName = { Wallonie: 1, Bruxelles: 2, Flandre: 3 };
  const regionId = formData.regionId || regionIdsByName[formData.region] || 1;
  const hasCompletePrimeProfile = formData.demanderEstimationPrime && (
    formData.region === 'Flandre'
      ? valuesAreValid(String(formData.coutTravauxTtc ?? '').trim())
        && valuesAreValid(String(formData.coutTravauxHtva ?? '').trim())
        && ['f3', 'f4'].includes(String(formData.categorieRevenusFlandre || '').toLowerCase())
      : formData.region === 'Wallonie'
        && Boolean(String(formData.anneeConstruction || '').trim())
        && valuesAreValid(String(formData.surfaceTravauxM2 ?? '').trim())
        && valuesAreValid(String(formData.coutTravauxTtc ?? '').trim())
        && !['', 'inconnu'].includes(String(formData.statutDemandeur || '').toLowerCase())
        && !['', 'inconnu'].includes(String(formData.categorieRevenus || '').toLowerCase())
        && Boolean(formData.entrepreneurEnregistre)
  );

  // 1. Créer le visiteur
  const visiteur = await createVisiteur({
    profil: (formData.profil || 'particulier').toUpperCase(),
    email: formData.email,
    regionId,
    adresseDomicile: `${formData.adresse || ''} ${formData.codePostal || ''} ${formData.ville || ''}`.trim(),
    typeLogement: formData.typeLogement || 'Maison individuelle',
    raisonSociale: formData.raisonSociale || null,
    numeroTVA: formData.numeroTVA || null,
    secteurActivite: formData.secteurActivite || null,
  });
  localStorage.setItem('energieplus_visiteur_id', String(visiteur.id));

  // 2. Créer le formulaire
  const formulaire = await createFormulaire(visiteur.id, [regionId]);
  localStorage.setItem('energieplus_formulaire_id', String(formulaire.id));

  // 3. Renseigner les réponses avec les clés strictement attendues par le backend.
  await updateFormulaireEtape(formulaire.id, 5, {
    surface,
    consommation,
    typeLogement: String(formData.typeLogement || ''),
    orientation: String(formData.orientation || ''),
    objectifs: Array.isArray(formData.objectifs) ? formData.objectifs.join(',') : String(formData.objectifs || ''),
    chauffage: String(formData.chauffage || ''),
    tarifMode: String(formData.tarifMode || ''),
    tarifKwh: String(formData.tarifKwh || ''),
    niveauIsolation: String(formData.niveauIsolation || ''),
    anneeBatiment: String(formData.anneeBatiment || ''),
    scorePebOfficiel: String(formData.scorePebOfficiel || ''),
    // Une simulation continue sans prime si les informations de prime restent incomplètes.
    demanderEstimationPrime: String(Boolean(hasCompletePrimeProfile)),
    anneeConstruction: String(formData.anneeConstruction || ''),
    surfaceTravauxM2: String(formData.surfaceTravauxM2 || ''),
    coutTravauxTtc: String(formData.coutTravauxTtc || ''),
    coutTravauxHtva: String(formData.coutTravauxHtva || ''),
    statutDemandeur: String(formData.statutDemandeur || ''),
    categorieRevenus: String(formData.categorieRevenus || ''),
    categorieRevenusFlandre: String(formData.categorieRevenusFlandre || ''),
    entrepreneurEnregistre: String(formData.entrepreneurEnregistre || ''),
    isolantBiosource: String(formData.isolantBiosource || 'non'),
  });

  // 4. Finaliser le formulaire avant toute création de simulation.
  return submitFormulaire(formulaire.id);
};

// ==================== SIMULATIONS ====================

const readSimulationHistory = () => {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.simulationHistory) || '[]');
    return Array.isArray(history) ? history : [];
  } catch {
    return [];
  }
};

export const getLatestSimulationForProduct = (productId) => {
  const normalizedProductId = Number(productId);
  if (!Number.isInteger(normalizedProductId) || normalizedProductId <= 0) return null;

  return readSimulationHistory()
    .filter((simulation) => Number(simulation.produit?.id || simulation.produitId) === normalizedProductId)
    .sort((first, second) => new Date(second.dateCalcul || 0) - new Date(first.dateCalcul || 0))[0] || null;
};

export const getLatestSimulation = () => readSimulationHistory()
  .sort((first, second) => new Date(second.dateCalcul || 0) - new Date(first.dateCalcul || 0))[0] || null;

export const rememberSimulation = (simulation) => {
  const simulationId = Number(simulation?.id);
  const productId = Number(simulation?.produit?.id || simulation?.produitId);
  if (!Number.isInteger(simulationId) || !Number.isInteger(productId) || productId <= 0) return;

  const historyWithoutCurrent = readSimulationHistory().filter((item) => Number(item.id) !== simulationId);
  const updatedHistory = [{
    ...simulation,
    produitId: productId,
    dateCalcul: simulation.dateCalcul || new Date().toISOString(),
  }, ...historyWithoutCurrent]
    .sort((first, second) => new Date(second.dateCalcul || 0) - new Date(first.dateCalcul || 0))
    .slice(0, 20);

  localStorage.setItem(STORAGE_KEYS.simulationHistory, JSON.stringify(updatedHistory));
};

export const createSimulation = async (formulaireId, produitId) => {
  try {
    const response = await api.post(API_ENDPOINTS.simulations, { formulaireId, produitId });
    return response.data;
  } catch (error) {
    console.error('Erreur création simulation backend:', error);
    throw error;
  }
};

export const getSimulationByReference = async (reference) => {
  const response = await api.get(`${API_ENDPOINTS.simulations}/reference/${encodeURIComponent(reference)}`);
  return response.data;
};

// ==================== RENDEZ-VOUS ====================

export const createAppointment = async (appointmentData) => {
  try {
    const payload = {
      visiteurId: appointmentData.visiteurId || 1,
      date: appointmentData.date, // YYYY-MM-DD
      heure: appointmentData.heure || appointmentData.time || '10:00',
    };
    const response = await api.post(API_ENDPOINTS.appointments, payload);
    return response.data;
  } catch (error) {
    console.error('Erreur création rendez-vous backend:', error);
    throw error;
  }
};

// ==================== CHATBOT ====================

export const getChatbotIdentity = () => {
  const visiteurId = Number(localStorage.getItem('energieplus_visiteur_id'));
  const formulaireId = Number(localStorage.getItem('energieplus_formulaire_id'));
  return {
    visiteurId: Number.isInteger(visiteurId) && visiteurId > 0 ? visiteurId : null,
    formulaireId: Number.isInteger(formulaireId) && formulaireId > 0 ? formulaireId : null,
  };
};

// Les créneaux viennent exclusivement du backend : aucun créneau déjà
// planifié ou confirmé n'est proposé au visiteur.
export const getAvailableAppointmentSlots = async (date) => {
  const response = await api.get(`${API_ENDPOINTS.appointments}/creneaux-disponibles`, { params: { date } });
  return Array.isArray(response.data) ? response.data : [];
};

export const sendChatMessage = async (messageText, conversationId = null, visiteurId = null, workflow = {}) => {
  try {
    const response = await axios.post(`${CHATBOT_SERVICE_URL}/chat`, {
      ...(visiteurId ? { visiteurId } : {}),
      conversationId,
      message: messageText,
      ...workflow,
    });
    return response.data;
  } catch (error) {
    console.warn('Backend chatbot indisponible, fallback message local:', error.message);
    throw error;
  }
};

// ==================== ADMIN ====================

export const adminLogin = async (login, motDePasse) => {
  try {
    const response = await api.post(API_ENDPOINTS.admin.login, { login, motDePasse });
    if (response.data && response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Erreur authentification admin:', error);
    throw error;
  }
};

export const getAdminStatistiques = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.admin.statistiques, {
      params: { refresh: Date.now() },
      headers: { 'Cache-Control': 'no-cache' },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération statistiques admin:', error);
    throw error;
  }
};

export const getAdminFormulaires = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.admin.formulaires, {
      params: { refresh: Date.now() },
      headers: { 'Cache-Control': 'no-cache' },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération formulaires admin:', error);
    throw error;
  }
};

export const getAdminRendezVous = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.admin.rendezVous, {
      params: { refresh: Date.now() },
      headers: { 'Cache-Control': 'no-cache' },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur récupération rendez-vous admin:', error);
    throw error;
  }
};

export const createAdminProduit = async (produitData) => {
  try {
    const response = await api.post(API_ENDPOINTS.admin.produits, produitData);
    return response.data;
  } catch (error) {
    console.error('Erreur création produit admin:', error);
    throw error;
  }
};

export const updateAdminProduit = async (id, produitData) => {
  try {
    const response = await api.put(`${API_ENDPOINTS.admin.produits}/${id}`, produitData);
    return response.data;
  } catch (error) {
    console.error(`Erreur modification produit admin ${id}:`, error);
    throw error;
  }
};

export const deleteAdminProduit = async (id) => {
  try {
    await api.delete(`${API_ENDPOINTS.admin.produits}/${id}`);
    return true;
  } catch (error) {
    console.error(`Erreur suppression produit admin ${id}:`, error);
    throw error;
  }
};

export const updateAdminRendezVous = async (id, statut) => {
  try {
    const response = await api.put(`${API_ENDPOINTS.admin.rendezVous}/${id}`, { statut });
    return response.data;
  } catch (error) {
    console.error(`Erreur modification statut RDV ${id}:`, error);
    throw error;
  }
};

const downloadCsvFile = (filename, csvContent) => {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const exportAdminFormulairesCsv = async (fallbackFormsList = []) => {
  try {
    const response = await api.get(API_ENDPOINTS.admin.exportCsv, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'formulaires.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    return true;
  } catch (error) {
    console.warn('Backend export CSV indisponible, génération client:', error.message);
    const headers = 'ID Formulaire;Visiteur ID;Profil;Régions;Étape;Date de soumission\n';
    const rows = fallbackFormsList.map((f) => {
      const regionsStr = f.regions?.map((r) => r.nom).join(', ') || 'N/A';
      return `${f.id};${f.visiteurId || ''};"${f.profil || ''}";"${regionsStr}";${f.etapeActuelle || 5};"${f.dateSoumission || ''}"`;
    }).join('\n');
    downloadCsvFile('formulaires.csv', headers + rows);
    return true;
  }
};

export const exportAdminRendezVousCsv = (rdvList = []) => {
  const headers = 'ID Rendez-vous;Visiteur ID;Date;Heure;Statut\n';
  const rows = rdvList.map((r) => `${r.id};${r.visiteurId || ''};"${r.date || ''}";"${r.heure || ''}";"${r.statut || ''}"`).join('\n');
  downloadCsvFile('rendez_vous.csv', headers + rows);
  return true;
};

export const exportAdminProduitsCsv = (productsList = []) => {
  const headers = 'ID Produit;Nom;Type;Prix (€);Spécifications\n';
  const rows = productsList.map((p) => {
    const name = p.name || p.nom || '';
    const specs = p.specifications ? (typeof p.specifications === 'string' ? p.specifications : JSON.stringify(p.specifications)) : '';
    return `${p.id};"${name}";"${p.type || ''}";${p.price || p.prix || 0};"${specs.replace(/"/g, '""')}"`;
  }).join('\n');
  downloadCsvFile('produits_catalogue.csv', headers + rows);
  return true;
};

export const exportAdminStatsCsv = (stats = {}) => {
  const headers = 'Indicateur;Valeur\n';
  const rows = [
    `Formulaires reçus;${stats.formulairesRecus || 0}`,
    `Total Visiteurs;${stats.totalVisiteurs || 0}`,
    `Visiteurs Particuliers;${stats.particuliers || 0}`,
    `Visiteurs Sociétés;${stats.societes || 0}`,
    `Taux de conversion;${((stats.tauxConversion || 0) * 100).toFixed(1)}%`,
    `Formulaires Wallonie;${stats.repartitionParRegion?.Wallonie || 0}`,
    `Formulaires Bruxelles;${stats.repartitionParRegion?.Bruxelles || 0}`,
    `Formulaires Flandre;${stats.repartitionParRegion?.Flandre || 0}`,
  ].join('\n');
  downloadCsvFile('statistiques_globales.csv', headers + rows);
  return true;
};

export default api;
