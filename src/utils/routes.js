const toSlug = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

export const productSlug = (product) => toSlug(product?.nom || product?.name || product);

export const productPath = (product) => `/produit/${productSlug(product)}`;

export const formPath = (product) => `/formulaire/${productSlug(product)}`;

export const simulationPath = (simulation) => simulation?.referencePublique
  ? `/simulation/${encodeURIComponent(simulation.referencePublique)}`
  : '/formulaire';
