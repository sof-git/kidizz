<script setup async lang="ts">
import { useChildCaresStore } from '@/stores/childCares'
import { onMounted } from 'vue'
const childCaresStore = useChildCaresStore()
const props = defineProps<{
  childCareId?: number
}>()
onMounted(() => {})

const exportChildren = async () => {
  const childCareId = props.childCareId

  // Check if childCareId is valid
  if (childCareId) {
    await childCaresStore.fetchChildsForExport(childCareId)
  } else {
    await childCaresStore.fetchChildsForExport()
    // Optionally handle the case when id is not provided
  }
}
</script>

<template>
  <div>
    <v-btn @click="exportChildren()">Export</v-btn>
  </div>
</template>

<style scoped></style>
