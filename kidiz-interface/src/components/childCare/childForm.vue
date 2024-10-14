<script setup async lang="ts">
const emit = defineEmits(['addChild'])
import { reactive, ref, type Ref } from 'vue'
import { childSchema } from '@/plugins/joi'
import { useChildCaresStore } from '@/stores/childCares'
import Alert from '../common/alert.vue'
const childCareStore = useChildCaresStore()
const childCareName = defineProps<{ ChildCareName: string }>()

const child = reactive({
  lastname: '',
  firstname: '',
  childCareId: 0
})
const alertMessage: Ref<string> = ref('')
const alertType: Ref<'success' | 'info' | 'warning' | 'error' | undefined> = ref(undefined)

const submit = async () => {
  const { error } = childSchema.validate(child)
  if (error) {
    alertMessage.value = error.message
    alertType.value = 'error'
    return
  } else {
    const childCare = childCareStore.childCares.find(
      (childCare) => childCare.name === childCareName.ChildCareName
    )
    if (!childCare) {
      console.error(`ChildCare with name "${childCareName.ChildCareName}" not found.`)
      alertMessage.value = `ChildCare with name "${childCareName.ChildCareName}" not found.`
      alertType.value = 'error'
      return
    } else {
      child.childCareId = childCare.id
      const response = await childCareStore.addChildren(child)
      if (response.status === 201) {
        const childAdded = {
          id: response.data.id,
          lastname: response.data.lastname,
          firstname: response.data.firstname,
          childCareId: response.data.childCareId
        }
        emit('addChild', childAdded)
        child.lastname = ''
        child.firstname = ''
      }
    }
  }
}
</script>

<template>
  <div>
    <p class="text-h4 text-primary mt-10">Add a child</p>
    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="child.lastname"
        label="Lastname"
        width="25%"
        outlined
        dense
        clearable
        placeholder="Name"
      >
      </v-text-field>
      <v-text-field
        v-model="child.firstname"
        label="Firstname"
        width="25%"
        outlined
        dense
        clearable
        placeholder="Name"
      >
      </v-text-field>
      <v-btn class="rounded-lg bg-primary" type="submit">Ajouter</v-btn>
    </v-form>
    <Alert :message="alertMessage" :type="alertType" :show="!!alertMessage" />
  </div>
</template>

<style scoped></style>
