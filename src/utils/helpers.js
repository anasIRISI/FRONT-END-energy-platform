/**
 * Fonctions utilitaires pour l'application
 */

/**
 * Formater un prix en euros belges
 * @param {number} price - Prix à formater
 * @returns {string} Prix formaté
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formater une date
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée
 */
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};

/**
 * Formater une date avec l'heure
 * @param {Date|string} date - Date à formater
 * @returns {string} Date et heure formatées
 */
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('fr-BE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

/**
 * Valider une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} true si valide
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valider un numéro de téléphone belge
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} true si valide
 */
export const isValidPhone = (phone) => {
  const regex = /^(\+32|0)[1-9][0-9]{7,8}$/;
  return regex.test(phone.replace(/\s/g, ''));
};

/**
 * Valider un numéro de TVA belge
 * @param {string} tva - Numéro TVA à valider
 * @returns {boolean} true si valide
 */
export const isValidTVA = (tva) => {
  const regex = /^BE[0-9]{10}$/;
  return regex.test(tva.replace(/\./g, '').replace(/\s/g, ''));
};

/**
 * Truncate un texte
 * @param {string} text - Texte à tronquer
 * @param {number} length - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Générer un ID unique
 * @returns {string} ID unique
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Debounce une fonction
 * @param {Function} func - Fonction à debounce
 * @param {number} wait - Temps d'attente en ms
 * @returns {Function} Fonction debouncée
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Scroll smooth vers un élément
 * @param {string} elementId - ID de l'élément
 */
export const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Copier du texte dans le presse-papiers
 * @param {string} text - Texte à copier
 * @returns {Promise<boolean>} true si succès
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Vérifier si on est sur mobile
 * @returns {boolean} true si mobile
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Obtenir le nom du jour en français
 * @param {Date} date - Date
 * @returns {string} Nom du jour
 */
export const getDayName = (date) => {
  const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  return days[new Date(date).getDay()];
};

/**
 * Obtenir le nom du mois en français
 * @param {Date} date - Date
 * @returns {string} Nom du mois
 */
export const getMonthName = (date) => {
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  return months[new Date(date).getMonth()];
};

/**
 * Calculer la différence en jours entre deux dates
 * @param {Date} date1 - Première date
 * @param {Date} date2 - Deuxième date
 * @returns {number} Différence en jours
 */
export const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((new Date(date1) - new Date(date2)) / oneDay));
};

/**
 * Slugifier un texte (pour URLs)
 * @param {string} text - Texte à slugifier
 * @returns {string} Slug
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

/**
 * Sauvegarder dans localStorage de manière sécurisée
 * @param {string} key - Clé
 * @param {*} value - Valeur
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Récupérer depuis localStorage de manière sécurisée
 * @param {string} key - Clé
 * @param {*} defaultValue - Valeur par défaut
 * @returns {*} Valeur récupérée
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Supprimer de localStorage
 * @param {string} key - Clé
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Obtenir les paramètres de l'URL
 * @returns {Object} Paramètres de l'URL
 */
export const getUrlParams = () => {
  const params = {};
  const searchParams = new URLSearchParams(window.location.search);
  for (const [key, value] of searchParams) {
    params[key] = value;
  }
  return params;
};

/**
 * Mettre à jour les paramètres de l'URL
 * @param {Object} params - Nouveaux paramètres
 */
export const updateUrlParams = (params) => {
  const searchParams = new URLSearchParams(window.location.search);
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, params[key]);
    }
  });
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState({}, '', newUrl);
};
