<template>
  <VaForm ref="passwordForm" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Forgot your password?</h1>
    <p class="text-base mb-4 leading-5">
      If you've forgotten your password, don't worry. Simply enter your email address below, and we'll send you an email
      with a temporary password. Restoring access to your account has never been easier.
    </p>
    <VaInput
      v-model="email"
      :rules="emailRules"
      class="mb-4"
      label="Enter your email"
      type="email"
    />
    <VaButton class="w-full mb-2" @click="submit">Send reset link</VaButton>
    <VaButton :to="{ name: 'login' }" class="w-full" preset="secondary" @click="submit">Go back</VaButton>
  </VaForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useForm, useToast } from 'vuestic-ui'
import { useRouter } from 'vue-router'
import axiosInstance from '../../services/axiosInstance'

const email = ref('')
const emailRules = [(v: string) => !!v || 'Email field is required']
const form = useForm('passwordForm')
const router = useRouter()
const { init: notify } = useToast()

const submit = async () => {
  if (form.validate()) {
    try {
      const response = await axiosInstance.post('/auth/forgotPassword', {
        email: email.value
      });
      
      const { statusCode, message } = response.data;
      if (statusCode === 200) {
        notify({
          message: message || `Reset link has been sent to ${email.value}`,
          color: 'success',
          duration: 10000,
        });
        router.push({ name: 'recover-password-email' })
      } else {
        notify({
          message: message || 'Failed to reset password',
          color: 'danger',
        })
      }
    } catch (error) {
      notify({
        message: (error as Error)?.message || 'An unexpected error occurred',
        color: 'danger',
      })
    }
  }
}
</script>
