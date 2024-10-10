<script setup async lang="ts">
import { useChildCaresStore } from '@/stores/childCares';
import { ref, onMounted, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import type { IChild } from '@/types/child';


const route = useRoute();
const ChildCareName = route.params.name; // Assuming this is how you get the child care name
const children:Ref<IChild[]> = ref([]); // This will hold the fetched children data

const childCareStore = useChildCaresStore();

onMounted(async () => {
    const childCares = childCareStore.childCares;
    const foundChildCare = childCares.find(childCare => childCare.name === ChildCareName);
    if (foundChildCare) {   
        const fetchedChildren:any = await childCareStore.fetchChildsByChildCareId(foundChildCare.id);
        children.value = fetchedChildren; 
    } else {
        console.error(`ChildCare with name "${ChildCareName}" not found.`);
    }
});
const headers = [
    { text: 'firstname', value: 'firstname' },
    { text: 'lastname', value: 'lastname' },
    {key:"delete" ,title:"Supprimer", sortable:false},
]
const search = ref('');
const selected = ref([]);


const deleteChild = async(id:number) => {
    const response = await childCareStore.deleteChildren(id);
    if(response.status === 200){
        children.value = children.value.filter(child => child.id !== id);
    }
};

const addChild = (child: IChild) => {
  children.value.push(child);
};
</script>

<template>
    <main>
        <p class="text-h4 text-primary mt-10 " justify-center>{{ ChildCareName }}</p>
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
        <v-data-table
            class="elevation-1 rounded-lg bg-primary text-white"
            :headers="headers"
            :items="children"
            item-value="firstname"
            items-per-page="10"
            :search="search"
            v-model="selected"
            show-select
        >
        <!-- eslint-disable-next-line -->
        <template v-slot:item.delete="{ item }">
            <v-btn class="rounded-lg mt-2 text-red" @click="(event:Event) => { event.stopPropagation();deleteChild(item.id)}">Supprimer </v-btn>
        </template>
        </v-data-table>
        <childForm :ChildCareName="ChildCareName" @addChild="addChild"/>
    </section>
    </main>
</template>

<style scoped>
</style>