<script setup>
import { useConfig } from '@/stores/config';

const $config = useConfig();
</script>

<template>
  <div class="flex flex-col h-full w-full items-center place-content-center">
    <h1 class="text-6xl font-bold mb-2">
      {{ $t('Not Found') }}
    </h1>
    <span class="text-surface-500 mb-8">
      {{ $t('Requested resource is not available') }}
    </span>
    <img
      :src="$config?.appTheme === 'light' ? '/img/404-dark.webp' : '/img/404-light.webp'"
      alt="Not found"
      width="300"
      class="mb-6"
    />
    <div class="uppercase font-semibold text-primary-600 hover:text-primary-500">
      <i class="pi pi-home mr-2"></i>
      <RouterLink :to="{ name: 'home' }">
        {{ $t('Back to home page') }}
      </RouterLink>
    </div>
  </div>
</template>
