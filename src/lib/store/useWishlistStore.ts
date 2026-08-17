import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  sku: string;
  name: {
    en: string;
    ar: string;
  };
  price: number;
  image: string;
  categorySlug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  removeItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleWishlist: (item) => {
        const exists = get().isInWishlist(item.id);
        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.id !== item.id),
          }));
        } else {
          set((state) => ({
            items: [...state.items, item],
          }));
        }
      },
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
    }),
    {
      name: 'alfayasel-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
