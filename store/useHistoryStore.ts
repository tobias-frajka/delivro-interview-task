// Zustand store for price history modal state

import { create } from 'zustand';

interface HistoryStore {
  isHistoryModalOpen: boolean;
  selectedShipmentId: string | null;
  openHistoryModal: (shipmentId: string) => void;
  closeHistoryModal: () => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  isHistoryModalOpen: false,
  selectedShipmentId: null,
  openHistoryModal: (shipmentId: string) =>
    set({ isHistoryModalOpen: true, selectedShipmentId: shipmentId }),
  closeHistoryModal: () =>
    set({ isHistoryModalOpen: false, selectedShipmentId: null }),
}));
