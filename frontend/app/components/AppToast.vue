<script setup lang="ts">
const { toasts } = useToast();
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <Transition
        v-for="toast in toasts"
        :key="toast.id"
        name="toast"
        appear
      >
        <div
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-xl max-w-sm"
          :style="toast.type === 'success'
            ? 'background: rgba(34,197,94,0.15); border: 1px solid rgba(34,197,94,0.3); color: #4ade80;'
            : toast.type === 'error'
              ? 'background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); color: #f87171;'
              : 'background: rgba(124,92,255,0.15); border: 1px solid rgba(124,92,255,0.3); color: #a78bfa;'"
        >
          <span>{{ toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ' }}</span>
          <span>{{ toast.message }}</span>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active { transition: all 0.25s ease; }
.toast-leave-active { transition: all 0.2s ease; }
.toast-enter-from { opacity: 0; transform: translateX(1rem); }
.toast-leave-to { opacity: 0; transform: translateX(1rem); }
</style>
