<script setup>
import { useConfig } from '@/stores/config';
import { useSidebar } from '@/stores/sidebar';

const $sidebar = useSidebar();
const $config = useConfig();
</script>

<template>
  <ul>
    <li v-for="item in $sidebar.miniNavLinks">
      <Button
        text
        plain
        :class="[
          'w-full text-xl rounded-none',
          'text-primary-300',
          {
            '!text-primary-500': item.name === $router.currentRoute.value.name
          }
        ]"
        v-tooltip.rigth="item.label"
        @click="$router.push({ name: item.name })"
      >
        <AppIcons :name="item.icon" :size="28" />
      </Button>
    </li>

    <li class="flex justify-center flex-none">
      <Button
        text
        plain
        rounded
        class="w-12 h-12 text-xl my-2"
        icon="pi pi-arrow-right-arrow-left"
        v-tooltip.rigth="$t('Toggle sidebar')"
        @click="$config.appSideBarMini = !$config.appSideBarMini"
      />
    </li>
  </ul>
</template>
