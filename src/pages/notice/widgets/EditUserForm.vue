<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Notice, UserRole } from '../types'
import UserAvatar from './UserAvatar.vue'
import { useProjects } from '../../projects/composables/useProjects'
import { validators } from '../../../services/utils'

const props = defineProps({
  user: {
    type: Object as PropType<Notice | null>,
    default: null,
  },
  programData: {
    type: Array as PropType<Array<any>>,  // Accept programData
    default: () => [],
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})
const programOptions = computed(() => {
  return props.programData.map(program => ({
    value: program.programId, // Bind programId
    text: program.name // Show program name
  }));
});


const defaultNewUser: Notice = {
  noticeId:0,
  title: '',
  programs:[]
}

const newUser = ref<Notice>({ ...defaultNewUser })

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === 'avatar' || key === 'projects') {
      return false
    }

    return newUser.value[key as keyof Notice] !== (props.user ?? defaultNewUser)?.[key as keyof Notice]
  })
})

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.user,
  (newValue) => {
    if (newValue) {
      newUser.value = { ...newValue };// Populate with the incoming user data
      // Auto-set program and company selections based on `userToEdit` 
      newUser.value.programs = newValue.programId
        ? programOptions.value.filter(p => p.value === newValue.programId)
        : [];// Populate with the incoming user data
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
        <VaSelect v-model="newUser.programs" :options="programOptions" track-by="value" text-by="text"   label="ELigible Programs"
          class="w-full sm:w-1/2" :rules="[validators.required]" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaTextarea v-model="newUser.title" label="Title" class="w-full" name="title" />
      </div>
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
