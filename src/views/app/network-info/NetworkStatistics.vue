<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { FilterMatchMode } from 'primevue/api';

import { useStatistic } from '@/stores/api/statistics';
import { dateToStr } from '@/service/DataFilters';

const Statistic = useStatistic();

const stats = ref({});
const currentDate = ref();

const onCountPercent = (count, allCount) => {
  return ((count * 100) / allCount).toFixed(2);
};

const onCountPercentWidth = (count, allCount) => {
  return Math.round((count * 100) / allCount);
};

onMounted(async () => {
  currentDate.value = dateToStr(Date.now());

  stats.value = await Statistic.network();
});
</script>

<template>
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

    <div class="flex flex-col md:flex-row md:flex-wrap">
      <div class="flex flex-wrap content-start md:w-1/2 md:pr-2">
        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">
                  {{ $t('Total number of ipaddresses') }}
                </span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.ipaddresses || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-green-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>monitor-cellphone</title>
                  <path
                    d="M23,11H18A1,1 0 0,0 17,12V21A1,1 0 0,0 18,22H23A1,1 0 0,0 24,21V12A1,1 0 0,0 23,11M23,20H18V13H23V20M20,2H2C0.89,2 0,2.89 0,4V16A2,2 0 0,0 2,18H9V20H7V22H15V20H13V18H15V16H2V4H20V9H22V4C22,2.89 21.1,2 20,2Z"
                  />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of channels') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.channels || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-green-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>swap-horizontal</title>
                  <path d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z" />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of units') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.units || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-green-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>expansion-card-variant</title>
                  <path
                    d="M2 7H4.5V17H3V8.5H2M22 7V16H14V17H7V16H6V7M10 9H8V12H10M13 9H11V12H13M20 9H15V14H20V9Z"
                  />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of locations') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.locations || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-blue-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>map-marker-outline</title>
                  <path
                    d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z"
                  />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of organizations') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.organizations || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-blue-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>office-building-outline</title>
                  <path
                    d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                  />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of subdivisions') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.subdivisions || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-blue-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>office-building-outline</title>
                  <path
                    d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                  />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of departments') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.departments || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-blue-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>office-building-outline</title>
                  <path
                    d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                  />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of Internets') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.internets || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-indigo-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>web</title>
                  <path
                    d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                  />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of E-Mails') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.mailboxes || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-indigo-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>at</title>
                  <path
                    d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.75,2 17.1,3 19.05,4.95C21,6.9 22,9.25 22,12V13.45C22,14.45 21.65,15.3 21,16C20.3,16.67 19.5,17 18.5,17C17.3,17 16.31,16.5 15.56,15.5C14.56,16.5 13.38,17 12,17C10.63,17 9.45,16.5 8.46,15.54C7.5,14.55 7,13.38 7,12C7,10.63 7.5,9.45 8.46,8.46C9.45,7.5 10.63,7 12,7C13.38,7 14.55,7.5 15.54,8.46C16.5,9.45 17,10.63 17,12V13.45C17,13.86 17.16,14.22 17.46,14.53C17.76,14.84 18.11,15 18.5,15C18.92,15 19.27,14.84 19.57,14.53C19.87,14.22 20,13.86 20,13.45V12C20,9.81 19.23,7.93 17.65,6.35C16.07,4.77 14.19,4 12,4C9.81,4 7.93,4.77 6.35,6.35C4.77,7.93 4,9.81 4,12C4,14.19 4.77,16.07 6.35,17.65C7.93,19.23 9.81,20 12,20H17V22H12C9.25,22 6.9,21 4.95,19.05C3,17.1 2,14.75 2,12C2,9.25 3,6.9 4.95,4.95C6.9,3 9.25,2 12,2Z"
                  />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>

        <div class="w-full p-4 lg:w-1/2">
          <div
            class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 mb-0"
          >
            <div class="flex justify-between mb-3">
              <div>
                <span class="block font-bold mb-3">{{ $t('Total number of autoanswers') }}</span>
                <div class="font-bold text-primary-500 text-xl">
                  {{ stats?.autoanswers || '-' }}
                </div>
              </div>
              <div class="flex items-center justify-center bg-indigo-100 rounded w-12 h-12 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <title>swap-horizontal-bold</title>
                  <path d="M8,10V13H14V18H8V21L2,15.5L8,10M22,8.5L16,3V6H10V11H16V14L22,8.5Z" />
                </svg>
              </div>
            </div>
            <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
            <span class="">{{ currentDate }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap content-start p-4 md:w-1/2 md:pl-2">
        <div
          class="w-full bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 h-[30rem] mb-6"
        >
          <div class="flex justify-between items-center mb-5">
            <h5 class="font-bold text-xl">
              {{ $t('Locations status') }}
            </h5>
            <div>
              <Button text plain outline rounded icon="pi pi-ellipsis-v" class="w-12 h-12" />
            </div>
          </div>

          <ul class="list-none h-80 overflow-auto">
            <li
              class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
              v-for="(item, index) of stats.IPByLocations"
              :key="index"
            >
              <div class="w-4/5">
                <span class="text-primary-500 font-bold text-xl">
                  {{ item?.name || '-' }}
                </span>
                <div>
                  {{ $t('Count devices') }} {{ item.count }} {{ $t('of') }}
                  {{ stats.ipaddresses }}
                </div>
              </div>

              <div class="flex items-center w-full">
                <div class="bg-surface-500/20 rounded overflow-hidden w-4/5 h-6 mr-6">
                  <div
                    class="bg-green-300 h-full"
                    :style="`width: ${onCountPercentWidth(item.count, stats.ipaddresses)}px`"
                  ></div>
                </div>
                <span class="text-green-500 font-bold w-1/5">
                  {{ onCountPercent(item.count, stats.ipaddresses) }} %
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div
          class="w-full bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 h-[30rem] mb-6"
        >
          <div class="flex justify-between items-center mb-5">
            <h5 class="font-bold text-xl">{{ $t('Devices status') }}</h5>
            <div>
              <Button text plain outline rounded icon="pi pi-ellipsis-v" class="w-12 h-12" />
            </div>
          </div>
          <ul class="list-none h-80 overflow-auto">
            <li
              class="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
              v-for="(item, index) of stats.IPByUnits"
              :key="index"
            >
              <div class="w-4/5">
                <span class="text-primary-500 font-bold text-xl">
                  {{ item?.name || '-' }}
                </span>
                <div>
                  {{ $t('Count devices') }} {{ item.count }} {{ $t('of') }}
                  {{ stats.ipaddresses }}
                </div>
              </div>
              <div class="flex items-center w-full">
                <div class="bg-surface-500/20 rounded overflow-hidden w-4/5 h-6 mr-6">
                  <div
                    class="bg-green-300 h-full"
                    :style="`width: ${onCountPercentWidth(item.count, stats.ipaddresses)}px`"
                  ></div>
                </div>
                <span class="text-green-500 font-bold w-1/5">
                  {{ onCountPercent(item.count, stats.ipaddresses) }} %
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
