export const regions = [
  {
    id: 'wallonie',
    name: 'Wallonie',
    color: '#ea4335',
    primes: {},
    conditions: [],
  },
  {
    id: 'bruxelles',
    name: 'Bruxelles',
    color: '#fbbc04',
    primes: {},
    conditions: [],
  },
  {
    id: 'flandre',
    name: 'Flandre',
    color: '#34a853',
    primes: {},
    conditions: [],
  },
];

export const getRegionByName = (name) => {
  return regions.find(r => r.name.toLowerCase() === name.toLowerCase());
};

export const calculatePrimes = (region, productType, price) => {
  // Les montants fixes historiques de cette maquette ne sont pas des barèmes
  // vérifiés. Le calcul officiel vit désormais dans le parcours backend/IA.
  // Cette compatibilité évite qu'un ancien écran invente une aide financière.
  return {
    total: 0,
    details: [],
    finalPrice: price,
    tva: null,
  };
};
