<script setup lang="jsx">
import { ref } from 'vue';
import * as yup from 'yup';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useForm } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import Panel from 'primevue/panel';

import SSDataTable from '@/components/tables/SSDataTable.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/ONMAP.vue';
import SidebarRecord from '@/components/sidebar/ONMAP.vue';

import { dateTimeToStr } from '@/service/DataFilters';
import { useOnmap } from '@/stores/api/onmaps';

const { t } = useI18n();
const toast = useToast();

const Onmap = useOnmap();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();
const subheader = ref(false);

const { values, errors, handleSubmit, setFieldValue, resetForm, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    title: yup.string().required(t('Value is required')),
    target: yup
      .string()
      .required(t('Value is required'))
      .test('ipaddress', 'Incorrect IP address', value => {
        const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Pattern.test(value) || ipv6Pattern.test(value);
      }),
    command: yup.string().required(t('Value is required'))
  }),
  initialValues: {}
});

const title = defineComponentBinds('title');
const target = defineComponentBinds('target');
const command = defineComponentBinds('command');
const profile = defineComponentBinds('profile');

const SCAN_PROFILES = ref([
  { id: 'prf_1', name: 'Intense scan', flags: ['-T4', '-A', '-v'] },
  { id: 'prf_2', name: 'Intense scan plus UDP', flags: ['-sS', '-sU', '-T4', '-A', '-v'] },
  { id: 'prf_3', name: 'Intense scan, all TCP ports', flags: ['-p 1-65535', '-T4', '-A', '-v'] },
  { id: 'prf_4', name: 'Intense scan, no ping', flags: ['-T4', '-A', '-v', '-Pn'] },
  { id: 'prf_5', name: 'Ping scan', flags: ['-sn'] },
  { id: 'prf_7', name: 'Quick scan', flags: ['-T4', '-F'] },
  { id: 'prf_8', name: 'Quick scan plus', flags: ['-sV', '-T4', '-O', '-F', '--version-light'] },
  { id: 'prf_9', name: 'Quick traceroute', flags: ['-sn', '--traceroute'] }
]);

const globalFilter = ref({
  field: 'target',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Search target'
});

const columns = ref([
  {
    header: { text: 'Title', width: '16rem' },
    column: {
      field: 'title',
      render(value) {
        return (
          <div class="font-medium cursor-pointer">
            <span>{value}</span>
          </div>
        );
      },
      action(value) {
        refSidebar.value.toggle(value);
      }
    },
    sorter: { field: 'title' },
    filter: {
      field: 'title',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Status', width: '10rem' },
    column: {
      field: 'upHost',
      render(value) {
        return (
          <Tag
            class={
              value > 0
                ? 'text-base text-white font-medium w-4 bg-green-500'
                : 'text-base text-white font-medium w-4 bg-gray-500'
            }
            value={value > 0 ? t('UP') : t('DOWN')}
          />
        );
      }
    },
    sorter: { field: 'upHost' },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Target', width: '15rem' },
    column: {
      field: 'target',
      render(value) {
        return <span class="font-medium text-primary cursor-pointer">{value}</span>;
      },
      action(value) {
        refModal.value.toggle(value);
      }
    },
    sorter: { field: 'target' },
    filter: {
      field: 'target',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Report date', width: '15rem' },
    column: {
      field: 'updatedAt',
      render(value) {
        return <span>{dateTimeToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'updatedAt' },
    filter: {
      field: 'updatedAt',
      value: null,
      matchMode: FilterMatchMode.DATE_IS
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Profile', width: '16rem' },
    column: {
      field: 'profile',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'profile' },
    filter: {
      field: 'profile',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'name',
        label: 'name',
        onRecords: () => {
          return SCAN_PROFILES.value;
        }
      }
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Flags', width: '15rem' },
    column: {
      field: 'flags',
      render(value) {
        return <span>{value?.join(' ') || '-'}</span>;
      }
    },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: false,
    frozen: false
  }
]);

const runTargetScan = handleSubmit(async () => {
  try {
    await Onmap.createOne({
      title: values.title,
      target: values.target,
      profile: values.profile.name,
      flags: values.profile.flags
    });
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('Scan is completed'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Scanning interrupted'),
      life: 3000
    });
  } finally {
    refDataTable.value.update({});
  }
});
</script>

<template>
  <div class="col-12">
    <div class="flex h-full">
      <OptionsMenu
        ref="refMenu"
        hostkey="host"
        @view="data => refModal.toggle(data)"
        @create="subheader = !subheader"
        @update="data => refModal.toggle(data)"
        @delete="data => refDataTable.delete(data)"
      />

      <ModalRecord ref="refModal" @close="() => refDataTable.update({})" />

      <SSDataTable
        ref="refDataTable"
        :columns="columns"
        :globalFilter="globalFilter"
        :storageKey="`app-${$route.name}-datatable`"
        :exportFileName="$route.name"
        :onUpdate="Onmap.findAll"
        :onDelete="Onmap.removeOne"
        @toggle-menu="(event, data) => refMenu.toggle(event, data)"
        @toggle-modal="subheader = !subheader"
        @toggle-sidebar="data => refSidebar.toggle(data)"
      >
        <template #icon>
          <i class="my-auto mr-2 hidden sm:block">
            <AppIcons :name="$route?.name" :size="42" />
          </i>
        </template>

        <template #title>
          {{ $t($route?.meta?.title) }}
        </template>

        <template #subtitle>
          {{ $t($route?.meta?.description) }}
        </template>

        <template #actions> </template>

        <template #subheader>
          <Panel class="border-1 border-solid surface-border shadow-none" v-show="subheader">
            <template #header>
              <div class="flex align-items-center gap-2">
                <span class="font-bold">{{ $t('Onmap scanner run') }}</span>
              </div>
            </template>

            <template #footer>
              <div class="flex flex-wrap align-items-center justify-content-between gap-3 px-2">
                <div class="flex align-items-center gap-2">
                  <Button :label="$t('Scan')" class="w-15rem" @click="runTargetScan" />
                  <Button
                    :label="$t('Cancel')"
                    severity="secondary"
                    class="w-10rem"
                    @click="resetForm({ values: {} }, { force: true })"
                  />
                </div>
                <span class="p-text-secondary">...</span>
              </div>
            </template>

            <div class="formgrid grid p-2">
              <div class="field col-12 md:col-3">
                <label for="target">{{ $t('Target') }}</label>
                <InputText
                  id="target"
                  class="w-full"
                  v-bind="target"
                  :placeholder="$t('Scan target')"
                  :class="{ 'p-invalid': !!errors?.target }"
                  aria-describedby="target-help"
                />
                <small id="target-help" class="p-error" v-if="errors?.target">
                  {{ $t(errors.target) }}
                </small>
              </div>

              <div class="field col-12 md:col-9">
                <label for="title">{{ $t('Title') }}</label>
                <InputText
                  id="title"
                  class="w-full"
                  v-bind="title"
                  :placeholder="$t('Scan title')"
                  :class="{ 'p-invalid': !!errors?.title }"
                  aria-describedby="title-help"
                />
                <small id="title-help" class="p-error" v-if="errors?.title">
                  {{ $t(errors.title) }}
                </small>
              </div>

              <div class="field col-12 md:col-3">
                <label for="profile">{{ $t('Profile') }}</label>
                <Dropdown
                  filter
                  showClear
                  autofocus
                  optionLabel="name"
                  v-bind="profile"
                  :options="SCAN_PROFILES"
                  @change="
                    event => {
                      setFieldValue('command', event.value.flags.join(' '));
                    }
                  "
                  :filterPlaceholder="$t('Search in list')"
                  :placeholder="$t('Select scan profile')"
                  class="w-full"
                />
              </div>

              <div class="field col-12 md:col-9">
                <label for="command">{{ $t('Command') }}</label>
                <InputText
                  id="command"
                  class="w-full"
                  v-bind="command"
                  :readonly="true"
                  :placeholder="$t('Scan command')"
                  :class="{ 'p-invalid': !!errors?.command }"
                  aria-describedby="command-help"
                />
                <small id="command-help" class="p-error" v-if="errors?.command">
                  {{ $t(errors.command) }}
                </small>
              </div>
            </div>
          </Panel>
        </template>
      </SSDataTable>

      <SidebarRecord ref="refSidebar" @toggle-menu="(event, data) => refMenu.toggle(event, data)" />
    </div>
  </div>
</template>
