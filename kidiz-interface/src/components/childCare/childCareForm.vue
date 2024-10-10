<script setup async lang="ts">
import { ref, type Ref } from 'vue';
import { useChildCaresStore } from '@/stores/childCares/index';

const childCareStore = useChildCaresStore();
const name:Ref<string> = ref('');
const response:Ref<string> = ref('');
console.log(childCareStore.addChildCare);
const submit = async () => {
  if (name.value === '') {
    return;
  }

  // Call the store function and update response
  try {
    const res = await childCareStore.addChildCare({name: name.value});
    console.log(res);
    if (res) {
      name.value = '';
      response.value = res.message;
    }
  } catch (error) {
    console.error('Error adding child care:', error);
    response.value = 'An error occurred. Please try again.';
  }
};

</script>

<template>
    <div>
        <p class="text-h4 text-primary mt-10">Add a child care</p>
        <v-form @submit.prevent="submit">
            <v-text-field
                v-model="name"
                label="Name"
                width="25%"
                outlined
                dense
                clearable
                placeholder="Name"
            >
            </v-text-field>
            <v-btn class="rounded-lg bg-primary" type="submit">Ajouter</v-btn>
        </v-form>
            <div>{{ response }}</div>
    </div>
</template>

<style scoped>
</style>