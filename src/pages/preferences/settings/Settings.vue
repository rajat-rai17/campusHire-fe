<template>
  <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-full md:w-[200px]">Name</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ userName }}
      </div>
    </div>
  </div>
  <VaDivider />
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5">
    <p class="font-bold w-full md:w-[200px]">Email</p>
    <div class="flex-1">
      <div class="max-w-[748px]">
        {{ email }}
      </div>
    </div>
  </div>
  <VaDivider />
  <div class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 min-h-[36px] leading-5 items-center">
    <p class="font-bold w-full md:w-[200px]">Resume</p>
    <div class="flex-1 flex items-center space-x-4">
      <span v-if="user?.resumeFile" class="text-green-600 font-semibold text-sm">
        <VaIcon name="mso-check_circle" class="mr-1" size="small" />
        {{ user.resumeFile }}
      </span>
      <span v-else class="text-gray-500 text-sm">No resume uploaded</span>
      
      <VaButton :style="buttonStyles" class="mb-4 md:mb-0" preset="secondary" color="primary" @click="downloadResume" :disabled="!user?.resumeFile">
        Download Resume
      </VaButton>
      <VaButton :style="buttonStyles" class="w-fit h-fit" preset="primary" @click="emits('openResetPasswordModal')">
        Upload Resume
      </VaButton>
    </div>
  </div>
  <VaDivider />
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { ref } from 'vue'

import { useToast } from 'vuestic-ui/web-components'

import { useUserStore } from '../../../stores/user-store'

import { buttonStyles } from '../styles'
import axiosInstance from '../../../services/axiosInstance'

const store = useUserStore()

const { init } = useToast()

const toastMessage = computed(() => (store.is2FAEnabled ? '2FA successfully enabled' : '2FA successfully disabled'))

const twoFA = computed(() => {
  if (store.is2FAEnabled) {
    return {
      color: 'danger',
      button: 'Disable 2FA',
      content:
        'Two-Factor Authentication (2FA) is now enabled for your account, adding an extra layer of security to your sign-ins.',
    }
  } else {
    return {
      color: 'primary',
      button: 'Set up 2FA',
      content:
        'Add an extra layer of security to your account. To sign in, you’ll need to provide a code along with your username and password.',
    }
  }
})

const toggle2FA = () => {
  store.toggle2FA()
  init({ message: toastMessage.value, color: 'success' })
}
const downloadResume = async () => {
  try {
    const response = await axiosInstance.get('student/getResume', {
      responseType: 'blob', // Important to get binary data
    })

    const blob = new Blob([response.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'resume.pdf'
    link.click()
    window.URL.revokeObjectURL(link.href)
  } catch (err) {
    console.error('Failed to download resume:', err)
    init({ message: 'Failed to download resume', color: 'danger' })
  }
}

const userRaw = localStorage.getItem('user')
const user = userRaw ? JSON.parse(userRaw) : null
const userName = ref(user?.name || 'Guest')
const email = ref(user?.email || 'Guest')
const emits = defineEmits(['openNameModal', 'openResetPasswordModal'])
</script>
