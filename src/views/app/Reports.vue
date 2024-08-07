<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ProgressBar from 'primevue/progressbar';

// import ModalRecord from '@/components/modals/Report.vue';

const ModalRecord = defineAsyncComponent(() => import('@/components/modals/Report.vue'));

import { dateToStr } from '@/service/DataFilters';
import { useReport } from '@/stores/api/reports';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findAll, removeOne, generateReport } = useReport();

const report = ref(null);
const reports = ref([]);
const loading = ref(false);
const refModal = ref(null);

const refMenu = ref();
const options = ref([
  {
    label: t('Create report'),
    icon: 'pi pi-plus-circle',
    command: async () => refModal.value.toggle({})
  },
  {
    label: t('Export report'),
    icon: 'pi pi-file-export',
    command: async () => await reportToCSV(report.value)
  },
  {
    label: t('Update report'),
    icon: 'pi pi-file-edit',
    command: async () => refModal.value.toggle(report.value)
  },
  {
    label: t('Delete report'),
    icon: 'pi pi-trash',
    command: async () => confirmDelete(report.value)
  }
]);

const onMenuClick = (event, value) => {
  report.value = value;
  refMenu.value.toggle(event);
};

const onCloseModal = async () => {
  report.value = null;
  reports.value = await findAll({});
};

const confirmDelete = ({ id }) => {
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('Confirm delete record'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne({ id });
        toast.add({
          severity: 'success',
          summary: t('Information'),
          detail: t('Record is removed'),
          life: 3000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: t('Warning'),
          detail: t('Record not removed'),
          life: 3000
        });
      } finally {
        reports.value = await findAll();
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('Information'),
        detail: t('Record deletion not confirmed'),
        life: 3000
      });
    }
  });
};

const convertToCSV = data => {
  const [first] = data;
  const headerI18n = Object.keys(first).map(item => t(item));
  const header = headerI18n.join(';');
  const rows = data.map(obj => Object.values(obj).join(';'));
  return `${header}\n${rows.join('\n')}`;
};

const reportToCSV = async ({ id }) => {
  try {
    loading.value = true;

    const data = await generateReport({ id });
    const filename = `report-at-${dateToStr(new Date())}`;
    const csvData = convertToCSV(data);
    const blobDate = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = window.URL.createObjectURL(blobDate);
    a.download = filename + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t(err.message),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    reports.value = await findAll({});
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t(err.message),
      life: 3000
    });
  }
});
</script>

<template>
  <Menu ref="refMenu" popup :model="options">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <div class="h-full w-full">
    <div class="flex content-center mb-6">
      <div class="flex items-center justify-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="text-2xl">
          {{ $t($route?.meta?.title) }}
        </h3>
        <p class="text-base text-surface-500">
          {{ $t($route?.meta?.description) }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-6 justify-start p-8">
      <Card
        class="flex w-full lg:w-2/4 xl:w-1/4 items-center justify-center cursor-pointer hover:shadow-xl"
        @click="refModal.toggle({})"
      >
        <template #content>
          <div class="flex flex-col gap-4 items-center justify-center">
            <i class="pi pi-plus-circle text-5xl" />
            <p class="font-medium text-xl">
              {{ $t('Create a report template') }}
            </p>
          </div>
        </template>
      </Card>

      <Card
        class="w-full lg:w-2/4 xl:w-1/4 hover:shadow-xl"
        v-for="item in reports"
        :key="`report-${item.id}`"
      >
        <template #title>
          <div class="flex justify-between w-full">
            <div class="flex items-center justify-center">
              <i class="pi pi-file-excel text-6xl mr-4" />
              <div>
                <p class="text-lg font-bold line-height-2">
                  {{ item?.name || '-' }}
                </p>
                <p class="text-sm font-normal line-height-2 text-surface-500">
                  {{ $t('Report created by') }} {{ item?.creator }}
                </p>
                <p class="text-sm font-normal line-height-2 text-surface-500">
                  {{ $t('Created at') }} {{ dateToStr(item?.updatedAt) || '-' }}
                </p>
              </div>
            </div>

            <div class="flex items-center">
              <Button
                text
                plain
                rounded
                class="h-12 w-12"
                icon="pi pi-cog"
                v-tooltip.bottom="$t('Options menu')"
                @click="event => onMenuClick(event, item)"
              />
            </div>
          </div>
        </template>

        <template #content>
          <ProgressBar
            mode="indeterminate"
            style="height: 6px; margin-bottom: 12px"
            v-if="loading && report.id === item.id"
          />

          <div class="pl-[5rem]">
            <p class="text-base">
              {{ item?.description || '-' }}
            </p>

            <!-- <p class="text-sm font-normal line-height-2 text-surface-500 pt-4">
              {{ $t('Updated at') }} {{ dateToStr(item?.updatedAt) || '-' }}
            </p> -->
          </div>
        </template>
      </Card>
    </div>

    <ModalRecord ref="refModal" @close="onCloseModal" />
  </div>
</template>
