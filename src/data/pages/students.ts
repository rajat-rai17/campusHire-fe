import { sleep } from '../../services/utils'
import { Student } from '../../pages/students/types'
import usersDb from './students-db.json'
import axios from 'axios'

export const users = usersDb as unknown as Student[]

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
  sortBy: keyof Student | undefined
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
  const { search } = filters
  let filteredUsers = users

  if (search) {
    filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
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

export const addStudent = async (student: Student) => {
  try {
    const payload = { ...student, studentId: Number(student.studentId) }

    const response = await axios.post(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:9321'}/student/create`, payload)
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
  return false
}

export const updateStudent = async (student: Student) => {
  try {
    const payload = { ...student, studentId: Number(student.studentId) }

    const response = await axios.post(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:9321'}/student/update`, payload)
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
  return false
}

export const removeStudent = async (student: Student) => {
  const { studentId } = student
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:9321'}/student/remove`, {
      studentId: Number(studentId),
    })
    const { data: apiData } = response.data
    return apiData
  } catch (error) {
    console.error(error)
  }
}
