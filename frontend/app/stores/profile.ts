export const useProfileStore = defineStore('profile', () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const profile = ref<any>(null);
  const nfcObjects = ref<any[]>([]);
  const loading = ref(false);

  async function fetchProfile() {
    if (!authStore.token) return;
    loading.value = true;
    try {
      const data = await $fetch<{ user: any; nfcObjects: any[] }>(`${config.public.apiBase}/me/profile`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      profile.value = data.user;
      nfcObjects.value = data.nfcObjects;
    } finally {
      loading.value = false;
    }
  }

  async function updateProfile(updates: Record<string, any>) {
    const data = await $fetch<{ user: any }>(`${config.public.apiBase}/me/profile`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: updates,
    });
    profile.value = data.user;
    return data.user;
  }

  async function addLink(link: { label: string; url: string; icon?: string }) {
    const data = await $fetch<{ links: any[] }>(`${config.public.apiBase}/me/links`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: link,
    });
    if (profile.value) profile.value.profile.links = data.links;
    return data.links;
  }

  async function deleteLink(linkId: string) {
    const data = await $fetch<{ links: any[] }>(`${config.public.apiBase}/me/links/${linkId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    if (profile.value) profile.value.profile.links = data.links;
    return data.links;
  }

  async function createNfc(label: string) {
    const data = await $fetch<{ nfcObject: any }>(`${config.public.apiBase}/me/nfc`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { label },
    });
    nfcObjects.value.unshift(data.nfcObject);
    return data.nfcObject;
  }

  async function deleteNfc(id: string) {
    await $fetch(`${config.public.apiBase}/me/nfc/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    nfcObjects.value = nfcObjects.value.filter(n => n._id !== id);
  }

  return { profile, nfcObjects, loading, fetchProfile, updateProfile, addLink, deleteLink, createNfc, deleteNfc };
});
