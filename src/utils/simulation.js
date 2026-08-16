import { getProductById } from '../data/products';
import { calculatePrimes } from '../data/regions';

/**
 * Calcule un score basé sur les données du formulaire
 * @param {Object} formData - Données du formulaire
 * @returns {number} Score entre 0 et 10
 */
export const calculateScore = (formData) => {
  let score = 5; // Base score

  // Bonus pour objectifs écologiques
  if (formData.objectifs.includes('ecologie')) score += 1;
  if (formData.objectifs.includes('autonomie')) score += 1;
  
  // Bonus pour économies
  if (formData.objectifs.includes('economies')) score += 0.5;
  
  // Bonus pour consommation élevée (plus d'économies potentielles)
  if (formData.consommationActuelle > 4000) score += 1;
  if (formData.consommationActuelle > 6000) score += 0.5;

  // Bonus pour surface importante
  if (formData.surfaceHabitable > 150) score += 0.5;
  if (formData.surfaceHabitable > 200) score += 0.5;

  return Math.min(10, parseFloat(score.toFixed(1)));
};

/**
 * Génère une simulation complète
 * @param {Object} formData - Données du formulaire
 * @param {number} productId - ID du produit
 * @returns {Object} Résultats de simulation
 */
export const generateSimulation = (formData, productId) => {
  const product = getProductById(productId);
  if (!product) return null;

  const score = calculateScore(formData);
  const primes = calculatePrimes(formData.region, product.type, product.price);
  
  // Calcul des économies annuelles estimées
  const economiesAnnuelles = calculateEconomies(product, formData.consommationActuelle);
  
  // Retour sur investissement
  const retourInvestissement = primes.finalPrice / economiesAnnuelles;

  // Production estimée (pour panneaux solaires)
  let productionAnnuelle = null;
  let autoconsommation = null;
  if (product.type === 'panneaux') {
    const puissance = parseFloat(product.power);
    productionAnnuelle = Math.round(puissance * 1000);
    autoconsommation = Math.min(95, Math.round((formData.consommationActuelle / productionAnnuelle) * 100));
  }

  // Réduction CO2
  const reductionCO2 = calculateCO2Reduction(product, formData.consommationActuelle);

  // Recommandations personnalisées
  const recommandations = generateRecommendations(formData, product, score);

  return {
    id: Date.now(),
    score,
    product,
    coutEstime: product.price,
    primes,
    coutFinal: primes.finalPrice,
    economiesAnnuelles,
    retourInvestissement: parseFloat(retourInvestissement.toFixed(1)),
    productionAnnuelle,
    autoconsommation,
    reductionCO2,
    recommandations,
    formData,
    dateCalcul: new Date(),
  };
};

/**
 * Calcule les économies annuelles estimées
 */
const calculateEconomies = (product, consommation) => {
  const tarifMoyen = 0.30; // €/kWh

  switch (product.type) {
    case 'panneaux':
      const puissance = parseFloat(product.power);
      const production = puissance * 1000; // kWh/an
      const economie = Math.min(production, consommation) * tarifMoyen * 0.8;
      return Math.round(economie);

    case 'batterie':
      // Augmente l'autoconsommation de 30%
      const gainAutoconso = consommation * 0.3 * tarifMoyen;
      return Math.round(gainAutoconso);

    case 'pompe':
      // Économies sur chauffage (60% par rapport à électrique)
      const coutChauffage = consommation * 0.4 * tarifMoyen; // 40% pour chauffage
      const economiesPompe = coutChauffage * 0.6;
      return Math.round(economiesPompe);

    default:
      return 1000;
  }
};

/**
 * Calcule la réduction d'empreinte carbone
 */
const calculateCO2Reduction = (product, consommation) => {
  const facteurCO2 = 0.45; // kg CO2/kWh

  switch (product.type) {
    case 'panneaux':
      const puissance = parseFloat(product.power);
      const production = puissance * 1000;
      return parseFloat(((production * facteurCO2) / 1000).toFixed(1)); // tonnes

    case 'pompe':
      const reductionConso = consommation * 0.4 * 0.6;
      return parseFloat(((reductionConso * facteurCO2) / 1000).toFixed(1));

    default:
      return 1.5;
  }
};

/**
 * Génère des recommandations personnalisées
 */
const generateRecommendations = (formData, product, score) => {
  const recommandations = [];

  // Recommandation principale selon le produit
  if (product.type === 'panneaux') {
    recommandations.push({
      titre: 'Installation recommandée',
      description: `${product.name} adapté à votre consommation de ${formData.consommationActuelle} kWh/an`,
      icon: '✨',
    });
  } else if (product.type === 'batterie') {
    recommandations.push({
      titre: 'Stockage optimal',
      description: `Capacité ${product.power} idéale pour votre profil`,
      icon: '🔋',
    });
  } else {
    recommandations.push({
      titre: 'Chauffage efficace',
      description: `${product.name} pour un confort optimal toute l'année`,
      icon: '🌡️',
    });
  }

  // Recommandations selon le score
  if (score >= 8) {
    recommandations.push({
      titre: 'Excellent choix',
      description: 'Votre projet présente un très bon potentiel de rentabilité',
      icon: '⭐',
    });
  } else if (score >= 6) {
    recommandations.push({
      titre: 'Bon potentiel',
      description: 'Optimisez votre installation avec nos experts',
      icon: '📊',
    });
  }

  // Recommandation selon profil
  if (formData.profil === 'societe') {
    recommandations.push({
      titre: 'Avantages professionnels',
      description: 'Déduction fiscale et amélioration de votre bilan carbone',
      icon: '🏢',
    });
  }

  // Prochaine étape
  recommandations.push({
    titre: 'Prochaine étape',
    description: 'Planifier une visite technique gratuite pour confirmer la faisabilité',
    icon: '🔧',
  });

  return recommandations;
};

/**
 * Valide les données du formulaire
 */
export const validateFormData = (formData, step) => {
  switch (step) {
    case 1:
      return formData.profil !== '';
    case 2:
      return formData.region !== '';
    case 3:
      if (formData.profil === 'particulier') {
        return formData.nom && formData.email && formData.telephone;
      }
      return formData.raisonSociale && formData.numeroTVA && formData.email;
    case 4:
      return formData.adresse && formData.consommationActuelle;
    case 5:
      return formData.besoinEnergetique !== '';
    case 6:
      return formData.objectifs.length > 0;
    default:
      return false;
  }
};
