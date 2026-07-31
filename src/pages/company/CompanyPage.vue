<script setup lang="ts">
import { ref } from 'vue'
import CompanyTable from './widgets/CompanyTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import { Company } from './types'
import { useCompany } from './composables/useCompany'
import { useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { users, isLoading, filters, sorting, pagination, ...usersApi } = useCompany()
const userToEdit = ref<Company | null>(null)

const showEditUserModal = (user: Company) => {
  userToEdit.value = user
  doShowEditUserModal.value = true
}

const showAddUserModal = () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
}

const { init: notify } = useToast()

const onUserSaved = async (user: Company) => {
  const isEdit = Boolean(userToEdit.value)
  const apiMethod = isEdit ? usersApi.update : usersApi.add
  const successMessage = `${user.name} has been ${isEdit ? 'updated' : 'added'}`
  const errorMessage = isEdit ? 'Failed to update user' : 'Failed to add user'

  try {
    const result = await apiMethod(user)

    notify({
      message: result?.status ? successMessage : result?.message || errorMessage,
      color: result?.status ? 'success' : 'danger',
    })
  } catch (error) {
    notify({
      message: (error as Error)?.message || 'An unexpected error occurred',
      color: 'danger',
    })
  }
}

const onUserDelete = async (company: Company) => {
  await usersApi.remove(company)
  notify({
    message: `${company.name} has been deleted`,
    color: 'success',
  })
}

const editFormRef = ref()
</script>

<template>
  <h1 class="page-title">Company</h1>

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
        <VaButton @click="showAddUserModal">Add Company</VaButton>
      </div>

      <CompanyTable
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
  >
    <h1 class="va-h5">{{ userToEdit ? 'Edit Company' : 'Add Company' }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
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
