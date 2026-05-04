export function useApi() {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  async function apiFetch<T>(path: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    const token = authStore.token;
    return $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...(options.headers as Record<string, string> || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  }

  return { apiFetch };
}
