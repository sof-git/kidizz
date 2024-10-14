<script setup async lang="ts">
const props = defineProps<{
  message: string
  type: 'success' | 'info' | 'warning' | 'error' | undefined
  show: boolean
}>()
</script>

<template>
  <v-alert
    v-if="props.show"
    :type="props.type"
    :color="props.type"
    elevation="2"
    class="text-center text-h6"
  >
    {{ props.message }}
  </v-alert>
</template>

<style scoped></style>
