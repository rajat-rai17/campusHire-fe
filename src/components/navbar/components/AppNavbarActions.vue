<template>
  <div class="app-navbar-actions">
    <VaButton
      preset="secondary"
      color="textPrimary"
      class="app-navbar-actions__item flex-shrink-0 mx-0"
      @click="logout"
    >
      <VaIcon size="large" class="material-symbols-outlined mr-1">logout</VaIcon>
      {{ t('Logout') }}
    </VaButton>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

defineProps({
  isMobile: { type: Boolean, default: false },
})

const { t } = useI18n()
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/auth/login')
}
</script>

<style lang="scss">
.app-navbar-actions {
  display: flex;
  align-items: center;

  .va-dropdown__anchor {
    color: var(--va-primary);
    fill: var(--va-primary);
  }

  &__item {
    padding: 0;
    margin-left: 0.25rem;
    margin-right: 0.25rem;

    svg {
      height: 20px;
    }

    &--profile {
      display: flex;
      justify-content: center;
    }

    .va-dropdown-content {
      background-color: var(--va-white);
    }

    @media screen and (max-width: 640px) {
      margin-left: 0;
      margin-right: 0;

      &:first-of-type {
        margin-left: 0;
      }
    }
  }

  .fa-github {
    color: var(--va-on-background-primary);
  }
}
</style>
