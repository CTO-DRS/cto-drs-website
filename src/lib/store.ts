"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, CartLine, Product } from "@/lib/types";

export interface WishLine {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface AppState {
  /** authenticated user (client session) */
  user: AuthUser | null;
  setUser: (u: AuthUser | null) => void;

  /** shopping cart */
  cart: CartLine[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;

  /** wishlist (favorites) */
  wishlist: WishLine[];
  toggleWishlist: (p: { id: string; name: string; price: number; image: string }) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      cart: [],
      addToCart: (p) =>
        set((s) => {
          const found = s.cart.find((c) => c.id === p.id);
          if (found) {
            return {
              cart: s.cart.map((c) =>
                c.id === p.id ? { ...c, qty: Math.min(c.qty + 1, 99) } : c
              ),
            };
          }
          return {
            cart: [
              ...s.cart,
              { id: p.id, name: p.name, price: p.price, image: p.image, qty: 1 },
            ],
          };
        }),
      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((c) => c.id !== id) })),
      setQty: (id, qty) =>
        set((s) => ({
          cart:
            qty <= 0
              ? s.cart.filter((c) => c.id !== id)
              : s.cart.map((c) => (c.id === id ? { ...c, qty: Math.min(qty, 99) } : c)),
        })),
      clearCart: () => set({ cart: [] }),

      wishlist: [],
      toggleWishlist: (p) =>
        set((s) => {
          const found = s.wishlist.some((w) => w.id === p.id);
          return {
            wishlist: found
              ? s.wishlist.filter((w) => w.id !== p.id)
              : [...s.wishlist, { id: p.id, name: p.name, price: p.price, image: p.image }],
          };
        }),
      removeFromWishlist: (id) =>
        set((s) => ({ wishlist: s.wishlist.filter((w) => w.id !== id) })),
      clearWishlist: () => set({ wishlist: [] }),
    }),
    { name: "cto-drs-store" }
  )
);

export function cartCount(cart: CartLine[]) {
  return cart.reduce((n, c) => n + c.qty, 0);
}

export function cartTotal(cart: CartLine[]) {
  return cart.reduce((n, c) => n + c.qty * c.price, 0);
}

export function inWishlist(wishlist: WishLine[], id: string) {
  return wishlist.some((w) => w.id === id);
}
