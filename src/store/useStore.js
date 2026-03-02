import { create } from 'zustand'

const useStore = create((set) => ({
  // ── Form state ──────────────────────────────────────────────────────
  form: {
    businessName: '',
    ein: '',
    businessAddress: '',
    incDay: '',
    incMonth: '',
    incYear: '',
    businessCode: '',
    ownerName: '',
    ownerAddress: '',
    income: '',
    expenses: '',
    cogs: '',
    llcCost: '',
    fyMonth: '',
    fyDay: '',
    notes: '',
    email: '',
    phone: '',
    agreed: false,
    files: [],
  },
  formSubmitted: false,
  formLoading: false,

  setFormField: (field, value) =>
    set((state) => ({ form: { ...state.form, [field]: value } })),

  setFormLoading: (v) => set({ formLoading: v }),
  setFormSubmitted: (v) => set({ formSubmitted: v }),

  resetForm: () =>
    set({
      formSubmitted: false,
      formLoading: false,
      form: {
        businessName: '', ein: '', businessAddress: '',
        incDay: '', incMonth: '', incYear: '', businessCode: '',
        ownerName: '', ownerAddress: '',
        income: '', expenses: '', cogs: '', llcCost: '',
        fyMonth: '', fyDay: '', notes: '',
        email: '', phone: '', agreed: false, files: [],
      },
    }),

  // ── FAQ state ────────────────────────────────────────────────────────
  openFaqIndex: null,
  setOpenFaqIndex: (i) =>
    set((state) => ({ openFaqIndex: state.openFaqIndex === i ? null : i })),

  // ── Nav / mobile menu ────────────────────────────────────────────────
  mobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
  closeMobileMenu: () => set({ mobileMenuOpen: false }),
}))

export default useStore
