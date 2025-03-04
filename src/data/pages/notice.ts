import { sleep } from '../../services/utils'
import { Notice } from '../../pages/notice/types'
import noticesDb from './notice-db.json'
import axios from 'axios'

export const notices = noticesDb as unknown as Notice[]

export type Pagination = {
  page: number
  perPage: number
  total: number
}

export type Sorting = {
  sortBy: keyof Notice | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  search: string  
}


const getSortItem = (obj: any, sortBy: string) => obj[sortBy]


export const getNotices = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const { search } = filters
  let filteredNotices = notices

  if (search) {
    filteredNotices = filteredNotices.filter((notice) =>
      notice.title.toLowerCase().includes(search.toLowerCase())
    )
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredNotices.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredNotices.length,
    },
  }
}


export const addNotice = async (notice: Notice) => {
  try {
    const response = await axios.post('http://localhost:9321/notice/create', {
      ...notice
    })
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
  return false
}


export const updateNotice = async (notice: Notice) => {
  try {
    notice.noticeId = +notice.noticeId

    const response = await axios.post('http://localhost:9321/notice/update', {
      ...notice
    })
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
  return false
}


export const removeNotice = async (notice: Notice) => {
  const { noticeId } = notice
  try {
    notice.noticeId = +notice.noticeId
    const response = await axios.post('http://localhost:9321/notice/remove', {
      noticeId
    })
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
}
