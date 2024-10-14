<script setup async lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { IChildCare } from '@/types/childCare'
import { useChildCaresStore } from '@/stores/childCares/index'
import ChildCareForm from '@/components/childCare/childCareForm.vue'
import Export from '@/components/export/export.vue'
import Alert from '../common/alert.vue'
const childCareStore = useChildCaresStore()

const router = useRouter()
const childCares: Ref<IChildCare[]> = ref([])
onMounted(async () => {
  childCares.value = await childCareStore.fetchAllChildCares()
})

const alertType: Ref<'success' | 'info' | 'warning' | 'error' | undefined> = ref(undefined)
const alertMessage: Ref<string> = ref('')

const search = ref('')
const headers = [
  {
    key: 'name',
    sortable: true,
    title: 'Nom'
  },
  { key: 'delete', title: 'Supprimer', sortable: false }
]

const handleRowClick = (event: Event, { item }: any) => {
  const name = item.name
  router.push({ name: 'ChildCare', params: { name } })
}

const deleteChildCare = async (id: number) => {
  try {
    const response = await childCareStore.deleteChildCare(id)
    if (response.status === 200) {
      childCares.value = childCares.value.filter((childCare) => childCare.id !== id)
      alertType.value = 'success'
      alertMessage.value = 'Child care deleted successfully'
    }
  } catch (error: any) {
    alertType.value = 'error'
    alertMessage.value = error.message
  }
}
</script>

<template>
  <section>
    <v-divider></v-divider>
    <v-text-field
      v-model="search"
      label="Search"
      width="25%"
      outlined
      dense
      clearable
      placeholder="Search for a child care"
    >
    </v-text-field>
    <Export />
    <v-divider></v-divider>
    <v-data-table
      class="elevation-1 rounded-lg bg-primary text-white"
      :headers="headers"
      :items="childCares"
      item-value="name"
      items-per-page="10"
      :search="search"
      @click:row="handleRowClick"
    >
      <!-- eslint-disable-next-line -->
      <template v-slot:item.delete="{ item }">
        <v-btn
          class="rounded-lg mt-2 text-red"
          @click="
            (event: Event) => {
              event.stopPropagation()
              deleteChildCare(item.id)
            }
          "
          >Supprimer
        </v-btn>
      </template>
    </v-data-table>
    <ChildCareForm />
    <Alert :message="alertMessage" :type="alertType" :show="!!alertMessage" />
  </section>
</template>

<style scoped></style>
