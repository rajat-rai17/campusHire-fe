<template>
  <VaModal
    max-width="530px"
    :mobile-fullscreen="false"
    hide-default-actions
    model-value
    close-button
    @update:modelValue="emits('cancel')"
  >
    <h1 class="va-h5 mb-4">Upload Resume</h1>
    <VaForm ref="form" class="space-y-6" @submit.prevent="submit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VaInput label="Resume" required-mark>
          <template #default>
            <input type="file" accept="application/pdf" class="w-full" @change="onFileChange" />
          </template>
        </VaInput>

        <div class="hidden md:block" />
      </div>
      <div class="flex flex-col-reverse md:justify-end md:flex-row md:space-x-4">
        <VaButton :style="buttonStyles" preset="secondary" color="secondary" @click="emits('cancel')"> Cancel</VaButton>
        <VaButton :style="buttonStyles" class="mb-4 md:mb-0" type="submit" @click="submit"> Upload</VaButton>
      </div>
    </VaForm>
  </VaModal>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { reactive } from 'vue'
import { useForm, useToast } from 'vuestic-ui'

import { buttonStyles } from '../styles'
import axiosInstance from '../../../services/axiosInstance'
import axios from 'axios'
const formData = reactive({
  resume: '',
})

const { validate } = useForm('form')
const { init } = useToast()

const emits = defineEmits(['cancel'])

const selectedFile = ref<File | null>(null)

const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement)?.files?.[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    init({ message: 'Only PDF files are allowed', color: 'danger' })
    selectedFile.value = null
  }
}

const generateRandomFilename = (length = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `${result}.pdf`
}

const submit = async () => {
  if (!selectedFile.value) {
    init({ message: 'Please upload a valid PDF', color: 'danger' })
    return
  }

  const isValid = validate()
  if (!isValid) return

  const fileName = generateRandomFilename()
  const formData = new FormData()
  formData.append('file', selectedFile.value, fileName)

  try {
    // ✅ Upload the file to /uploads
    const response = await axiosInstance.post('student/uploadResume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (response.data?.data?.resumeFile) {
      const userRaw = localStorage.getItem('user')
      if (userRaw) {
        const user = JSON.parse(userRaw)
        user.resumeFile = response.data.data.resumeFile
        localStorage.setItem('user', JSON.stringify(user))
      }
    }

    init({ message: 'Resume uploaded successfully', color: 'success' })
    emits('cancel')
    setTimeout(() => { window.location.reload() }, 500)
  } catch (error) {
    console.error(error)
    init({ message: 'Failed to upload resume', color: 'danger' })
  }
}
</script>

<style lang="scss">
// TODO temporary before https://github.com/epicmaxco/vuestic-ui/issues/4020 fix
.va-modal__inner {
  min-width: 326px;
}
</style>
