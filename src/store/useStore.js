import { useSyncExternalStore } from 'react'

const initialForm = {
  businessName: '',
  ein: '',
  businessAddress: '',
  incDate: '',
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
  articleDocs: [],
  einLetter: [],
  bankStatements: [],
  ownerAddressProof: [],
}

const initialState = {
  form: initialForm,
  formSubmitted: false,
  formLoading: false,
  openFaqIndex: null,
  mobileMenuOpen: false,
}

let state = initialState
const listeners = new Set()

function setState(updater) {
  const nextState = typeof updater === 'function' ? updater(state) : updater
  state = { ...state, ...nextState }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

export default function useStore() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    ...snapshot,
    setFormField: (field, value) =>
      setState((current) => ({ form: { ...current.form, [field]: value } })),
    setFormLoading: (value) => setState({ formLoading: value }),
    setFormSubmitted: (value) => setState({ formSubmitted: value }),
    resetForm: () =>
      setState({
        formSubmitted: false,
        formLoading: false,
        form: { ...initialForm },
      }),
    setOpenFaqIndex: (index) =>
      setState((current) => ({
        openFaqIndex: current.openFaqIndex === index ? null : index,
      })),
    toggleMobileMenu: () =>
      setState((current) => ({ mobileMenuOpen: !current.mobileMenuOpen })),
    closeMobileMenu: () => setState({ mobileMenuOpen: false }),
  }
}
