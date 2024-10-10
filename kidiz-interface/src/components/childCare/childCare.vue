<script setup async lang="ts">
import {reactive, ref } from "vue";
import type { IChild } from "@/types/child";
import { useRoute } from "vue-router";
import childForm from '@/components/childCare/childForm.vue';
import { useChildCaresStore } from "@/stores/childCares";

const childCareStore = useChildCaresStore();
const props = defineProps<{ children: IChild[] }>();
const children = reactive<IChild[]>(props.children);
const route = useRoute();
const ChildCareName = Array.isArray(route.params.name) ? route.params.name[0] : route.params.name;






const headers = [
    { text: 'firstname', value: 'firstname' },
    { text: 'lastname', value: 'lastname' },
    {key:"delete" ,title:"Supprimer", sortable:false},
]
const search = ref('');
const selected = ref([]);


const deleteChild = async(id:number) => {
    const response = await childCareStore.deleteChildren(id);
};

const addChild = (child: IChild) => {
  children.push(child);
};

const exportChildren = () => {
    //const response = await childCareStore.exportChildren();
};

</script>

<template>
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
        <v-btn @click="exportChildren">Export</v-btn>
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
</template>

<style scoped>
</style>