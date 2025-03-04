<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import { VaForm } from 'vuestic-ui'
import { Notice } from '../types'

const props = defineProps({
  notice: {
    type: Object as PropType<Notice | null>,
    default: null,
  },
})

const defaultNotice: Notice = {
  noticeId: 0,
  title: '',
  attachment: '',
  program: '',
}

const newNotice = ref<Notice>({ ...defaultNotice })
watch(() => props.notice, (newValue) => {
  newNotice.value = newValue ? { ...newValue } : { ...defaultNotice }
}, { immediate: true })

const form = ref()

const emit = defineEmits(['close', 'save'])

const requiredRule = (value: string) => !!value || 'Title is required'

const onSave = () => {
  if (form.value?.validate()) {
    emit('save', newNotice.value)
  }
}
</script>

<template>
  <VaForm ref="form">
    <VaInput v-model="newNotice.title" label="Title" :rules="[requiredRule]" />
    <VaInput v-model="newNotice.attachment" label="Attachment URL" />
    <VaSelect v-model="newNotice.program" label="Program" :options="['Engineering', 'Management', 'Science']" />

    <div class="flex justify-end gap-2">
      <VaButton @click="$emit('close')">Cancel</VaButton>
      <VaButton @click="onSave">Save</VaButton>
    </div>
  </VaForm>
</template>
