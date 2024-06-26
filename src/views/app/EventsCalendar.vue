<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { Qalendar } from 'qalendar';

import { dateTimeToStr } from '@/service/DataFilters';
import { useEvent } from '@/stores/api/events';

const Modal = defineAsyncComponent(() => import('@/components/modals/Event.vue'));

const { t, locale } = useI18n();

const toast = useToast();
const confirm = useConfirm();
const { findAll, removeOne } = useEvent();

const colorScheme = ref({
  event: {
    color: '#fff',
    backgroundColor: '#2196f3'
  },
  meeting: {
    color: '#fff',
    backgroundColor: '#fbc02d'
  },
  deadline: {
    color: '#fff',
    backgroundColor: '#ff4032'
  },
  holiday: {
    color: '#fff',
    backgroundColor: '#607d8b'
  },
  birthday: {
    color: '#fff',
    backgroundColor: '#9c27b0'
  }
});

const refModal = ref();

const loading = ref(false);
const records = ref([]);

const startDate = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
const endDate = ref(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

const config = computed(() => {
  return {
    style: {
      fontFamily: 'Nunito, sans-serif',
      colorSchemes: colorScheme.value
    },
    week: {
      startsOn: 'monday',
      nDays: 7
    },
    month: {
      showTrailingAndLeadingDates: true
    },
    locale: fixLocale(locale?.value),
    defaultMode: 'month',
    disableModes: ['week', 'month'],
    isSilent: true,
    showCurrentTime: true,
    eventDialog: { isCustom: true }
  };
});

const enents = computed(() => {
  return records.value?.map(({ id, title, datetime, eventType, description }) => {
    return {
      id,
      title,
      datetime,
      description,
      time: {
        start: new Date(datetime).toISOString().split('T')[0],
        end: new Date(datetime).toISOString().split('T')[0]
      },
      colorScheme: eventType,
      isEditable: true
    };
  });
});

const fixLocale = key => {
  if (key === 'uk') return 'uk-UA';
  if (key === 'ru') return 'ru-RU';
  return 'en-US';
};

const getDataRecords = async () => {
  try {
    loading.value = true;
    records.value = await findAll({
      startDate: startDate.value,
      endDate: endDate.value
    });
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: t('Records is updated'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t('Records not updated'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const handleMonthChange = async value => {
  startDate.value = value.start;
  endDate.value = value.end;
  await getDataRecords();
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
        await getDataRecords();
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

onMounted(async () => {
  try {
    await getDataRecords();
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
  <div>
    <Modal ref="refModal" @close="async () => await getDataRecords()" />

    <div class="flex justify-between flex-wrap mb-2">
      <div class="flex flex-wrap gap-2 items-center">
        <i class="mr-2 hidden sm:block">
          <AppIcons :name="$route?.name" :size="42" />
        </i>
        <div>
          <h3 class="text-2xl">
            {{ $t($route?.meta?.title) }}
          </h3>
          <p class="text-base text-surface-500">
            {{ $t($route?.meta?.description) }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2 items-center justify-between sm:w-max w-full">
        <div class="flex gap-2 sm:w-max w-full justify-between">
          <Button
            text
            plain
            rounded
            icon="pi pi-plus-circle"
            iconClass="text-2xl"
            class="h-12 w-12"
            v-tooltip.bottom="$t('Create record')"
            @click="refModal.toggle({})"
          />

          <Button
            text
            plain
            rounded
            icon="pi pi-sync"
            iconClass="text-2xl"
            class="h-12 w-12"
            v-tooltip.bottom="$t('Update records')"
            @click="getDataRecords"
          />

          <Button
            text
            plain
            rounded
            icon="pi pi-cog"
            iconClass="text-2xl"
            class="h-12 w-12"
            v-tooltip.bottom="$t('Options')"
          />
        </div>
      </div>
    </div>

    <div class="flex w-full" style="height: calc(100vh - 13rem)">
      <Qalendar
        :events="enents"
        :config="config"
        :is-loading="loading"
        :selected-date="new Date()"
        @updated-period="handleMonthChange"
      >
        <template #eventDialog="{ eventDialogData, closeEventDialog }">
          <div v-if="eventDialogData && eventDialogData?.title">
            <Card class="w-full p-2 border-red-500">
              <template #title>
                <div class="flex content-center items-center justify-between flex-wrap">
                  <div class="flex content-center items-center">
                    <i
                      class="pi pi-circle-fill mr-2"
                      :style="{
                        color: colorScheme[eventDialogData.colorScheme].backgroundColor
                      }"
                    />
                    <span
                      class="text-xl"
                      :style="{
                        color: colorScheme[eventDialogData.colorScheme].backgroundColor
                      }"
                    >
                      {{ eventDialogData?.title }}
                    </span>
                  </div>
                  <div class="flex items-center justify-center">
                    <div class="flex items-center flex-wrap gap-2 justify-between w-full">
                      <div class="flex gap-2 w-full justify-between">
                        <Button
                          text
                          plain
                          rounded
                          icon="pi pi-trash"
                          class=""
                          v-tooltip.bottom="$t('Delete record')"
                          @click="
                            () => {
                              closeEventDialog();
                              confirmDelete(eventDialogData);
                            }
                          "
                        />

                        <Button
                          text
                          plain
                          rounded
                          icon="pi pi-file-edit"
                          class=""
                          v-tooltip.bottom="$t('Update record')"
                          @click="
                            () => {
                              closeEventDialog();
                              refModal.toggle(eventDialogData);
                            }
                          "
                        />

                        <Button
                          text
                          plain
                          rounded
                          icon="pi pi-times"
                          class=""
                          v-tooltip.bottom="$t('Close')"
                          @click="closeEventDialog"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template #subtitle>
                <div class="flex content-center items-center">
                  <i class="pi pi-clock mr-2"></i>
                  <span>
                    {{ dateTimeToStr(eventDialogData?.datetime) || '-' }}
                  </span>
                </div>
              </template>
              <template #content>
                <p>
                  {{ eventDialogData?.description }}
                </p>
              </template>
            </Card>
          </div>
        </template>
      </Qalendar>
    </div>
  </div>
</template>

<style>
@import 'qalendar/dist/style.css';
</style>

<style scoped>
::v-deep(.calendar-month__event) {
  padding: 5px 10px;
}

::v-deep(.calendar-month__event:hover) {
  padding: 5px 10px;
}

::v-deep(.date-picker.is-in-qalendar) {
  display: none !important;
}

::v-deep(.event-flyout) {
  border-color: var(--qalendar-border-color) !important;
}

::v-deep(.calendar-root) {
  border-color: var(--qalendar-border-color) !important;
}

::v-deep(.calendar-month__weekday) {
  border-color: var(--qalendar-border-color) !important;
}

::v-deep(.calendar-month__weekday.trailing-or-leading) {
  border-color: var(--qalendar-border-color) !important;
  background: linear-gradient(45deg, transparent 49.9%, #80808010 0, #80808010 60%, transparent 0)
      fixed,
    linear-gradient(45deg, #80808010 10%, transparent 0) fixed,
    linear-gradient(-45deg, transparent 49.9%, #80808010 0, #80808010 60%, transparent 0) fixed,
    linear-gradient(-45deg, #80808010 10%, transparent 0) fixed !important;
  background-size: 0.5em 0.5em !important;
}

::v-deep(.calendar-month__weekday.trailing-or-leading > span.calendar-month__day-date) {
  color: var(--qalendar-text-color-secondary) !important;
}

::v-deep(.calendar-header) {
  padding-left: 2rem !important;
  padding-right: 2rem !important;
}

::v-deep(.calendar-header__period-name) {
  color: var(--text-color) !important;
  font-weight: 700 !important;
}

::v-deep(.calendar-month__day-name) {
  font-size: 1.125rem !important;
  font-weight: 700 !important;
  width: 100%;
  margin: 0 auto !important;
  padding: 0.5rem 0 !important;
  text-align: center !important;
  color: var(--text-color) !important;
}

::v-deep(.calendar-month__event-wrapper) {
  padding: 0.2rem 1rem !important;
}

::v-deep(.calendar-month__day-date) {
  font-size: 1rem !important;
  font-weight: 700 !important;
  color: var(--text-color) !important;
  margin-bottom: 1rem !important;
}

::v-deep(.calendar-month__event-title) {
  font-size: 1rem !important;
  color: var(--text-color) !important;
}

::v-deep(.calendar-month__event-color) {
  width: 1rem !important;
  height: 1rem !important;
}

::v-deep(.calendar-month__event-time) {
  font-size: 1rem !important;
  color: var(--text-color) !important;
}

::v-deep(div.calendar-month__week:last-child > div.calendar-month__weekday) {
  border-bottom: none;
}
</style>
