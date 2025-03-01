<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Company, UserRole } from '../types'
import UserAvatar from './UserAvatar.vue'
import { useProjects } from '../../projects/composables/useProjects'
import { validators } from '../../../services/utils'

const props = defineProps({
  user: {
    type: Object as PropType<Company | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewUser: Company = {
  companyId:0,
  mobileNo: '',
  name: '',
  email: '',
  sector: '',
  spocName: '',
  spocMobileNo: '',
  website: ''
}

const newUser = ref<Company>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newUser.value[key as keyof Company] !== (props.user ?? defaultNewUser)?.[key as keyof Company]
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
          v-model="newUser.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaInput
          v-model="newUser.email"
          label="Email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        
        <VaInput
          v-model="newUser.mobileNo"
          label="Mobile Number"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="mobileNo"
        />

        <VaInput
          v-model="newUser.sector"
          label="Sector"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="sector"
        />
      </div>

      <div class="flex gap-4 flex-col sm:flex-row w-full">
        
        <VaInput
          v-model="newUser.spocName"
          label="SPOC Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="spocName"
        />

        <VaInput
          v-model="newUser.spocMobileNo"
          label="SPOC Mobile Number"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="spocMobileNo"
        />
      </div>

      <div class="flex gap-4 flex-col sm:flex-row w-full">
        
        <VaInput
          v-model="newUser.website"
          label="Website"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="website"
        />
      </div>




      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
