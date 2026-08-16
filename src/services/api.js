import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/constants';

// Configuration d'Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête (pour ajouter token d'authentification si nécessaire)
api.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse (gestion des erreurs)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erreur de réponse du serveur
      console.error('API Error:', error.response.data);
      
      // Gestion spécifique selon le code d'erreur
      switch (error.response.status) {
        case 401:
          // Non authentifié - redirection vers login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          break;
        case 403:
          // Accès refusé
          console.error('Accès refusé');
          break;
        case 404:
          console.error('Ressource non trouvée');
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur inconnue');
      }
    } else if (error.request) {
      // Pas de réponse du serveur
      console.error('Pas de réponse du serveur');
    } else {
      // Erreur de configuration de la requête
      console.error('Erreur de configuration:', error.message);
    }
    return Promise.reject(error);
  }
);

// ==================== PRODUCTS ====================

/**
 * Récupérer tous les produits
 */
export const getProducts = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.products);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    throw error;
  }
};

/**
 * Récupérer un produit par ID
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.products}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du produit ${id}:`, error);
    throw error;
  }
};

// ==================== SIMULATIONS ====================

/**
 * Créer une nouvelle simulation
 */
export const createSimulation = async (simulationData) => {
  try {
    const response = await api.post(API_ENDPOINTS.simulations, simulationData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de la simulation:', error);
    throw error;
  }
};

/**
 * Récupérer une simulation par ID
 */
export const getSimulationById = async (id) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.simulations}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la simulation ${id}:`, error);
    throw error;
  }
};

// ==================== FORMULAIRES ====================

/**
 * Soumettre un formulaire
 */
export const submitForm = async (formData) => {
  try {
    const response = await api.post(API_ENDPOINTS.forms, formData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la soumission du formulaire:', error);
    throw error;
  }
};

// ==================== RENDEZ-VOUS ====================

/**
 * Créer un rendez-vous
 */
export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post(API_ENDPOINTS.appointments, appointmentData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    throw error;
  }
};

/**
 * Récupérer les créneaux disponibles
 */
export const getAvailableSlots = async (date) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.appointments}/available`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
    throw error;
  }
};

/**
 * Annuler un rendez-vous
 */
export const cancelAppointment = async (id) => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.appointments}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de l'annulation du rendez-vous ${id}:`, error);
    throw error;
  }
};

// ==================== CHATBOT ====================

/**
 * Envoyer un message au chatbot
 */
export const sendChatMessage = async (message, context = {}) => {
  try {
    const response = await api.post(API_ENDPOINTS.chatbot, {
      message,
      context,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message au chatbot:', error);
    throw error;
  }
};

// ==================== PRIMES ====================

/**
 * Calculer les primes disponibles
 */
export const calculatePrimes = async (region, productType, formData) => {
  try {
    const response = await api.post('/primes/calculate', {
      region,
      productType,
      formData,
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du calcul des primes:', error);
    throw error;
  }
};

// ==================== CONTACT ====================

/**
 * Envoyer un message de contact
 */
export const sendContactMessage = async (contactData) => {
  try {
    const response = await api.post('/contact', contactData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};

export default api;
