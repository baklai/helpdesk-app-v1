<script setup>
import { ref } from 'vue';

import IPAddressPartial from '@/components/partials/IPAddressPartial.vue';
import SysInspectorPartial from '@/components/partials/SysInspectorPartial.vue';

import { dateTimeToStr } from '@/service/DataFilters';
import { useInspector } from '@/stores/api/inspectors';

const Inspector = useInspector();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      const { inspector, ipaddress } = await Inspector.findOne({
        id,
        populate: true,
        aggregate: true
      });

      record.value = inspector;
      recordip.value = ipaddress;

      visible.value = true;
    } catch (err) {
      onCloseSidebar();
    }
  }
});

const visible = ref(false);

const record = ref(null);
const recordip = ref(null);

const toggleMenu = (event, data) => {
  emits('toggleMenu', event, data);
};

const onCloseSidebar = () => {
  visible.value = false;
  record.value = null;
  recordip.value = null;
  emits('close', {});
};
</script>

<template>
  <Card
    v-if="visible"
    class="h-full px-2 w-1/3 sticky shadow-none overflow-y-auto border-l rounded-none border-surface-200 dark:border-surface-600 dark:!bg-surface-800 transition-all duration-300"
  >
    <template #title>
      <div class="flex justify-between mb-6">
        <div class="flex items-center justify-center">
          <AppIcons name="pc-sys-inspector" :size="40" class="my-auto mr-2" />
          <div>
            <p class="text-lg mb-0">
              {{ record?.os ? record?.os?.CSName : record?.host }}
            </p>
            <p class="text-base font-normal mb-0">
              {{ $t('Report host') }}: {{ record?.host || '-' }}
            </p>
            <p class="text-base font-normal">
              {{ $t('Report date') }}:
              {{ dateTimeToStr(record?.updatedAt) || '-' }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-center">
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="text-2xl w-12 h-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Menu')"
            @click="toggleMenu($event, record)"
          />
          <Button
            text
            plain
            rounded
            iconClass="text-xl"
            class="text-2xl w-12 h-12"
            icon="pi pi-times"
            v-tooltip.bottom="$t('Close')"
            @click="onCloseSidebar"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div class="overflow-y-auto" style="height: calc(100vh - 20rem)">
        <div class="w-full py-4">
          <IPAddressPartial :record="recordip" v-if="recordip" />
        </div>

        <div class="w-full py-4">
          <SysInspectorPartial :record="record" v-if="record" />
        </div>
      </div>
    </template>
  </Card>
</template>
