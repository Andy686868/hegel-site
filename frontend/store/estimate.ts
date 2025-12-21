import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EstimateItem {
  id: string | number;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  image: string | null;
}

// 1. Интерфейс для данных клиента
export interface UserInfo {
  organization: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
}

interface EstimateState {
  items: EstimateItem[];
  userInfo: UserInfo; // <-- Добавили поле
  
  addItem: (item: EstimateItem) => void;
  decreaseItem: (id: string | number) => void;
  setItemQuantity: (id: string | number, quantity: number) => void;
  removeItem: (id: string | number) => void;
  clearEstimate: () => void;
  setUserInfo: (info: Partial<UserInfo>) => void; // <-- Функция обновления
}

export const useEstimateStore = create<EstimateState>()(
  persist(
    (set) => ({
      items: [],
      // Начальные данные (пустые)
      userInfo: {
        organization: '',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        city: '',
      },

      addItem: (newItem) => set((state) => {
        const existingItem = state.items.find((i) => i.id === newItem.id);
        if (existingItem) {
          return { items: state.items.map((i) => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i) };
        }
        return { items: [...state.items, { ...newItem, quantity: 1 }] };
      }),

      decreaseItem: (id) => set((state) => {
        const existingItem = state.items.find((i) => i.id === id);
        if (!existingItem || existingItem.quantity <= 1) {
            return { items: state.items.filter((i) => i.id !== id) };
        }
        return { items: state.items.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i) };
      }),

      setItemQuantity: (id, quantity) => set((state) => {
        if (quantity <= 0) return { items: state.items.filter((i) => i.id !== id) };
        return { items: state.items.map((i) => i.id === id ? { ...i, quantity: quantity } : i) };
      }),

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearEstimate: () => set((state) => ({ 
        items: [],
        userInfo: { organization: '', firstName: '', lastName: '', phone: '', email: '', city: '' } // Очищаем и данные тоже
      })),

      // Обновляем данные клиента
      setUserInfo: (info) => set((state) => ({
        userInfo: { ...state.userInfo, ...info }
      })),
    }),
    {
      name: 'hegel-estimate-storage',
    }
  )
);