import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer le localStorage
 * @param {string} key - Clé de stockage
 * @param {*} initialValue - Valeur initiale
 * @returns {[*, Function]} - [valeur, fonction de mise à jour]
 */
export const useLocalStorage = (key, initialValue) => {
  // Récupérer la valeur initiale depuis localStorage
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = (value) => {
    try {
      // Permettre à value d'être une fonction (comme useState)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarder l'état
      setStoredValue(valueToStore);
      
      // Sauvegarder dans localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Supprimer la valeur du localStorage
  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
