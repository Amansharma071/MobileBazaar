import React, { createContext, useContext, useState, useEffect } from 'react';
import { WishlistItem, Product } from '../types/index.js';
import { api } from '../lib/api.js';

interface WishlistContextType {
  items: (WishlistItem & { product: Product })[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product, targetPrice?: number) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  setTargetPrice: (productId: string, price: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<(WishlistItem & { product: Product })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWishlist = async () => {
    try {
      const data = await api.getWishlist();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const toggleWishlist = async (product: Product, targetPrice?: number) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      try {
        const added = await api.addToWishlist(product.id, targetPrice);
        setItems(prev => [...prev, { ...added, product }]);
      } catch (err) {
        console.error('Failed to add to wishlist', err);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.productId !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
    }
  };

  const setTargetPrice = async (productId: string, price: number) => {
    try {
      await api.createPriceAlert(productId, price);
      setItems(prev =>
        prev.map(item =>
          item.productId === productId ? { ...item, targetPrice: price } : item
        )
      );
    } catch (err) {
      console.error('Failed to set target price', err);
    }
  };

  return (
    <WishlistContext.Provider value={{ items, loading, isInWishlist, toggleWishlist, removeFromWishlist, setTargetPrice }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
