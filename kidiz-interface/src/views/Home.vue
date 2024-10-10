<script setup async lang="ts">
import ChildCaresTable from '@/components/childCare/childCaresTable.vue';
</script>

<template>
    <main>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="2">
                    <div class="text-h2">Kidizz</div>
                </v-col>
            </v-row>
            <v-row justify="center">
                <v-col cols="12">
                    <ChildCaresTable />
                </v-col>
            </v-row>
        </v-container>
    </main>
</template>

<style scoped>
</style>