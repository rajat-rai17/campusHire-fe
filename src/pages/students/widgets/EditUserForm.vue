<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Student, UserRole } from '../types'
import UserAvatar from './UserAvatar.vue'
import { useProjects } from '../../projects/composables/useProjects'
import { validators } from '../../../services/utils'

const props = defineProps({
  user: {
    type: Object as PropType<Student | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewUser: Student = {
  studentId: '',
  mobileNo: '',
  name: '',
  program: '',
  email: '',
}

const newUser = ref<Student>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newUser.value[key as keyof Student] !== (props.user ?? defaultNewUser)?.[key as keyof Student]
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
      newUser.value = { ...newValue } // Populate with the incoming user data
    } else {
      newUser.value = { ...defaultNewUser } // Reset to default for a new user
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

const roleSelectOptions: {}[] = [
  { text: 'Bsc IT', value: 'Bsc IT' },
  { text: 'Bsc Computer Science', value: 'Bsc Computer Science' },
  { text: 'BMM', value: 'BMM' },
]
</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.studentId"
          label="Student Id"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="studentId"
        />
        <VaInput
          v-model="newUser.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.email"
          label="Email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
        />
        <VaInput
          v-model="newUser.mobileNo"
          label="Mobile Number"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="mobileNo"
        />
      </div>

      <div class="flex gap-4 w-full">
        <div class="w-full sm:w-1/2">
          <VaSelect
            v-model="newUser.program"
            label="Program"
            class="w-full"
            :options="roleSelectOptions"
            :rules="[validators.required]"
            name="role"
            value-by="value"
          />
        </div>
      </div>
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
