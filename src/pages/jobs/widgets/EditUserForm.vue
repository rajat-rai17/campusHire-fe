<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Job, UserRole } from '../types'
import UserAvatar from './UserAvatar.vue'
import { useProjects } from '../../projects/composables/useProjects'
import { validators } from '../../../services/utils'

const props = defineProps({
  user: {
    type: Object as PropType<Job | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewUser: Job = {
  jobId: '',
  title: '',
  workMode: '',
  interviewDate: '',
  location: ''
}

const newUser = ref<Job>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newUser.value[key as keyof Job] !== (props.user ?? defaultNewUser)?.[key as keyof Job]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.user,
  // () => {
  //   if (!props.user) {
  //     return
  //   }
  // },
  (newValue) => {
    if (newValue) {
      newUser.value = { ...newValue }; // Populate with the incoming user data
    } else {
      newUser.value = { ...defaultNewUser }; // Reset to default for a new user
    }
  },
  { immediate: true },
)

const form = useForm('add-user-form')

const emit = defineEmits(['close', 'save'])

const onSave = () => {
  if (form.validate()) {
    emit('save', newUser.value)
  }
}


</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.jobId"
          label="Job Id"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="jobId"
        />
        <VaInput
          v-model="newUser.title"
          label="Title"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="title"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.workMode"
          label="Work Mode"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="email"
        />
        <VaInput
          v-model="newUser.interviewDate"
          label="Interview Date"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="interviewDate"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.location"
          label="Location"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="location"
        />
      </div>

  
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
