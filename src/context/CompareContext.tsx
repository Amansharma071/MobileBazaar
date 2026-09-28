import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types/index.js';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
  compareToast: string | null;
  clearToast: () => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('mobilebazaar_compare') || localStorage.getItem('amazon_mobile_compare');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [compareToast, setCompareToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('mobilebazaar_compare', JSON.stringify(compareList));
  }, [compareList]);

  const clearToast = () => setCompareToast(null);

  const isInCompare = (productId: string) => {
    return compareList.some(p => p.id === productId);
  };

  const addToCompare = (product: Product): boolean => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      setCompareToast(`Removed ${product.model} from comparison.`);
      setTimeout(() => setCompareToast(null), 3500);
      return false;
    }
    if (compareList.length >= 4) {
      setCompareToast('Maximum 4 phones can be compared at once. Remove one to add another.');
      setTimeout(() => setCompareToast(null), 4000);
      return false;
    }
    setCompareList(prev => [...prev, product]);
    setCompareToast(`Added ${product.model} to comparison! (${compareList.length + 1}/4)`);
    setTimeout(() => setCompareToast(null), 3500);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setCompareToast('Cleared comparison list.');
    setTimeout(() => setCompareToast(null), 3000);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare, compareToast, clearToast }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare must be used within a CompareProvider');
  return context;
};
