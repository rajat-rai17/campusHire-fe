<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axiosInstance from '../../../services/axiosInstance'

const stats = ref([
  { title: 'Total Students', value: '...', icon: '🎓' },
  { title: 'Companies', value: '...', icon: '🏢' },
  { title: 'Active Jobs', value: '...', icon: '💼' },
  { title: 'Notices', value: '...', icon: '📢' },
])

const recentJobs = ref<any[]>([])
const latestNotices = ref<any[]>([])
const isLoading = ref(true)

const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const payload = { pagination: { page: 1, perPage: 5 } }

    // Fire all requests concurrently
    const [studentsRes, companiesRes, jobsRes, noticesRes] = await Promise.all([
      axiosInstance.post('/student/list', payload).catch(() => null),
      axiosInstance.post('/company/list', payload).catch(() => null),
      axiosInstance.post('/job/list', payload).catch(() => null),
      axiosInstance.post('/notice/list', payload).catch(() => null),
    ])

    // Helper to safely extract totalRecords and data from response structure
    const extractData = (res: any) => {
      const apiData = res?.data?.data
      if (apiData && apiData.status) {
        return { total: apiData.totalRecords || 0, list: apiData.data || [] }
      }
      return { total: 0, list: [] }
    }

    const students = extractData(studentsRes)
    const companies = extractData(companiesRes)
    const jobs = extractData(jobsRes)
    const notices = extractData(noticesRes)

    // Update stats
    stats.value[0].value = students.total.toString()
    stats.value[1].value = companies.total.toString()
    stats.value[2].value = jobs.total.toString()
    stats.value[3].value = notices.total.toString()

    // Update lists
    recentJobs.value = jobs.list.slice(0, 5)
    latestNotices.value = notices.list.slice(0, 5)
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Heading -->
    <div>
      <h1 class="text-3xl font-bold">CampusHire Dashboard</h1>
      <p class="text-gray-500">Manage students, companies, jobs and placements from one place.</p>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="item in stats" :key="item.title" class="bg-white rounded-xl shadow p-5 border">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-gray-500">{{ item.title }}</p>
            <h2 class="text-3xl font-bold mt-2">
              <span
                v-if="isLoading"
                class="inline-block w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              ></span>
              <span v-else>{{ item.value }}</span>
            </h2>
          </div>

          <div class="text-4xl">
            {{ item.icon }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Section -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Recent Jobs -->
      <div class="bg-white rounded-xl shadow border p-5">
        <h2 class="text-xl font-semibold mb-4">Recent Job Openings</h2>
        <div v-if="isLoading" class="flex justify-center p-4">
          <span
            class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></span>
        </div>
        <table v-else class="w-full">
          <thead class="border-b">
            <tr class="text-left">
              <th class="py-2">Company</th>
              <th>Role</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="job in recentJobs" :key="job.jobId" class="border-b last:border-none">
              <td class="py-3">{{ job.companyName || 'N/A' }}</td>
              <td>{{ job.title }}</td>
              <td>{{ job.location }}</td>
            </tr>
            <tr v-if="recentJobs.length === 0">
              <td colspan="3" class="py-4 text-center text-gray-500">No recent jobs found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Notices -->
      <div class="bg-white rounded-xl shadow border p-5">
        <h2 class="text-xl font-semibold mb-4">Latest Notices</h2>
        <div v-if="isLoading" class="flex justify-center p-4">
          <span
            class="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></span>
        </div>
        <ul v-else class="space-y-4">
          <li v-for="notice in latestNotices" :key="notice.noticeId" class="border-b pb-3 last:border-none last:pb-0">
            📢 {{ notice.title }}
          </li>
          <li v-if="latestNotices.length === 0" class="text-center text-gray-500">No notices found.</li>
        </ul>
      </div>
    </div>
  </div>
</template>
