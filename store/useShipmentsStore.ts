// Zustand store for shipments filter state

import { create } from 'zustand';

interface ShipmentsStore {
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;
}

export const useShipmentsStore = create<ShipmentsStore>((set) => ({
  selectedCompanyId: null,
  setSelectedCompanyId: (id: string | null) =>
    set({ selectedCompanyId: id }),
}));
