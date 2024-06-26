<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useNotice } from '@/stores/api/notices';
import { useProfile } from '@/stores/api/profiles';

const { t } = useI18n();
const toast = useToast();

const { createOne } = useNotice();
const Profile = useProfile();

const { values, errors, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: yup.object({
    title: yup.string().required(t('Value is required')),
    text: yup.string().required(t('Value is required')),
    profiles: yup.array().required(t('Value is required'))
  }),
  initialValues: {}
});

const emits = defineEmits(['close']);

defineExpose({
  toggle: async () => {
    try {
      const { docs } = await Profile.findAll({
        offset: 0,
        limit: 50,
        sort: { fullname: 1 },
        filters: { isActivated: true }
      });
      records.value = docs;
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const records = ref([]);

const [title, titleAttrs] = defineField('title');
const [text, textAttrs] = defineField('text');
const [profiles, profilesAttrs] = defineField('profiles');

const onSendNotice = handleSubmit(async () => {
  try {
    await createOne({
      title: values.title,
      text: values.text,
      profiles: values.profiles.map(({ id }) => id)
    });
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: t('All messages have been sent'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t(err?.message),
      life: 3000
    });
  } finally {
    visible.value = false;
  }
});

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};
</script>

<template>
  <Dialog
    closable
    draggable
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[60vw] lg:w-[50vw] xl:w-[35vw] 2xl:w-[25vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <i class="pi pi-bell text-4xl mr-4"></i>
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('HD Notification') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500">
              {{ $t('Helpdesk system notifications') }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <form class="flex flex-col gap-y-4" @submit.prevent="onSendNotice">
      <div class="flex flex-col gap-2">
        <label for="profiles" class="font-bold">{{ $t('Notification profiles') }}</label>
        <MultiSelect
          id="profiles"
          filter
          v-model="profiles"
          v-bind="profilesAttrs"
          :options="records"
          optionLabel="fullname"
          :maxSelectedLabels="3"
          :placeholder="$t('Notification profiles')"
          :invalid="!!errors?.profiles"
          aria-describedby="profiles-help"
        >
          <template #option="slotProps">
            <div class="flex items-center">
              <Avatar icon="pi pi-user" shape="circle" class="mr-2" />
              <p class="font-semibold">{{ slotProps.option.fullname }}</p>
            </div>
          </template>
        </MultiSelect>
        <small id="profiles-help" class="text-red-500" v-if="errors?.profiles">
          {{ $t(errors.profiles) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="title" class="font-bold">{{ $t('Notification title') }}</label>
        <InputText
          id="title"
          v-model="title"
          v-bind="titleAttrs"
          :placeholder="$t('Notification title')"
          :invalid="!!errors?.title"
          aria-describedby="title-help"
        />
        <small id="title-help" class="text-red-500" v-if="errors?.title">
          {{ $t(errors.title) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="text" class="font-bold">{{ $t('Notification text') }}</label>
        <Textarea
          rows="10"
          id="text"
          v-model="text"
          v-bind="textAttrs"
          :placeholder="$t('Notification text')"
          :invalid="!!errors?.text"
          aria-describedby="text-help"
        />
        <small id="text-help" class="text-red-500" v-if="errors?.text">
          {{ $t(errors.text) }}
        </small>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button
        text
        plain
        icon="pi pi-send"
        :label="$t('Send')"
        v-tooltip.bottom="$t('Send notice')"
        @click="onSendNotice"
      />
    </template>
  </Dialog>
</template>
