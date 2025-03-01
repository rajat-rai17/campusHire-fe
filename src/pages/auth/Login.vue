<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../services/authService'

const router = useRouter()
const formData = reactive({
  email: '',
  password: ''
})
const isLoading = ref(false)
const errorMessage = ref('')

const submit = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const { user } = await login(formData.email, formData.password)

    // ✅ Redirect based on role
    if (user.role === 'student') {
      router.push('../pages/StudentDashboard.vue') // ✅ Ensure this route exists in `router/index.ts`
    } else if (user.role === 'admin') {
      router.push('../pages/admin/dashboard/Dashboard.vue')
    } else {
      router.push('/') // Default fallback
    }
  } catch (error) {
    errorMessage.value = 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <p class="text-base mb-4 leading-5">
      New to CampusHire?
      <RouterLink :to="{ name: 'signup' }" class="font-semibold text-primary">Sign up</RouterLink>
    </p>
    <VaInput
      v-model="formData.email"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"

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
      
      <RouterLink :to="{ name: 'recover-password' }" class="mt-2 sm:mt-0 sm:ml-1 font-semibold text-primary">
        Forgot password?
      </RouterLink>
    </div>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

