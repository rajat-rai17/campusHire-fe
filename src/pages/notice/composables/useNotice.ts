import { Ref, ref, unref, watch } from 'vue'
import axios from 'axios'
import { Pagination, Sorting } from '../../../data/pages/notice'
import { Notice } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'title', sortingOrder: null })
const makeFiltersRef = () => ref({ search: '' })

export const useNotice = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<{ search: string }>
}) => {
  const isLoading = ref(false)
  const notices = ref<Notice[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    try {
      const response = await axios.post('http://localhost:9321/notice/list', {
        ...unref(filters),
        pagination: unref(pagination),
      })
      const { data: apiData } = response.data

      if (apiData?.status) {
        notices.value = apiData.data
        pagination.value.total = apiData.totalRecords
      } else {
        console.error('Failed to fetch notices:', response.data.message)
      }
    } catch (error) {
      console.error(error)
    }
    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(filters, () => {
    pagination.value.page = 1
    fetch()
  }, { deep: true })

  fetch()

  return {
    isLoading,
    filters,
    sorting,
    pagination,
    notices,
    fetch,
    
    async add(notice: Notice) {
      isLoading.value = true
      await axios.post('http://localhost:9321/notice/create', notice)
      await fetch()
      isLoading.value = false
    },

    async update(notice: Notice) {
      isLoading.value = true
      await axios.post('http://localhost:9321/notice/update', notice)
      await fetch()
      isLoading.value = false
    },

    async remove(notice: Notice) {
      isLoading.value = true
      await axios.post('http://localhost:9321/notice/remove', { noticeId: notice.noticeId })
      await fetch()
      isLoading.value = false
    },
  }
}
