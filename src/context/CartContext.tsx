'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, CartContextType } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed: unknown[] = JSON.parse(savedCart);
        // normalize legacy fields and ensure `image` is a string URL
        const normalized: CartItem[] = parsed.map((it: unknown) => {
          const item = it as Record<string, unknown>;
          // prefer explicit image, then thumbnail, then first image.url if present
          let imageVal = (item.image as string | undefined) ?? (item.thumbnail as string | undefined) ?? '';
          if ((!imageVal || imageVal === '') && item.images && Array.isArray(item.images) && item.images.length > 0) {
            const first = item.images[0] as unknown;
            if (typeof first === 'string') {
              imageVal = first;
            } else if (first && typeof first === 'object' && 'url' in first) {
              imageVal = (first as Record<string, unknown>).url as string ?? '';
            }
          }
          return {
            id: item.id as string,
            name: item.name as string,
            price: item.price as number,
            image: imageVal,
            quantity: item.quantity as number,
            size: item.size as string,
          };
        });
        setCart(normalized);
      } catch (e) {
        console.error('Failed to parse saved cart', e);
        setCart([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      // Check if item already exists with same size
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === item.id && cartItem.size === item.size
      );

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += item.quantity;
        return newCart;
      } else {
        // Add new item if it doesn't exist
        return [...prevCart, item];
      }
    });
  };

  const removeFromCart = (id: string, size: string) => {
    setCart(prevCart => 
      prevCart.filter(item => !(item.id === id && item.size === size))
    );
  };

  const updateQuantity = (id: string, size: string, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};