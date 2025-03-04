<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { Notice } from '../types'
import { PropType, computed, toRef } from 'vue'
import { Pagination, Sorting } from '../../../data/pages/company'
import { useVModel } from '@vueuse/core'

const columns = defineVaDataTableColumns([
  { label: 'ID', key: 'noticeId' },
  { label: 'Title', key: 'title' },
  { label: 'Program', key: 'program' },
  { label: 'Attachment', key: 'attachment' },
  { label: 'Actions', key: 'actions', align: 'right' },
])

const props = defineProps({
  notices: {
    type: Array as PropType<Notice[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const emit = defineEmits<{
  (event: 'edit-notice', notice: Notice): void
  (event: 'delete-notice', notice: Notice): void
}>()

const notices = toRef(props, 'notices')
const sortByVModel = useVModel(props, 'sortBy', emit)
const sortingOrderVModel = useVModel(props, 'sortingOrder', emit)

const totalPages = computed(() => Math.ceil(props.pagination.total / props.pagination.perPage))
const { confirm } = useModal()

const onNoticeDelete = async (notice: Notice) => {
  const agreed = await confirm({
    title: 'Delete Notice',
    message: `Are you sure you want to delete "${notice.title}"?`,
    okText: 'Delete',
    cancelText: 'Cancel',
  })

  if (agreed) {
    emit('delete-notice', notice)
  }
}
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="notices"
    :loading="loading"
  >
    <template #cell(attachment)="{ rowData }">
      <a :href="rowData.attachment" target="_blank" class="text-blue-500 underline">View</a>
    </template>

    <template #cell(actions)="{ rowData }">
      <VaButton preset="primary" icon="mso-edit" @click="$emit('edit-notice', rowData)" />
      <VaButton preset="danger" icon="mso-delete" @click="onNoticeDelete(rowData)" />
    </template>
  </VaDataTable>
</template>
