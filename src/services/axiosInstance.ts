import axios from 'axios'

// Create an instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:9321',
})

// Request Interceptor to attach token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default axiosInstance
