/**
 * Service Analytics pour tracker les événements
 * Compatible avec Google Analytics, Matomo, etc.
 */

/**
 * Initialiser le tracking
 */
export const initAnalytics = () => {
  // Configuration Google Analytics (si utilisé)
  const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;
  
  if (GA_TRACKING_ID && typeof window !== 'undefined') {
    // Charger le script GA
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID);
  }
};

/**
 * Tracker une page vue
 * @param {string} path - Chemin de la page
 * @param {string} title - Titre de la page
 */
export const trackPageView = (path, title) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.REACT_APP_GA_TRACKING_ID, {
      page_path: path,
      page_title: title,
    });
  }

  console.log('Page view:', path, title);
};

/**
 * Tracker un événement personnalisé
 * @param {string} category - Catégorie de l'événement
 * @param {string} action - Action effectuée
 * @param {string} label - Label optionnel
 * @param {number} value - Valeur optionnelle
 */
export const trackEvent = (category, action, label = null, value = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  console.log('Event:', { category, action, label, value });
};

/**
 * Tracker une conversion (formulaire soumis, simulation complétée)
 * @param {string} conversionId - ID de conversion
 * @param {number} value - Valeur de la conversion
 */
export const trackConversion = (conversionId, value = 0) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: conversionId,
      value: value,
      currency: 'EUR',
    });
  }

  console.log('Conversion:', conversionId, value);
};

/**
 * Tracker une erreur
 * @param {string} description - Description de l'erreur
 * @param {boolean} fatal - Erreur fatale ou non
 */
export const trackError = (description, fatal = false) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: description,
      fatal: fatal,
    });
  }

  console.error('Error tracked:', description);
};

/**
 * Événements spécifiques à l'application
 */

export const analytics = {
  // Navigation
  viewHome: () => trackPageView('/', 'Accueil'),
  viewCatalogue: () => trackPageView('/catalogue', 'Catalogue'),
  viewProduct: (productId) => trackPageView(`/produit/${productId}`, 'Détail Produit'),
  
  // Formulaire
  startForm: (productId) => trackEvent('Formulaire', 'Démarrage', `Produit ${productId}`),
  completeFormStep: (step) => trackEvent('Formulaire', 'Étape complétée', `Étape ${step}`),
  submitForm: (profil, region) => trackEvent('Formulaire', 'Soumission', `${profil} - ${region}`),
  
  // Simulation
  viewSimulation: (simulationId) => trackEvent('Simulation', 'Consultation', simulationId),
  downloadSimulation: (simulationId) => trackEvent('Simulation', 'Téléchargement', simulationId),
  
  // Rendez-vous
  startAppointment: () => trackEvent('Rendez-vous', 'Démarrage'),
  submitAppointment: (type) => trackEvent('Rendez-vous', 'Confirmation', type),
  
  // Chatbot
  openChatbot: () => trackEvent('Chatbot', 'Ouverture'),
  sendChatMessage: (messageType) => trackEvent('Chatbot', 'Message', messageType),
  
  // Produits
  clickProduct: (productId, productName) => trackEvent('Produit', 'Clic', productName),
  selectCategory: (category) => trackEvent('Catalogue', 'Filtre', category),
  
  // Actions
  clickCTA: (ctaName, location) => trackEvent('CTA', 'Clic', `${ctaName} - ${location}`),
  shareContent: (contentType, method) => trackEvent('Partage', contentType, method),
  
  // Conversions
  completeSimulation: (value) => trackConversion('simulation_complete', value),
  bookAppointment: () => trackConversion('appointment_booked'),
};

export default analytics;
