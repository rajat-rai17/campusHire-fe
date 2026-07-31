import { Ref, ref, unref, watch } from 'vue'
import axios from 'axios'
import {
  getUsers,
  updateNotice,
  addNotice,
  type Filters,
  Pagination,
  Sorting,
  removeNotice,
  masterData,
} from '../../../data/pages/studentNotice'
import { StudentNotice } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'programs', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useNotice = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const users = ref<StudentNotice[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    let apiResultData = null
    let total = 0
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:9321'}/notice/studentNoticeList`, {
        ...unref(filters),
        pagination: unref(pagination),
      })
      const { data: apiData } = response.data

      if (apiData?.status) {
        apiResultData = apiData.data
        total = apiData.totalRecords
      } else {
        console.error('Failed to fetch users:', response.data.message)
      }
    } catch (error) {
      console.error(error)
      isLoading.value = false
      return
    }
    // const { data, pagination: newPagination } = await getUsers({
    //   ...unref(filters),
    //   ...unref(sorting),
    //   ...unref(pagination),
    // })
    const oldPagination = unref(pagination)
    const newPagination = {
      page: oldPagination.page,
      perPage: oldPagination.perPage,
      total,
    }
    users.value = apiResultData

    ignoreUpdates(() => {
      pagination.value = newPagination
    })

    isLoading.value = false
  }

  const { ignoreUpdates } = watchIgnorable([pagination, sorting], fetch, { deep: true })

  watch(
    filters,
    () => {
      // Reset pagination to first page when filters changed
      pagination.value.page = 1
      fetch()
    },
    { deep: true },
  )

  fetch()

  return {
    isLoading,
    filters,
    sorting,
    pagination,
    users,

    fetch,

    async add(notice: StudentNotice) {
      isLoading.value = true
      const result = await addNotice(notice)
      await fetch()
      isLoading.value = false
      return result
    },

    async update(notice: StudentNotice) {
      isLoading.value = true
      const result = await updateNotice(notice)
      await fetch()
      isLoading.value = false
      return result
    },

    async remove(notice: StudentNotice) {
      isLoading.value = true
      await removeNotice(notice)
      await fetch()
      isLoading.value = false
    },

    async masterData() {
      const result = await masterData(['programData'])
      return result
    },
  }
}
