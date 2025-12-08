import { create } from 'zustand'
import { type IPAsset, type LicenseType } from '@/types'

interface UIStore {
  // Modal states
  isIPDetailModalOpen: boolean
  selectedIP: IPAsset | null

  isLicenseModalOpen: boolean
  licensingIP: IPAsset | null
  selectedLicenseType: LicenseType | null

  isRemixModalOpen: boolean
  remixingIP: IPAsset | null

  isFilterModalOpen: boolean

  // Actions
  openIPDetailModal: (ip: IPAsset) => void
  closeIPDetailModal: () => void

  openLicenseModal: (ip: IPAsset, licenseType?: LicenseType) => void
  closeLicenseModal: () => void
  setSelectedLicenseType: (type: LicenseType) => void

  openRemixModal: (ip: IPAsset) => void
  closeRemixModal: () => void

  toggleFilterModal: () => void
  closeFilterModal: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isIPDetailModalOpen: false,
  selectedIP: null,

  isLicenseModalOpen: false,
  licensingIP: null,
  selectedLicenseType: null,

  isRemixModalOpen: false,
  remixingIP: null,

  isFilterModalOpen: false,

  openIPDetailModal: (ip) => set({
    isIPDetailModalOpen: true,
    selectedIP: ip
  }),

  closeIPDetailModal: () => set({
    isIPDetailModalOpen: false,
    selectedIP: null
  }),

  openLicenseModal: (ip, licenseType) => set({
    isLicenseModalOpen: true,
    licensingIP: ip,
    selectedLicenseType: licenseType || null
  }),

  closeLicenseModal: () => set({
    isLicenseModalOpen: false,
    licensingIP: null,
    selectedLicenseType: null
  }),

  setSelectedLicenseType: (type) => set({
    selectedLicenseType: type
  }),

  openRemixModal: (ip) => set({
    isRemixModalOpen: true,
    remixingIP: ip
  }),

  closeRemixModal: () => set({
    isRemixModalOpen: false,
    remixingIP: null
  }),

  toggleFilterModal: () => set((state) => ({
    isFilterModalOpen: !state.isFilterModalOpen
  })),

  closeFilterModal: () => set({
    isFilterModalOpen: false
  })
}))
