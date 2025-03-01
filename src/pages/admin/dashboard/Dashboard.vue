<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, logout } from '../../../services/authService'
import axios from 'axios'

// Import Dashboard Components
import RevenueUpdates from './cards/RevenueReport.vue'
import ProjectTable from './cards/ProjectTable.vue'
import RevenueByLocationMap from './cards/RevenueByLocationMap.vue'
import DataSection from './DataSection.vue'
import YearlyBreakup from './cards/YearlyBreakup.vue'
import MonthlyEarnings from './cards/MonthlyEarnings.vue'
import RegionRevenue from './cards/RegionRevenue.vue'
import Timeline from './cards/Timeline.vue'

// Setup reactive variables
const router = useRouter()
const adminData = ref<any>(null)
const errorMessage = ref('')

// Function to fetch admin dashboard data
const fetchAdminDashboard = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:9321/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
    adminData.value = response.data
  } catch (error) {
    errorMessage.value = 'Failed to load dashboard data.'
  }
}

// Ensure only admins can access this page
onMounted(() => {
  const user = getUser()
  if (!user || user.role !== 'admin') {
    router.push('/')
  } else {
    fetchAdminDashboard()
  }
})

// Logout Function
const logoutUser = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <h1 class="page-title font-bold">Admin Dashboard</h1>

  <section v-if="adminData" class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row gap-4">
      <RevenueUpdates class="w-full sm:w-[70%]" />
      <div class="flex flex-col gap-4 w-full sm:w-[30%]">
        <YearlyBreakup class="h-full" />
        <MonthlyEarnings />
      </div>
    </div>
    <DataSection />
    <div class="flex flex-col md:flex-row gap-4">
      <RevenueByLocationMap class="w-full md:w-4/6" />
      <RegionRevenue class="w-full md:w-2/6" />
    </div>
    <div class="flex flex-col md:flex-row gap-4">
      <ProjectTable class="w-full md:w-1/2" />
      <Timeline class="w-full md:w-1/2" />
    </div>
  </section>

  <p v-else class="text-red-500 text-center">{{ errorMessage }}</p>

  <div class="flex justify-center mt-4">
    <button @click="logoutUser" class="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
  </div>
</template>
