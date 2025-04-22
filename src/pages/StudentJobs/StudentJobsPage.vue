<script setup lang="ts">
import { ref } from 'vue'
import JobsTable from './widgets/StudentJobsTable.vue'
import { Job } from './types'
import { useJobs } from './composables/useJobs'
import { useModal, useToast } from 'vuestic-ui'


const { users, isLoading, filters, sorting, pagination, ...usersApi } = useJobs()
const userToEdit = ref<Job | null>(null)
  const programData = ref([]);   // Store program data
  const companyData = ref([]);   // Store company data


const { init: notify } = useToast()



const onUserApplied = async (job: Job) => {
  await usersApi.remove(job)
  notify({
    message: `${job.title} has been applied`,
    color: 'success',
  })
}

const editFormRef = ref()

const { confirm } = useModal()

</script>


<template>
  <h1 class="page-title">Jobs</h1>

  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="filters.isApplied"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: false },
              { label: 'Inactive', value: true },
            ]"
          />
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
      </div>

      <JobsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @deleteUser="onUserApplied"
      />
    </VaCardContent>
  </VaCard>

</template>
