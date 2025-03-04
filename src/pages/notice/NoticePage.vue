<script setup lang="ts">
import { ref } from 'vue'
import NoticeTable from './widgets/NoticeTable.vue'
import EditNoticeForm from './widgets/EditNoticeForm.vue'
import { Notice } from './types'
import { useNotice } from './composables/useNotice'
import { useToast } from 'vuestic-ui'

const { notices, isLoading, filters, sorting, pagination, ...noticeApi } = useNotice()
const showEditModal = ref(false)
const noticeToEdit = ref<Notice | null>(null)

const onNoticeSaved = async (notice: Notice) => {
  if (notice.noticeId) await noticeApi.update(notice)
  else await noticeApi.add(notice)
  showEditModal.value = false
}

const onNoticeDelete = async (notice: Notice) => {
  await noticeApi.remove(notice)
}
</script>

<template>
  <VaCard>
    <NoticeTable :notices="notices" :loading="isLoading" @edit-notice="noticeToEdit = $event; showEditModal = true" @delete-notice="onNoticeDelete" />
  </VaCard>

  <VaModal v-model="showEditModal">
    <EditNoticeForm :notice="noticeToEdit" @save="onNoticeSaved" @close="showEditModal = false" />
  </VaModal>
</template>
