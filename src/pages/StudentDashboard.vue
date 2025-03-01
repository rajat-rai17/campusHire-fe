<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout } from '../services/authService'
import axios from 'axios'

// Setup router & data
const router = useRouter()
const studentData = ref<any>(null)
const errorMessage = ref('')

// Function to fetch student dashboard data
const fetchStudentDashboard = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:9321/api/controllers/studentController.js', {
      headers: { Authorization: `Bearer ${token}` }
    })
    studentData.value = response.data
  } catch (error) {
    errorMessage.value = 'Failed to load student dashboard data.'
  }
}

// Ensure only students can access this page
onMounted(() => {
  const user = getUser()
  if (!user || user.role !== 'student') {
    router.push('/')
  } else {
    fetchStudentDashboard()
  }
})

// Logout Function
const logoutUser = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="page-title font-bold text-3xl mb-6">Student Dashboard</h1>

    <section v-if="studentData" class="grid gap-6">
      <div class="p-6 bg-white shadow-md rounded-lg">
        <h2 class="text-xl font-semibold">Welcome, {{ studentData.name }}!</h2>
        <p class="text-gray-600">Your latest courses and notifications:</p>
      </div>

      <div class="p-6 bg-white shadow-md rounded-lg">
        <h3 class="text-lg font-semibold mb-3">📚 Enrolled Courses</h3>
        <ul class="list-disc pl-5">
          <li v-for="course in studentData.courses" :key="course" class="text-gray-700">{{ course }}</li>
        </ul>
      </div>

      <div class="p-6 bg-white shadow-md rounded-lg">
        <h3 class="text-lg font-semibold mb-3">🔔 Notifications</h3>
        <ul class="list-disc pl-5">
          <li v-for="notification in studentData.notifications" :key="notification" class="text-gray-700">{{ notification }}</li>
        </ul>
      </div>
    </section>

    <p v-else class="text-red-500 text-center">{{ errorMessage }}</p>

    <div class="flex justify-center mt-6">
      <button @click="logoutUser" class="px-4 py-2 bg-red-500 text-white rounded-lg">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>
