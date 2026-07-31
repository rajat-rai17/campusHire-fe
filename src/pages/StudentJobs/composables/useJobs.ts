import { Ref, ref, unref, watch } from 'vue'
import axios from 'axios'
import {
  getUsers,
  updateJob,
  addJob,
  type Filters,
  Pagination,
  Sorting,
  removeJob,
  masterData,
  applyJob,
} from '../../../data/pages/jobs'
import { Job } from '../types'
import { watchIgnorable } from '@vueuse/core'
import axiosInstance from '../../../services/axiosInstance'

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

  const fetch = async (isApplied = false) => {
    isLoading.value = true
    let apiResultData = null
    let total = 0

    //   const { jobId } = job
    // try {
    //   job.jobId = +job.jobId
    //   const response = await axiosInstance.post('job/applyJob', {
    //   jobId
    //   })
    //   const { data: apiData } = response.data
    //   return apiData
    // } catch (error) {
    //   console.error(error)
    // }

    try {
      const response = await axiosInstance.post('job/studentListJob', {
        ...unref(filters),
        pagination: unref(pagination),
        ...(isApplied && { isApplied }),
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

    async applyJob(job: Job) {
      const isApplied = true
      isLoading.value = true
      await applyJob(job)
      await fetch(isApplied)
      isLoading.value = false
    },

    async masterData() {
      const result = await masterData(['programData', 'companyData'])
      return result
    },
  }
}
