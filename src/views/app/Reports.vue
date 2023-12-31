<script setup>
import { useI18n } from 'vue-i18n';

import { dateToStr } from '@/service/DataFilters';
import { useReport } from '@/stores/api/reports';

const { t } = useI18n();

const { getReport } = useReport();

const convertToCSV = data => {
  const [first] = data;
  const headerI18n = Object.keys(first).map(item => t(item));
  const header = headerI18n.join(';');
  const rows = data.map(obj => Object.values(obj).join(';'));
  return `${header}\n${rows.join('\n')}`;
};

const generateReportToCSV = async (path, filename = `report-at-${dateToStr(new Date())}`) => {
  const data = await getReport(path);
  const csvData = convertToCSV(data);
  const blobDate = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = window.URL.createObjectURL(blobDate);
  a.download = filename + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>

<template>
  <div className="col-12">
    <div class="flex align-content-center mb-4">
      <div class="flex align-items-center justify-content-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="my-auto">
          {{ $t($route?.meta?.title) }}
        </h3>
        <h5 class="text-sm text-color-secondary my-auto">
          {{ $t($route?.meta?.description) }}
        </h5>
      </div>
    </div>

    <div class="grid align-content-start">
      <div class="col-12 lg:col-6 xl:col-3">
        <div
          class="card surface-card cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="() => $helpdesk.notImplemented()"
        >
          <div class="flex flex-column align-items-center justify-content-center">
            <div class="border-round p-2">
              <i class="pi pi-plus-circle text-6xl" />
            </div>
            <p>{{ $t('Create report template') }}</p>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div
          class="card surface-50 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('internet-access', 'helpdesk-report-internet-access')"
        >
          <div class="flex">
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-excel text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of users with internet access') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('Network IP Address of the technical support') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div
          class="card surface-50 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('users-email', 'helpdesk-report-users-email')"
        >
          <div class="flex">
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-excel text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of users with email') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('Mailbox of the technical support') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div
          class="card surface-50 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('unwanted-software', 'helpdesk-report-unwanted-software')"
        >
          <div class="flex">
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-excel text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of unwanted software') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('PC SysInspector service of the technical support') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
div[disabled] {
  opacity: 0.1;
  pointer-events: none;
}
</style>
