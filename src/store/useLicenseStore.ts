import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type License } from '@/types'

interface LicenseStore {
  licenses: License[]

  addLicense: (license: License) => void
  getLicensesByIPId: (ipAssetId: string) => License[]
  hasLicense: (ipAssetId: string) => boolean

  removeLicense: (licenseId: string) => void
}

export const useLicenseStore = create<LicenseStore>()(
  persist(
    (set, get) => ({
      licenses: [],

      addLicense: (license) => set((state) => ({
        licenses: [license, ...state.licenses]
      })),

      getLicensesByIPId: (ipAssetId) => {
        return get().licenses.filter((license) => license.ipAssetId === ipAssetId)
      },

      hasLicense: (ipAssetId) => {
        return get().licenses.some((license) => license.ipAssetId === ipAssetId)
      },

      removeLicense: (licenseId) => set((state) => ({
        licenses: state.licenses.filter((license) => license.id !== licenseId)
      }))
    }),
    {
      name: 'license-store'
    }
  )
)
