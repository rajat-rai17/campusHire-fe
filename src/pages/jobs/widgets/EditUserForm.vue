<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { Job, UserRole } from '../types'
import UserAvatar from './UserAvatar.vue'
import { useProjects } from '../../projects/composables/useProjects'
import { validators } from '../../../services/utils'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps({
  user: {
    type: Object as PropType<Job | null>,
    default: null,
  },
  programData: {
    type: Array as PropType<Array<any>>,  // Accept programData
    default: () => [],
  },
  companyData: {
    type: Array as PropType<Array<any>>,  // Accept companyData
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

const companyOptions = computed(() => {
  return props.companyData.map(company => ({
    value: company.companyId, // Bind companyId
    text: company.name // Show company name
  }));
});

const defaultNewUser: Job = {
  jobId: 0,
  title:'',
  description:'',
  interviewDate: new Date(),
  location:'',
  companies:'',
  programs:[],
  type:'',
  locationType:'',
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
  (newValue) => {
    if (newValue) {
      newUser.value = { ...newValue }; // Populate with the incoming user data
      // Auto-set program and company selections based on `userToEdit`
      newUser.value.programs = newValue.programId
        ? programOptions.value.filter(p => p.value === newValue.programId)
        : [];
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
const roleSelectOptions: {  }[] = [
  { text: 'Remote', value: 'Remote' },
  { text: 'Hybrid', value: 'Hybrid' },
  { text: 'OnSite', value: 'OnSite' },
]
const roleSelectOptions2: {  }[] = [
  { text: 'Full Time', value: 'Full Time' },
  { text: 'Part Time', value: 'Part Time' },
  { text: 'Internship', value: 'Internship' },
]
</script>

<style scoped>
/* Reduce overall calendar pop-up size */
:deep(.dp__menu) {
  max-width: 200px !important;  /* Reduce calendar width */
  min-width: 180px !important;
  padding: 4px !important; /* Remove extra padding */
  
}

/* Ensure the label styling matches VaInput */
:deep(.dp__input_wrapper) {
  display: flex !important;
  align-items: center !important;
  width: 100% !important;
}

/* Reduce overall font size */
:deep(.dp__main) {
  font-size: 17px !important;  /* Smaller text */
  max-width: 200px !important;
  padding: 2px !important; /* Minimize padding */
}

/* Match dropdown button size */
:deep(.dp__icon) {
  width: 18px !important;
  height: 18px !important;
}

/* Reduce input box size */
:deep(.dp__input) {
  height: 42px !important;  /* Match VaInput height */
  padding: 10px 12px !important;  /* Match padding */
  font-size: 14px !important; /* Ensure text size consistency */
  border: 1px solid #d1d5db !important; /* Light gray border */
  border-radius: 6px !important; /* Match input border radius */
  width: 100% !important; /* Ensure full width */
  /* height: 26px !important; */
  /*padding: 3px 6px !important; /* Reduce padding */
}

/* Reduce calendar box height */
:deep(.dp__calendar) {
  transform: scale(0.85);  /* Shrink calendar */
  max-height: 220px !important; /* Reduce height */
  padding: 0px !important; /* Remove extra padding */
  max-width: 250px !important;

}

/* Reduce header (month/year navigation) */
:deep(.dp__calendar_header) {
  font-size: 17px !important;
  padding: 2px !important;
}

/* Reduce day cell size */
:deep(.dp__cell_inner) {
  width: 22px !important;  
  height: 22px !important;
  font-size: 17px !important;
  padding: 1px !important;
}

/* Adjust buttons at the bottom */
:deep(.dp__action) {
  font-size: 17px !important;
  padding: 2px !important;
}

/* Reduce the size of the selected date display */
:deep(.dp__selection_preview) {
  font-size: 17px !important;
  padding: 2px !important;
}

/* Shrink navigation arrows */
:deep(.dp__arrow) {
  width: 12px !important;
  height: 12px !important;
}
</style>


<template>
  <VaForm v-slot="{ isValid }" ref="add-user-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput v-model="newUser.title" label="Title" class="w-full sm:w-1/2" :rules="[validators.required]"
          name="title" />
        <VaInput v-model="newUser.location" label="Location" class="w-full sm:w-1/2" :rules="[validators.required]"
          name="location" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect v-model="newUser.companies" :options="companyOptions" track-by="value" label="Company Name"
          class="w-full sm:w-1/2" :rules="[validators.required]" name="type" />
        <VaSelect v-model="newUser.locationType" label="Location Type" class="w-full sm:w-1/2"
          :options="roleSelectOptions" :rules="[validators.required]" name="locationType" value-by="value" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect v-model="newUser.programs" :options="programOptions" track-by="value" text-by="text"   label="Eligible Programs"
          class="w-full sm:w-1/2" :rules="[validators.required]" />
        <VaSelect v-model="newUser.type" label="Type" class="w-full sm:w-1/2" :options="roleSelectOptions2"
          :rules="[validators.required]" name="type" value-by="value" />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <div class="w-full sm:w-1/2">
          <label class="block text-blue-700 text-sm font-medium mb-1">Interview Date</label>
          <Datepicker v-model="newUser.interviewDate" class="w-full text-sm border border-gray-300 rounded-md"
            :enable-time-picker="false" />
        </div>
        
      </div>
      <!-- <div class="flex gap-4 flex-col sm:flex-row w-full"> -->
          <VaTextarea v-model="newUser.description" label="Description" class="w-full" name="description" />
        <!-- </div> -->
      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>