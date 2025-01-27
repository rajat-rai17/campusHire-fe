<script setup lang="ts">
import { ref } from 'vue'
import StudentsTable from './widgets/StudentsTable.vue'
import EditUserForm from './widgets/EditUserForm.vue'
import { Student } from './types'
import { useStudents } from './composables/useStudents'
import { useModal, useToast } from 'vuestic-ui'

const doShowEditUserModal = ref(false)

const { users, isLoading, filters, sorting, pagination, ...usersApi } = useStudents()

const userToEdit = ref<Student | null>(null)

const showEditUserModal = (user: Student) => {
  console.log("🚀 ~ showEditUserModal ~ user:", user);
  userToEdit.value = user
  doShowEditUserModal.value = true
}

const showAddUserModal = () => {
  userToEdit.value = null
  doShowEditUserModal.value = true
}

const { init: notify } = useToast()

const onUserSaved = async (user: Student) => {
  const isEdit = Boolean(userToEdit.value);
  const apiMethod = isEdit ? usersApi.update : usersApi.add;
  const successMessage = `${user.name} has been ${isEdit ? 'updated' : 'added'}`;
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



const onUserDelete = async (user: Student) => {
  await usersApi.remove(user)
  notify({
    message: `${user.fullname} has been deleted`,
    color: 'success',
  })
}

const editFormRef = ref()

const { confirm } = useModal()

</script>

<template>
  <h1 class="page-title">Students</h1>

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
        <VaButton @click="showAddUserModal">Add Student</VaButton>
      </div>

      <StudentsTable
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
    <h1 class="va-h5">{{ userToEdit ? 'Edit Student' : 'Add Student' }}</h1>
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
