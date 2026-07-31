<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Company, UserRole } from '../types'
import UserAvatar from './UserAvatar.vue'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/company'
import { useVModel } from '@vueuse/core'
import { Project } from '../../projects/types'

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'companyId' },
  { label: 'Company Name', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Mobile Number', key: 'mobileNo' },
  { label: 'Sector', key: 'sector' },
  { label: ' ', key: 'actions', align: 'right' },
])

const props = defineProps({
  users: {
    type: Array as PropType<Company[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-user', user: Company): void
  (event: 'delete-user', user: Company): void
  (event: 'update:sortBy', sortBy: Sorting['sortBy']): void
  (event: 'update:sortingOrder', sortingOrder: Sorting['sortingOrder']): void
}>()

const users = toRef(props, 'users')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const roleColors: Record<UserRole, string> = {
  admin: 'danger',
  user: 'background-element',
  owner: 'warning',
}

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
console.log('🚀 ~ props.pagination.total:', props.pagination)
const { confirm } = useModal()

const onUserDelete = async (Company: Company) => {
  const agreed = await confirm({
    title: 'Delete Company',
    message: `Are you sure you want to delete ${Company.name}?`,
    okText: 'Delete',
    cancelText: 'Cancel',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-user', Company)
  }
}
</script>

<template>
  <div class="overflow-x-auto overflow-y-hidden w-full">
    <VaDataTable
      v-model:sort-by="sortByVModel"
      v-model:sorting-order="sortingOrderVModel"
      :columns="columns"
      :items="users"
      :loading="$props.loading"
    >
      <template #cell(companyId)="{ rowData }">
        <div class="flex items-center gap-2 max-w-[230px] ellipsis">
          {{ rowData.companyId }}
        </div>
      </template>

      <template #cell(name)="{ rowData }">
        <div class="max-w-[120px] ellipsis">
          {{ rowData.name }}
        </div>
      </template>

      <template #cell(email)="{ rowData }">
        <div class="ellipsis max-w-[230px]">
          {{ rowData.email }}
        </div>
      </template>

      <template #cell(mobileNo)="{ rowData }">
        <div class="ellipsis max-w-[230px]">
          {{ rowData.mobileNo }}
        </div>
      </template>
      <template #cell(sector)="{ rowData }">
        <div class="ellipsis max-w-[230px]">
          {{ rowData.sector }}
        </div>
      </template>

      <template #cell(actions)="{ rowData }">
        <div class="flex gap-2 justify-end">
          <VaButton
            preset="primary"
            size="small"
            icon="mso-edit"
            aria-label="Edit user"
            @click="$emit('edit-user', rowData as Company)"
          />
          <VaButton
            preset="primary"
            size="small"
            icon="mso-delete"
            color="danger"
            aria-label="Delete user"
            @click="onUserDelete(rowData as Company)"
          />
        </div>
      </template>
    </VaDataTable>
  </div>

  <div class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2">
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect v-model="$props.pagination.perPage" class="!w-20" :options="[10, 50, 100]" />
    </div>

    <div v-if="totalPages > 0" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
