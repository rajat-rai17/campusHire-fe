import { Ref, ref, unref, watch } from 'vue'
import axios from 'axios'
import { getUsers, updateJob, addJob, type Filters, Pagination, Sorting, removeJob, masterData } from '../../../data/pages/jobs'
import { Job } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'title', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useJobs = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const users = ref<Job[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    let apiResultData = null
    let total = 0
    try {
      
      const response = await axios.post('http://localhost:9321/job/list', {
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
    const newPagination  = {
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

    async add(job: Job) {
      isLoading.value = true
      const result = await addJob(job)
      await fetch()
      isLoading.value = false
      return result
    },

    async update(job: Job) {
      isLoading.value = true
      const result = await updateJob(job)
      await fetch()
      isLoading.value = false
      return result
    },

    async remove(job: Job) {
      isLoading.value = true
      await removeJob(job)
      await fetch()
      isLoading.value = false
    },

    async masterData() {
      const result = await masterData(["programData","companyData"])
      return result
    },
  }
}
