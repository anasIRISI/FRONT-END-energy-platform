export const regions = [
  {
    id: 'wallonie',
    name: 'Wallonie',
    color: '#ea4335',
    primes: {
      panneaux: {
        base: 2500,
        description: 'Prime Qualiwatt pour installation photovoltaïque',
      },
      batterie: {
        base: 1500,
        description: 'Prime pour système de stockage',
      },
      pompe: {
        base: 3500,
        description: 'Prime Habitation pour pompe à chaleur',
      },
    },
    tvaReduite: '6%',
    conditions: [
      'Installateur agréé obligatoire',
      'Audit énergétique recommandé',
      'Certificats verts disponibles',
    ],
  },
  {
    id: 'bruxelles',
    name: 'Bruxelles',
    color: '#fbbc04',
    primes: {
      panneaux: {
        base: 3000,
        description: 'Prime Energie (Bruxelles Environnement)',
      },
      batterie: {
        base: 2000,
        description: 'Bonus pour autonomie énergétique',
      },
      pompe: {
        base: 4000,
        description: 'Prime Energie pour chauffage durable',
      },
    },
    tvaReduite: '6%',
    conditions: [
      'Installateur RGE obligatoire',
      'PEB du bâtiment requis',
      'Prime majorée pour revenus modestes',
    ],
  },
  {
    id: 'flandre',
    name: 'Flandre',
    color: '#34a853',
    primes: {
      panneaux: {
        base: 2000,
        description: 'Subsidie voor zonnepanelen',
      },
      batterie: {
        base: 1200,
        description: 'Subsidie voor batterijopslag',
      },
      pompe: {
        base: 3000,
        description: 'Premie voor warmtepomp',
      },
    },
    tvaReduite: '6%',
    conditions: [
      'Erkende installateur verplicht',
      'EPC-attest vereist',
      'Extra premie voor renovatie',
    ],
  },
];

export const getRegionByName = (name) => {
  return regions.find(r => r.name.toLowerCase() === name.toLowerCase());
};

export const calculatePrimes = (region, productType, price) => {
  const regionData = getRegionByName(region);
  if (!regionData) return { total: 0, details: [] };

  const primeBase = regionData.primes[productType]?.base || 0;
  const primeFederal = 500; // Prime fédérale fixe

  return {
    total: primeBase + primeFederal,
    details: [
      {
        label: `Prime ${regionData.name}`,
        amount: primeBase,
        description: regionData.primes[productType]?.description,
      },
      {
        label: 'Prime fédérale',
        amount: primeFederal,
        description: 'Aide fédérale pour transition énergétique',
      },
    ],
    finalPrice: price - (primeBase + primeFederal),
    tva: regionData.tvaReduite,
  };
};
