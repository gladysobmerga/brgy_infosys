import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  medicineId: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  notes: string;
  addItem: (medicineId: string) => void;
  removeItem: (medicineId: string) => void;
  updateQuantity: (medicineId: string, quantity: number) => void;
  setNotes: (notes: string) => void;
  clearCart: () => void;
  getQuantity: (medicineId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      notes: '',

      addItem: (medicineId) => {
        const items = get().items;
        const existing = items.find((item) => item.medicineId === medicineId);
        
        if (existing) {
          set({
            items: items.map((item) =>
              item.medicineId === medicineId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { medicineId, quantity: 1 }] });
        }
      },

      removeItem: (medicineId) => {
        const items = get().items;
        const existing = items.find((item) => item.medicineId === medicineId);
        
        if (existing && existing.quantity > 1) {
          set({
            items: items.map((item) =>
              item.medicineId === medicineId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          });
        } else {
          set({ items: items.filter((item) => item.medicineId !== medicineId) });
        }
      },

      updateQuantity: (medicineId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.medicineId !== medicineId) });
        } else {
          const items = get().items;
          const existing = items.find((item) => item.medicineId === medicineId);
          
          if (existing) {
            set({
              items: items.map((item) =>
                item.medicineId === medicineId ? { ...item, quantity } : item
              ),
            });
          } else {
            set({ items: [...items, { medicineId, quantity }] });
          }
        }
      },

      setNotes: (notes) => set({ notes }),

      clearCart: () => set({ items: [], notes: '' }),

      getQuantity: (medicineId) => {
        const item = get().items.find((item) => item.medicineId === medicineId);
        return item?.quantity || 0;
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
