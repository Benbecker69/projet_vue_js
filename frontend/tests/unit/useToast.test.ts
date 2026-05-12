import { describe, it, expect, vi, beforeEach } from 'vitest'

// useToast uses useState (Nuxt composable) — available in nuxt environment

describe('useToast', () => {
  beforeEach(() => {
    // Reset the module state between tests by reassigning _nextId indirectly via fresh state
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('show() — ajoute un toast de type info par défaut', () => {
    const { toasts, show } = useToast()
    show('Message info')
    expect(toasts.value).toHaveLength(1)
    expect(toasts.value[0].message).toBe('Message info')
    expect(toasts.value[0].type).toBe('info')
  })

  it('success() — ajoute un toast de type success', () => {
    const { toasts, success } = useToast()
    success('Opération réussie')
    expect(toasts.value[toasts.value.length - 1].type).toBe('success')
    expect(toasts.value[toasts.value.length - 1].message).toBe('Opération réussie')
  })

  it('error() — ajoute un toast de type error', () => {
    const { toasts, error } = useToast()
    error('Une erreur est survenue')
    expect(toasts.value[toasts.value.length - 1].type).toBe('error')
    expect(toasts.value[toasts.value.length - 1].message).toBe('Une erreur est survenue')
  })

  it('info() — ajoute un toast de type info', () => {
    const { toasts, info } = useToast()
    info('Information')
    expect(toasts.value[toasts.value.length - 1].type).toBe('info')
  })

  it('show() — chaque toast a un id unique', () => {
    const { toasts, show } = useToast()
    show('Toast 1')
    show('Toast 2')
    const ids = toasts.value.map(t => t.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('show() — le toast est supprimé après la durée spécifiée', async () => {
    const { toasts, show } = useToast()
    const initialLength = toasts.value.length
    show('Toast temporaire', 'info', 1000)
    expect(toasts.value.length).toBe(initialLength + 1)
    vi.advanceTimersByTime(1001)
    expect(toasts.value.length).toBe(initialLength)
  })
})
