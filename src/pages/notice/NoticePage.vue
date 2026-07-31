<script setup lang="ts">
import { ref } from 'vue'
import NoticeTable from './widgets/NoticeTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import { Notice } from './types'
import { useNotice } from './composables/useNotice'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { users, isLoading, filters, sorting, pagination, ...usersApi } = useNotice()
const userToEdit = ref<Notice | null>(null)
const programData = ref([])

const showEditUserModal = async (user: Notice) => {
  userToEdit.value = user
  doShowEditUserModal.value = true
  const result = await usersApi.masterData()
  programData.value = result.data.programData || []
}

const showAddUserModal = async () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
  const result = await usersApi.masterData()
  programData.value = result.data.programData || []
}

const { init: notify } = useToast()

const onUserSaved = async (user: Notice) => {
  const isEdit = Boolean(userToEdit.value)
  const apiMethod = isEdit ? usersApi.update : usersApi.add
  const successMessage = `${user.noticeId} has been ${isEdit ? 'updated' : 'added'}`
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

const onUserDelete = async (notice: Notice) => {
  await usersApi.remove(notice)
  notify({
    message: `${notice.noticeId} has been deleted`,
    color: 'success',
  })
}

const editFormRef = ref()

const { confirm } = useModal()
</script>

<template>
  <h1 class="page-title">Notice</h1>

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
        <VaButton @click="showAddUserModal">Add Notice</VaButton>
      </div>

      <NoticeTable
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
    <h1 class="va-h5">{{ userToEdit ? 'Edit Notice' : 'Add Notice' }}</h1>
    <EditUserForm
      ref="editFormRef"
      :user="userToEdit"
      :program-data="programData"
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
