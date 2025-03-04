<script setup lang="ts">
import { ref } from 'vue'
import JobsTable from './widgets/JobsTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import { Job } from './types'
import { useJobs } from './composables/useJobs'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { users, isLoading, filters, sorting, pagination, ...usersApi } = useJobs()
const userToEdit = ref<Job | null>(null)
  const programData = ref([]);   // Store program data
  const companyData = ref([]);   // Store company data

const showEditUserModal =  async (user: Job) => {
  userToEdit.value = user
  doShowEditUserModal.value = true
  const result = await usersApi.masterData()
  programData.value = result.data.programData || [];
  companyData.value = result.data.companyData || [];
}

const showAddUserModal =  async () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
  const result = await usersApi.masterData()
  programData.value = result.data.programData || [];
  companyData.value = result.data.companyData || [];
  
}

const { init: notify } = useToast()

const onUserSaved = async (user: Job) => {
  const isEdit = Boolean(userToEdit.value);
  const apiMethod = isEdit ? usersApi.update : usersApi.add;
  const successMessage = `${user.title} has been ${isEdit ? 'updated' : 'added'}`;
  const errorMessage = isEdit ? 'Failed to update user' : 'Failed to add user';

  try {
    const result = await apiMethod(user);

    notify({
      message: result?.status ? successMessage : result?.message || errorMessage,
      color: result?.status ? 'success' : 'danger',
    });
  } catch (error) {
    notify({
      message: error?.message || 'An unexpected error occurred',
      color: 'danger',
    });
  }
};



const onUserDelete = async (job: Job) => {
  await usersApi.remove(job)
  notify({
    message: `${job.title} has been deleted`,
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
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddUserModal">Add Job</VaButton>
      </div>

      <JobsTable
        v-model:sort-by="sorting.sortBy"
        v-model:sorting-order="sorting.sortingOrder"
        :users="users"
        :loading="isLoading"
        :pagination="pagination"
        @editUser="showEditUserModal"
        @deleteUser="onUserDelete"
      />
    </VaCardContent>
  </VaCard>

  <VaModal
    v-slot="{ cancel, ok }"
    v-model="doShowEditUserModal"
    size="small"
    mobile-fullscreen
    close-button
    hide-default-actions
    :style="{ height: '900px', maxHeight: '180vh' }"
  >
    <h1 class="va-h5">{{ userToEdit ? 'Edit Job' : 'Add Job' }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
       :program-data="programData"
      :company-data="companyData"
      :save-button-label="userToEdit ? 'Save' : 'Add'"
      @close="cancel"
      @save="
        (user) => {
          onUserSaved(user)
          ok()
        }
      "
    />
  </VaModal>
</template>
