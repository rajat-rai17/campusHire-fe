<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <VaInput
      v-model="formData.email"
      :rules="[validators.required, validators.email]"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
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

    <div class="auth-layout__options flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <RouterLink
        :to="{ name: 'recover-password' }"
        class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-blue-600 hover:text-blue-700"
      >
        Forgot password?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useToast } from 'vuestic-ui'
import { validators } from '../../services/utils'
import axios from 'axios'

const { validate } = useForm('form')
const { push } = useRouter()
const { init } = useToast()

const formData = reactive({
  email: '',
  password: '',
  keepLoggedIn: false,
})

const submit = async () => {
  if (validate()) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL || 'http://localhost:9321'}/auth/verifyUser`, {
        email: formData.email,
        password: formData.password,
      })
      const { data: apiData } = response?.data || {}
      if (apiData.status) {
        localStorage.setItem('token', apiData.token)
        localStorage.setItem('user', JSON.stringify(apiData.userData))
        init({ message: "You've successfully logged in", color: 'success' })
        push({ name: 'dashboard' })
      } else init({ message: 'Invalid Email Id & Password', color: 'danger' })
    } catch (error) {
      console.error(error)
      init({ message: 'Invalid Email Id & Password', color: 'danger' })
    }
  }
}
</script>
