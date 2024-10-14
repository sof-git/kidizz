<script setup async lang="ts">
import { useChildCaresStore } from '@/stores/childCares'
import { ref, onMounted, type Ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import type { IChild } from '@/types/child'
import childForm from '@/components/childCare/childForm.vue'
import Export from '@/components/export/export.vue'
import Alert from '@/components/common/alert.vue'
const route = useRoute()
const ChildCareName = route.params.name
const childCareNameString = computed(() => {
  return Array.isArray(ChildCareName) ? ChildCareName[0] : ChildCareName // Take the first value if it's an array
})
const children: Ref<IChild[]> = ref([]) // This will hold the fetched children data

const childCareStore = useChildCaresStore()
const childCareId: Ref<number> = ref(0)
onMounted(async () => {
  const childCares = childCareStore.childCares
  const foundChildCare = childCares.find((childCare) => childCare.name === ChildCareName)
  if (foundChildCare) {
    childCareId.value = foundChildCare.id
    const fetchedChildren: any = await childCareStore.fetchChildsByChildCareId(foundChildCare.id)
    children.value = fetchedChildren
  } else {
    console.error(`ChildCare with name "${ChildCareName}" not found.`)
  }
})
const headers = [
  { text: 'firstname', value: 'firstname' },
  { text: 'lastname', value: 'lastname' },
  { key: 'delete', title: 'Supprimer', sortable: false }
]
const search = ref('')
const selected = ref([])

const alertType: Ref<'success' | 'info' | 'warning' | 'error' | undefined> = ref(undefined)
const alertMessage: Ref<string> = ref('')

const removeChild = async (childId: number) => {
  try {
    const response = await childCareStore.removeChild(childId, childCareId.value)
    if (response.status === 200) {
      children.value = children.value.filter((child) => child.id !== childId)
    }
  } catch (error: any) {
    alertType.value = 'error'
    alertMessage.value = error.message
  }
}

const addChild = (child: IChild) => {
  if (child) {
    children.value.push(child)
    children.value = [...children.value]
    alertMessage.value = 'Child added successfully'
    alertType.value = 'success'
  }
}
</script>

<template>
  <main>
    <v-container>
      <v-row justify="center">
        <v-col cols="10" md="2">
          <p class="text-h4 text-primary mt-10 mb-5" t justify-center>{{ ChildCareName }}</p>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="12">
          <section>
            <v-text-field
              v-model="search"
              label="Search"
              width="25%"
              outlined
              dense
              clearable
              placeholder="Search for a child"
            >
            </v-text-field>
            <Export :childCareId="childCareId" :headers="headers" />
            <v-data-table
              class="elevation-1 rounded-lg bg-primary text-white"
              :headers="headers"
              :items="children"
              item-value="firstname"
              items-per-page="10"
              :search="search"
              v-model="selected"
            >
              <!-- eslint-disable-next-line -->
              <template v-slot:item.delete="{ item }">
                <v-btn
                  class="rounded-lg mt-2 text-red"
                  @click="
                    (event: Event) => {
                      event.stopPropagation()
                      removeChild(item.id)
                    }
                  "
                  >Supprimer
                </v-btn>
              </template>
            </v-data-table>
            <childForm :ChildCareName="childCareNameString" @addChild="addChild" />
            <Alert :message="alertMessage" :type="alertType" :show="!!alertMessage" />
          </section>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<style scoped></style>
