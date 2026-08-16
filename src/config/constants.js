// Configuration de l'application

export const APP_NAME = 'EnergiePlus';
export const APP_VERSION = '1.0.0';

// Contacts
export const CONTACT = {
  email: 'info@energieplus.be',
  phone: '+32 2 123 45 67',
  address: 'Avenue de l\'Énergie 1, 1000 Bruxelles',
};

// API Configuration (à adapter selon votre backend)
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  products: '/products',
  simulations: '/simulations',
  appointments: '/appointments',
  forms: '/forms',
  chatbot: '/chatbot',
};

// Formulaire
export const FORM_STEPS = {
  PROFIL: 1,
  REGION: 2,
  COORDONNEES: 3,
  LOGEMENT: 4,
  OBJECTIFS: 5,
};

export const PROFILS = {
  PARTICULIER: 'particulier',
  SOCIETE: 'societe',
};

export const REGIONS = {
  WALLONIE: 'Wallonie',
  BRUXELLES: 'Bruxelles',
  FLANDRE: 'Flandre',
};

export const PRODUCT_TYPES = {
  PANNEAUX: 'panneaux',
  BATTERIE: 'batterie',
  POMPE: 'pompe',
};

// Objectifs disponibles
export const OBJECTIFS = [
  {
    id: 'economies',
    label: 'Réduire mes factures',
    icon: '💰',
  },
  {
    id: 'autonomie',
    label: 'Être autonome en énergie',
    icon: '🔋',
  },
  {
    id: 'ecologie',
    label: 'Réduire mon empreinte carbone',
    icon: '🌱',
  },
  {
    id: 'valorisation',
    label: 'Valoriser mon bien',
    icon: '📈',
  },
];

// Types de rendez-vous
export const RDV_TYPES = {
  VISITE: 'visite',
  APPEL: 'appel',
};

// Créneaux horaires disponibles
export const AVAILABLE_TIME_SLOTS = [
  '09:00',
  '10:00',
  '11:00',
  '14:00',
  '15:00',
  '16:00',
];

// Tarifs et calculs
export const TARIFS = {
  electricite: 0.30, // €/kWh
  gaz: 0.08, // €/kWh
  co2Factor: 0.45, // kg CO2/kWh
};

// Messages du chatbot
export const CHATBOT_MESSAGES = {
  welcome: "Bonjour ! Je suis votre assistant énergie. Comment puis-je vous aider aujourd'hui ?",
  helpChoose: "Je peux vous aider à choisir ! Pour vous recommander le meilleur produit, j'ai besoin de quelques informations : Êtes-vous un particulier ou une société ? Et dans quelle région êtes-vous situé(e) ?",
  appointment: "Parfait ! Je peux vous aider à planifier un rendez-vous avec l'un de nos techniciens. Quelle date vous conviendrait ?",
  primes: "Les primes varient selon votre région (Wallonie, Bruxelles, Flandre) et votre profil. Après avoir rempli le formulaire, je calculerai automatiquement les primes auxquelles vous avez droit.",
};

// Animations
export const ANIMATION_DURATION = 300; // ms

// LocalStorage keys
export const STORAGE_KEYS = {
  formData: 'energieplus_form_data',
  simulation: 'energieplus_simulation',
  preferences: 'energieplus_preferences',
};

// Validation regex
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(\+32|0)[1-9][0-9]{7,8}$/,
  tva: /^BE[0-9]{10}$/,
  postalCode: /^[0-9]{4}$/,
};

// Messages de validation
export const VALIDATION_MESSAGES = {
  required: 'Ce champ est requis',
  email: 'Adresse email invalide',
  phone: 'Numéro de téléphone invalide (format: +32 XXX XX XX XX)',
  tva: 'Numéro TVA invalide (format: BE0XXX.XXX.XXX)',
};

// Social links
export const SOCIAL_LINKS = {
  facebook: '#',
  twitter: '#',
  linkedin: '#',
  instagram: '#',
};

// Features pour la page d'accueil
export const HOME_FEATURES = [
  {
    icon: '🔒',
    title: 'Simulation gratuite',
    description: 'Obtenez une estimation précise de votre installation en quelques minutes',
  },
  {
    icon: '🤖',
    title: 'Assistant IA intelligent',
    description: 'Notre chatbot vous guide et répond à toutes vos questions en temps réel',
  },
  {
    icon: '💶',
    title: 'Primes régionales',
    description: 'Calcul automatique des primes selon votre région',
  },
  {
    icon: '✅',
    title: 'Accompagnement complet',
    description: 'De la simulation à l\'installation, nous vous accompagnons',
  },
];
