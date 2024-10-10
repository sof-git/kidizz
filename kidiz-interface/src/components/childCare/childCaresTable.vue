<script setup async lang="ts">
import { onMounted, ref, type Ref} from 'vue';
import { useRouter } from 'vue-router';
import type { IChildCare } from '@/types/childCare';
import { useChildCaresStore } from '@/stores/childCares/index';
import ChildCareForm from '@/components/childCare/childCareForm.vue';
const childCareStore = useChildCaresStore();

const router = useRouter();
const childCares:Ref<IChildCare[]> = ref([]);
onMounted(async() => {
    childCares.value = await childCareStore.fetchAllChildCares();
});



const search = ref('');
const headers = [
    {            
        key: 'name',
        sortable: true,
        title: 'Nom',
    },
    {key:"delete" ,title:"Supprimer", sortable:false},

]

const handleRowClick = (event:Event,{item}:any) => {
  const name = item.name
  router.push({ name: 'ChildCare', params: { name } })
};

const deleteChildCare = async(id:number) => {
    const response = await childCareStore.deleteChildCare(id);
};

const exportChildrens = () => {
    //const response = await childCareStore.exportChildrens();
};

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
        <v-btn @click="exportChildrens">Export</v-btn>
        <v-divider></v-divider>
        <v-data-table
        class="elevation-1 rounded-lg bg-primary text-white"
        :headers="headers"
        :items="childCares"
        item-value="name"
        items-per-page="10"
        :search="search"
        show-select
        @click:row="handleRowClick"
        >
        <!-- eslint-disable-next-line -->
        <template v-slot:item.delete="{ item }">
            <v-btn class="rounded-lg mt-2 text-red" @click="(event:Event) => { event.stopPropagation();deleteChildCare(item.id)}">Supprimer </v-btn>
        </template>
        </v-data-table>
        
        <ChildCareForm />
        
    </section>
</template>

<style scoped>
</style>