<script setup>
import { ref, onMounted } from 'vue';

import { useStatistic } from '@/stores/api/statistics';

const Statistic = useStatistic();

const stats = ref({});

onMounted(async () => {
  stats.value = await Statistic.inspector();
});
</script>

<template>
  <div className="col-12">
    <div class="flex align-content-center mb-4">
      <div class="flex align-items-center justify-content-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h5 class="text-sm text-color-secondary m-0">
          {{ $t($route?.meta?.title) }}
        </h5>
        <h3 class="m-0">{{ $t($route?.meta?.description) }}</h3>
      </div>
    </div>

    <div class="grid"></div>
  </div>
</template>
