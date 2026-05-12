import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'

// $fetch is a Nuxt global — stub directly
const fetchMock = vi.fn()

// navigateTo is a Nuxt module import — must use vi.hoisted so the variable exists
// when mockNuxtImport hoists its factory to top of file
const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
mockNuxtImport('navigateTo', () => navigateToMock)

describe('useAuthStore — intégration avec API mockée', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    fetchMock.mockReset()
    navigateToMock.mockReset()
    vi.stubGlobal('$fetch', fetchMock)
    // Provide a fresh useCookie per test so token state doesn't leak between tests
    vi.stubGlobal('useCookie', (_key: string, opts?: any) => {
      const defaultVal = opts?.default ? opts.default() : null
      return ref(defaultVal)
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('état initial — non authentifié', () => {
    const auth = useAuthStore()
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(auth.loading).toBe(false)
    expect(auth.error).toBeNull()
  })

  it('login() — met à jour user et token en cas de succès', async () => {
    fetchMock.mockResolvedValueOnce({
      user: { _id: '123', name: 'Jean Dupont', email: 'jean@example.com', role: 'user' },
      token: 'jwt-token-test',
    })

    const auth = useAuthStore()
    await auth.login('jean@example.com', 'password123')

    expect(auth.user).not.toBeNull()
    expect(auth.user?.name).toBe('Jean Dupont')
    expect(auth.isAuthenticated).toBe(true)
    expect(auth.error).toBeNull()
  })

  it('login() — appelle le bon endpoint API avec les bonnes données', async () => {
    fetchMock.mockResolvedValueOnce({
      user: { _id: '123', name: 'Test', email: 'test@example.com', role: 'user' },
      token: 'token',
    })

    const auth = useAuthStore()
    await auth.login('test@example.com', 'password123')

    expect(fetchMock).toHaveBeenCalledOnce()
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('/auth/login')
    expect(options.method).toBe('POST')
    expect(options.body).toEqual({ email: 'test@example.com', password: 'password123' })
  })

  it('login() — stocke l\'erreur en cas d\'échec API', async () => {
    fetchMock.mockRejectedValueOnce({
      data: { error: { message: 'Email ou mot de passe incorrect' } },
    })

    const auth = useAuthStore()
    await expect(auth.login('bad@example.com', 'wrong')).rejects.toBeDefined()
    expect(auth.error).toBe('Email ou mot de passe incorrect')
    expect(auth.user).toBeNull()
  })

  it('login() — passe loading à true pendant la requête, false après', async () => {
    let resolveLogin!: (v: any) => void
    fetchMock.mockImplementationOnce(() => new Promise(r => { resolveLogin = r }))

    const auth = useAuthStore()
    const loginPromise = auth.login('test@example.com', 'password123')

    expect(auth.loading).toBe(true)
    resolveLogin({ user: { _id: '1', name: 'T', email: 'test@example.com', role: 'user' }, token: 'tok' })
    await loginPromise
    expect(auth.loading).toBe(false)
  })

  it('register() — crée le compte et connecte l\'utilisateur', async () => {
    fetchMock.mockResolvedValueOnce({
      user: { _id: '456', name: 'Nouveau', email: 'nouveau@example.com', role: 'user' },
      token: 'new-token',
    })

    const auth = useAuthStore()
    await auth.register('Nouveau', 'nouveau@example.com', 'password123')

    expect(auth.user?.name).toBe('Nouveau')
    expect(auth.isAuthenticated).toBe(true)
  })

  it('register() — appelle le bon endpoint avec name, email, password', async () => {
    fetchMock.mockResolvedValueOnce({
      user: { _id: '456', name: 'Test', email: 'test@example.com', role: 'user' },
      token: 'token',
    })

    const auth = useAuthStore()
    await auth.register('Test User', 'test@example.com', 'password123')

    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toContain('/auth/register')
    expect(options.body).toMatchObject({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('logout() — réinitialise user et token, redirige vers /', () => {
    const auth = useAuthStore()
    auth.logout()

    expect(auth.user).toBeNull()
    expect(navigateToMock).toHaveBeenCalledWith('/')
  })

  it('register() — stocke l\'erreur si email déjà pris', async () => {
    fetchMock.mockRejectedValueOnce({
      data: { error: { message: 'Email déjà utilisé', code: 'EMAIL_TAKEN' } },
    })

    const auth = useAuthStore()
    await expect(auth.register('Dup', 'dup@example.com', 'password123')).rejects.toBeDefined()
    expect(auth.error).toBe('Email déjà utilisé')
  })
})
