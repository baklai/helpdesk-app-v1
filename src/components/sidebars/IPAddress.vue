<script setup>
import { ref } from 'vue';

import IPAddressPartial from '@/components/partials/IPAddressPartial.vue';
import SysInspectorPartial from '@/components/partials/SysInspectorPartial.vue';

import { useIPAddress } from '@/stores/api/ipaddresses';
import { dateToStr } from '@/service/DataFilters';

const IPAddress = useIPAddress();

const emits = defineEmits(['toggleMenu', 'close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      record.value = await IPAddress.findOne({ id, populate: true, aggregate: true });
      visible.value = true;
    } catch (err) {
      onCloseSidebar();
    }
  }
});

const visible = ref(false);
const record = ref(null);

const toggleMenu = (event, data) => {
  emits('toggleMenu', event, data);
};

const onCloseSidebar = () => {
  visible.value = false;
  record.value = null;
  emits('close', {});
};
</script>

<template>
  <Card
    v-if="visible"
    class="h-full px-2 w-1/3 sticky shadow-none overflow-y-auto border-l rounded-none border-surface-200 dark:border-surface-600 dark:!bg-surface-800"
  >
    <template #title>
      <div class="flex justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="network-ipaddress" :size="40" class="mr-4" />
          <div>
            <p class="text-lg mb-0">IP {{ record?.ipaddress?.ipaddress }}</p>
            <p class="text-base font-normal">
              {{ $t('Date open') }} : {{ dateToStr(record?.ipaddress?.date) || '-' }}
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
            @click="toggleMenu($event, record.ipaddress)"
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
      <div class="overflow-y-auto py-6" style="height: calc(100vh - 20rem)">
        <div class="w-full py-4">
          <IPAddressPartial :record="record.ipaddress" v-if="record?.ipaddress" />
        </div>

        <div class="w-full py-4">
          <SysInspectorPartial :record="record.inspector" v-if="record?.inspector" />
        </div>
      </div>
    </template>
  </Card>
</template>
