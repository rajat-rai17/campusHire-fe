<template>
  <VaForm ref="resetForm" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Set New Password</h1>
    <p class="text-base mb-4 leading-5">Please enter your new password below.</p>

    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="newPassword"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="New Password"
        @clickAppendInner.stop="isPasswordVisible.value = !isPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <VaValue v-slot="isConfirmPasswordVisible" :default-value="false">
      <VaInput
        v-model="confirmPassword"
        :rules="confirmPasswordRules"
        :type="isConfirmPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Confirm New Password"
        @clickAppendInner.stop="isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value"
      >
        <template #appendInner>
          <VaIcon
            :name="isConfirmPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'"
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <VaButton class="w-full mb-2" @click="submit">Reset password</VaButton>
  </VaForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useRouter, useRoute } from 'vue-router'
import axiosInstance from '../../services/axiosInstance'

const newPassword = ref('')
const confirmPassword = ref('')
const form = useForm('resetForm')
const router = useRouter()
const route = useRoute()
const { init: notify } = useToast()

const passwordRules = [
  (v: string) => !!v || 'Password field is required',
  (v: string) => v.length >= 6 || 'Password must be at least 6 characters',
]

const confirmPasswordRules = [
  (v: string) => !!v || 'Confirm password field is required',
  (v: string) => v === newPassword.value || 'Passwords do not match',
]

const submit = async () => {
  if (form.validate()) {
    const token = route.query.token as string

    if (!token) {
      notify({ message: 'Invalid or missing reset token', color: 'danger' })
      return
    }

    try {
      const response = await axiosInstance.post('/auth/resetPassword', {
        token,
        newPassword: newPassword.value,
      })

      const { statusCode, message } = response.data
      if (statusCode === 200) {
        notify({
          message: message || 'Password has been reset successfully',
          color: 'success',
        })
        router.push({ name: 'login' })
      } else {
        notify({
          message: message || 'Failed to reset password',
          color: 'danger',
        })
      }
    } catch (error: any) {
      notify({
        message: error.response?.data?.message || error.message || 'An unexpected error occurred',
        color: 'danger',
      })
    }
  }
}
</script>
