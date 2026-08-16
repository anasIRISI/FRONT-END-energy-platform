/**
 * Tests pour les fonctions utilitaires
 * Pour exécuter les tests : npm test
 */

import { describe, it, expect } from 'vitest';
import {
  formatPrice,
  isValidEmail,
  isValidPhone,
  isValidTVA,
  truncateText,
  slugify,
} from './helpers';

describe('Helpers - Formatage', () => {
  it('devrait formater un prix correctement', () => {
    expect(formatPrice(1000)).toBe('1 000 €');
    expect(formatPrice(1234.56)).toBe('1 235 €');
  });

  it('devrait tronquer un texte', () => {
    const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.';
    expect(truncateText(longText, 20)).toBe('Lorem ipsum dolor si...');
    expect(truncateText('Court', 20)).toBe('Court');
  });

  it('devrait slugifier un texte', () => {
    expect(slugify('Bonjour le Monde!')).toBe('bonjour-le-monde');
    expect(slugify('Énergie Renouvelable')).toBe('energie-renouvelable');
  });
});

describe('Helpers - Validation', () => {
  it('devrait valider un email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalide')).toBe(false);
    expect(isValidEmail('test@')).toBe(false);
  });

  it('devrait valider un téléphone belge', () => {
    expect(isValidPhone('+32 2 123 45 67')).toBe(true);
    expect(isValidPhone('0471234567')).toBe(true);
    expect(isValidPhone('invalide')).toBe(false);
  });

  it('devrait valider un numéro TVA belge', () => {
    expect(isValidTVA('BE0123456789')).toBe(true);
    expect(isValidTVA('BE 0123 456 789')).toBe(true);
    expect(isValidTVA('BE0123.456.789')).toBe(true);
    expect(isValidTVA('invalide')).toBe(false);
  });
});

// Pour exécuter ces tests, il faut d'abord installer vitest :
// npm install -D vitest
// Et ajouter dans package.json :
// "test": "vitest"
