export const products = [
  {
    id: 1,
    name: 'Panneaux Solaires Premium',
    type: 'panneaux',
    price: 8500,
    power: '6 kWc',
    description: 'Installation complète de panneaux photovoltaïques haute performance',
    fullDescription: 'Installation complète de panneaux photovoltaïques haute performance pour maximiser votre production d\'énergie solaire.',
    image: '☀️',
    specifications: {
      'Puissance': '6 kWc',
      'Rendement': '21%',
      'Garantie produit': '25 ans',
      'Garantie performance': '90% après 25 ans',
      'Dimensions panneau': '1.7m x 1.1m',
      'Nombre de panneaux': '16 panneaux',
      'Technologie': 'Monocristallin',
      'Monitoring': 'Inclus (app mobile)',
    },
    shortSpecs: ['Rendement: 21%', 'Garantie: 25 ans', 'Monitoring inclus'],
    features: [
      'Haute efficacité énergétique',
      'Résistant aux conditions climatiques extrêmes',
      'Installation par des professionnels certifiés',
      'Monitoring en temps réel via application',
      'Garantie fabricant 25 ans',
      'Maintenance annuelle incluse (2 ans)',
    ],
    advantages: [
      {
        icon: '💰',
        title: 'Économies importantes',
        description: 'Jusqu\'à 70% d\'économies sur vos factures d\'électricité',
      },
      {
        icon: '🌍',
        title: 'Écologique',
        description: 'Réduisez votre empreinte carbone de 2.8 tonnes/an',
      },
      {
        icon: '📈',
        title: 'Valorisation',
        description: 'Augmentez la valeur de votre bien immobilier',
      },
    ],
  },
  {
    id: 2,
    name: 'Panneaux Solaires Standard',
    type: 'panneaux',
    price: 5500,
    power: '4 kWc',
    description: 'Solution économique pour démarrer votre transition énergétique',
    fullDescription: 'Solution économique et performante pour débuter votre transition énergétique.',
    image: '☀️',
    specifications: {
      'Puissance': '4 kWc',
      'Rendement': '18%',
      'Garantie produit': '20 ans',
      'Garantie performance': '85% après 20 ans',
      'Nombre de panneaux': '11 panneaux',
      'Technologie': 'Polycristallin',
    },
    shortSpecs: ['Rendement: 18%', 'Garantie: 20 ans', 'Installation rapide'],
    features: [
      'Excellent rapport qualité/prix',
      'Installation rapide',
      'Garantie 20 ans',
      'Adapté aux petites surfaces',
    ],
    advantages: [
      {
        icon: '💰',
        title: 'Investissement maîtrisé',
        description: 'Solution accessible pour tous les budgets',
      },
      {
        icon: '⚡',
        title: 'Production efficace',
        description: 'Couvre jusqu\'à 60% de vos besoins',
      },
    ],
  },
  {
    id: 3,
    name: 'Batterie Lithium 10 kWh',
    type: 'batterie',
    price: 6500,
    power: '10 kWh',
    description: 'Stockez l\'énergie de vos panneaux pour une autonomie maximale',
    fullDescription: 'Batterie lithium-ion de haute capacité pour stocker l\'énergie produite par vos panneaux solaires.',
    image: '🔋',
    specifications: {
      'Capacité': '10 kWh',
      'Technologie': 'Lithium-ion',
      'Garantie': '10 ans',
      'Cycles de charge': '6000+',
      'Efficacité': '95%',
      'Puissance max': '5 kW',
    },
    shortSpecs: ['Capacité: 10 kWh', 'Garantie: 10 ans', 'Cycles: 6000+'],
    features: [
      'Stockage haute capacité',
      'Compatible avec tous les onduleurs',
      'Installation intérieure ou extérieure',
      'Monitoring intelligent',
      'Garantie 10 ans',
      'Protection contre les surcharges',
    ],
    advantages: [
      {
        icon: '🔋',
        title: 'Autonomie maximale',
        description: 'Jusqu\'à 90% d\'autoconsommation',
      },
      {
        icon: '💡',
        title: 'Alimentation de secours',
        description: 'Continue à fonctionner en cas de panne',
      },
      {
        icon: '📊',
        title: 'Gestion intelligente',
        description: 'Optimisation automatique de la charge',
      },
    ],
  },
  {
    id: 4,
    name: 'Batterie Lithium 5 kWh',
    type: 'batterie',
    price: 3800,
    power: '5 kWh',
    description: 'Solution de stockage compacte pour petites installations',
    fullDescription: 'Batterie compacte idéale pour les petites installations photovoltaïques.',
    image: '🔋',
    specifications: {
      'Capacité': '5 kWh',
      'Technologie': 'Lithium-ion',
      'Garantie': '10 ans',
      'Cycles de charge': '6000+',
      'Efficacité': '95%',
      'Puissance max': '2.5 kW',
    },
    shortSpecs: ['Capacité: 5 kWh', 'Garantie: 10 ans', 'Compact'],
    features: [
      'Format compact',
      'Installation facile',
      'Idéale pour petites toitures',
      'Monitoring via app',
    ],
    advantages: [
      {
        icon: '💰',
        title: 'Prix accessible',
        description: 'Solution économique pour débuter',
      },
      {
        icon: '📦',
        title: 'Compact',
        description: 'Prend peu de place',
      },
    ],
  },
  {
    id: 5,
    name: 'Pompe à Chaleur Air-Eau',
    type: 'pompe',
    price: 12000,
    power: '12 kW',
    description: 'Système de chauffage et eau chaude ultra-efficace',
    fullDescription: 'Pompe à chaleur air-eau haute performance pour chauffage et production d\'eau chaude sanitaire.',
    image: '🌡️',
    specifications: {
      'Puissance': '12 kW',
      'SCOP': '4.5',
      'Garantie': '7 ans',
      'Niveau sonore': '42 dB(A)',
      'Température min': '-20°C',
      'Réfrigérant': 'R32',
    },
    shortSpecs: ['SCOP: 4.5', 'Garantie: 7 ans', 'Silencieux'],
    features: [
      'Chauffage + eau chaude sanitaire',
      'Compatible radiateurs et plancher chauffant',
      'Contrôle intelligent via app',
      'Très silencieux',
      'Fonctionne jusqu\'à -20°C',
      'Installation par pro certifié',
    ],
    advantages: [
      {
        icon: '💰',
        title: 'Économies importantes',
        description: 'Jusqu\'à 60% d\'économies sur le chauffage',
      },
      {
        icon: '🌍',
        title: 'Écologique',
        description: 'Utilise l\'énergie renouvelable de l\'air',
      },
      {
        icon: '🔧',
        title: 'Fiable',
        description: 'Technologie éprouvée, garantie 7 ans',
      },
    ],
  },
  {
    id: 6,
    name: 'Pompe à Chaleur Air-Air',
    type: 'pompe',
    price: 4500,
    power: '5 kW',
    description: 'Chauffage et climatisation réversible',
    fullDescription: 'Climatiseur réversible pour chauffage en hiver et climatisation en été.',
    image: '🌡️',
    specifications: {
      'Puissance': '5 kW',
      'SCOP': '4.0',
      'Garantie': '5 ans',
      'Niveau sonore': '38 dB(A)',
      'Réfrigérant': 'R32',
      'Surface': 'Jusqu\'à 50m²',
    },
    shortSpecs: ['SCOP: 4.0', 'Garantie: 5 ans', 'Réversible'],
    features: [
      'Chauffage et climatisation',
      'Ultra silencieux',
      'Contrôle à distance',
      'Filtre purificateur d\'air',
    ],
    advantages: [
      {
        icon: '❄️',
        title: '2-en-1',
        description: 'Chaud en hiver, frais en été',
      },
      {
        icon: '💰',
        title: 'Économique',
        description: 'Consomme 4x moins qu\'un chauffage électrique',
      },
    ],
  },
];

export const getProductById = (id) => {
  return products.find(p => p.id === parseInt(id));
};

export const getProductsByType = (type) => {
  if (type === 'all') return products;
  return products.filter(p => p.type === type);
};

export const productCategories = [
  { id: 'all', label: 'Tous les produits', icon: '🔌' },
  { id: 'panneaux', label: 'Panneaux solaires', icon: '☀️' },
  { id: 'batterie', label: 'Batteries', icon: '🔋' },
  { id: 'pompe', label: 'Pompes à chaleur', icon: '🌡️' },
];
