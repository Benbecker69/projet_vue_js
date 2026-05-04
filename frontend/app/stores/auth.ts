export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();

  const token = useCookie<string | null>('si_token', { maxAge: 60 * 60 * 24 * 7, default: () => null });
  const user = ref<Record<string, any> | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function fetchMe() {
    if (!token.value) return;
    try {
      const data = await $fetch<{ user: any }>(`${config.public.apiBase}/auth/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      user.value = data.user;
    } catch {
      token.value = null;
      user.value = null;
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: { email, password },
      });
      token.value = data.token;
      user.value = data.user;
    } catch (e: any) {
      error.value = e?.data?.error?.message || 'Erreur de connexion';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function register(name: string, email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch<{ user: any; token: string }>(`${config.public.apiBase}/auth/register`, {
        method: 'POST',
        body: { name, email, password },
      });
      token.value = data.token;
      user.value = data.user;
    } catch (e: any) {
      error.value = e?.data?.error?.message || 'Erreur d\'inscription';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    navigateTo('/');
  }

  return { token, user, loading, error, isAuthenticated, login, register, logout, fetchMe };
});
