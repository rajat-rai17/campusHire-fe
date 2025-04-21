import { sleep } from '../../services/utils'
import { Notice } from '../../pages/notice/types'
import usersDb from './notice-db.json'
import axios from 'axios'

export const users = usersDb as unknown as Notice[]

// const getUserProjects = (userId: number | string) => {
//   return projectsDb
//     .filter((project) => project.team.includes(Number(userId)))
//     .map((project) => ({
//       ...project,
//       project_owner: users.find((user) => user.id === project.project_owner)!,
//       team: project.team.map((userId) => users.find((user) => user.id === userId)!),
//       status: project.status as Project['status'],
//     }))
// }

// Simulate API calls

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
  isActive: boolean
  search: string  
}

const getSortItem = (obj: any, sortBy: string) => {
  if (sortBy === 'projects') {
    return obj.projects.map((project: any) => project.project_name).join(', ')
  }

  return obj[sortBy]
}

export const getUsers = async (filters: Partial<Filters & Pagination & Sorting>) => {
  await sleep(1000)
  const {  search  } = filters
  let filteredUsers = users


  if (search) {
    filteredUsers = filteredUsers.filter((user) => user.programs.includes(search.toLowerCase()))
  }

  const { page = 1, perPage = 10 } = filters || {}
  return {
    data: filteredUsers.slice((page - 1) * perPage, page * perPage),
    pagination: {
      page,
      perPage,
      total: filteredUsers.length,
    },
  }
}

export const addNotice = async (notice: Notice) => {
  try {
    notice.noticeId = +notice.noticeId
    
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

export const masterData = async (dataRequired: any) => {
  try {
    const response = await axios.post('http://localhost:9321/notice/masterData', {
      dataRequired
    })
    return  response.data
  } catch (error) {
    console.error(error)
  }
  
}
