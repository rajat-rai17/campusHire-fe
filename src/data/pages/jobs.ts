import { sleep } from '../../services/utils'
import { Job } from '../../pages/jobs/types'
import usersDb from './jobs-db.json'
import axios from 'axios'
import axiosInstance from '../../services/axiosInstance'

export const users = usersDb as unknown as Job[]

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
  sortBy: keyof Job | undefined
  sortingOrder: 'asc' | 'desc' | null
}

export type Filters = {
  isActive: boolean,
  isApplied: boolean,
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
    filteredUsers = filteredUsers.filter((user) => user.title.toLowerCase().includes(search.toLowerCase()))
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

export const addJob = async (job: Job) => {
  try {
    job.jobId = +job.jobId 
    const response = await axios.post('http://localhost:9321/job/create', {
      ...job
    })
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
  return false
}

export const updateJob = async (job: Job) => {
  try {
    job.jobId = +job.jobId
    
    const response = await axios.post('http://localhost:9321/job/update', {
      ...job
    })
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
  return false


}

export const removeJob = async (job: Job) => {
  const { jobId } = job
  try {
    job.jobId = +job.jobId
    const response = await axios.post('http://localhost:9321/job/remove', {
      jobId
    })
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
  
}

export const masterData = async (dataRequired: any) => {
  try {
    const response = await axios.post('http://localhost:9321/job/masterData', {
      dataRequired
    })
    return  response.data
  } catch (error) {
    console.error(error)
  }
  
}


export const applyJob = async (job: Job) => {
  const { jobId } = job
  try {
    job.jobId = +job.jobId
    const response = await axiosInstance.post('job/applyJob', {
    jobId
    })
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
  
}
