import { Ref, ref, unref, watch } from 'vue'
import axios from 'axios'
import { getUsers, updateUser, addUser, removeUser, type Filters, Pagination, Sorting } from '../../../data/pages/students'
import { Student } from '../types'
import { watchIgnorable } from '@vueuse/core'

const makePaginationRef = () => ref<Pagination>({ page: 1, perPage: 10, total: 0 })
const makeSortingRef = () => ref<Sorting>({ sortBy: 'fullname', sortingOrder: null })
const makeFiltersRef = () => ref<Partial<Filters>>({ isActive: true, search: '' })

export const useStudents = (options?: {
  pagination?: Ref<Pagination>
  sorting?: Ref<Sorting>
  filters?: Ref<Partial<Filters>>
}) => {
  const isLoading = ref(false)
  const users = ref<Student[]>([])

  const { filters = makeFiltersRef(), sorting = makeSortingRef(), pagination = makePaginationRef() } = options || {}

  const fetch = async () => {
    isLoading.value = true
    let apiResultData = null
    try {
      
      const response = await axios.post('http://localhost:9321/student/list', {
        ...unref(filters),
        sorting: unref(sorting),
        pagination: unref(pagination),
      })
      const { data: apiData } = response.data
      if (apiData?.status) {
        apiResultData = apiData.data
      } else {
        console.error('Failed to fetch users:', response.data.message)
      }
    } catch (error) {
      console.error(error)
      isLoading.value = false
      return
      
    }
    const { data, pagination: newPagination } = await getUsers({
      ...unref(filters),
      ...unref(sorting),
      ...unref(pagination),
    })
    users.value = data

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

    async add(user: User) {
      isLoading.value = true
      await addUser(user)
      await fetch()
      isLoading.value = false
    },

    async update(user: User) {
      isLoading.value = true
      await updateUser(user)
      await fetch()
      isLoading.value = false
    },

    async remove(user: User) {
      isLoading.value = true
      await removeUser(user)
      await fetch()
      isLoading.value = false
    },
  }
}
