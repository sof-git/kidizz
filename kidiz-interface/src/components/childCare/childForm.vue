<script setup async lang="ts">
const emit = defineEmits(['addChild']);
import { reactive, ref, type Ref} from 'vue';
import { childSchema } from '@/plugins/joi';
import { useChildCaresStore } from '@/stores/childCares';
const childCareStore = useChildCaresStore();
const childCareName = defineProps<{ ChildCareName: string }>();


const child = reactive({
    lastname:"",
    firstname:"",
    childCareId:0
})
const message:Ref<string> = ref('');

const submit = async () => {
    const { error } = childSchema.validate(child);
    if (error) {
        message.value = error.message;
        return;
    } else {
        const childCare = childCareStore.childCares.find(childCare => childCare.name === childCareName.ChildCareName);
        if(!childCare){
            console.error(`ChildCare with name "${childCareName.ChildCareName}" not found.`);
            return;
        } else {
            child.childCareId = childCare.id;
            const response = await childCareStore.addChildren(child);
            if(response.status === 201 || response.status === 200){
                child.lastname = '';
                child.firstname = '';
                message.value = 'Child added successfully';
                emit('addChild', child);           
            }


        }
    }
};

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
                placeholder="Name">
            </v-text-field>
            <v-text-field
                v-model="child.firstname"
                label="Firstname"
                width="25%"
                outlined
                dense
                clearable
                placeholder="Name">
            </v-text-field>
            <v-btn class="rounded-lg bg-primary" type="submit">Ajouter</v-btn>
            <p>{{ message }}</p>
        </v-form>
    </div>
</template>

<style scoped>
</style>