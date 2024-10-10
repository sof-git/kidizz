<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>

  <v-container class="pa-5" max-width="1200">
    <v-row align="center" justify="center">
      <v-col cols="12" >
        <RouterView />
      </v-col>
    </v-row>

  </v-container>
</template>

<style scoped>
</style>
