<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')
const authStore = useAuthStore()
const logout = () => {
  authStore.logout()
}
</script>

<template>
  <v-container class="pa-5" max-width="1200">
    <v-row>
      <v-col cols="12" offset-md="10" md="2">
        <v-btn class="text-white bg-primary" v-if="!isLoginPage" @click="logout">Logout</v-btn>
      </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col cols="12">
        <RouterView />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
