<template>
    <div>
        <v-row class="pa-5">
            <v-col cols="4">
                <v-select density="compact" color="primary" label="Tema"
                             item-title="name" item-value="name" 
                            variant="outlined" :items="themesList" v-model="payloadSearch.theme"></v-select>
            </v-col>
            <v-col cols="6">
                <v-text-field density="compact" variant="outlined" label="Busqueda"
                v-model="payloadSearch.search" 
                        ></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn color="primary" @click="doSearch">Buscar</v-btn>
            </v-col>    
        </v-row>
    </div>
</template>
<script>
import emitter from '@/plugins/mitt';
import axios from 'axios';
import { onMounted, ref } from 'vue';
export default {
    setup() {
        const themesList = ref([])
        const payloadSearch = ref({
            theme: null,
            search: ''
        })

        const getThemes = async () => {
            try {
                const response = await axios.get("/themes")
                themesList.value = response.data

            } catch (error) {
                alert("Ha ocurrido un error al obtener los temas")
                console.log(error)
            }
        }

        const doSearch = async () => {
            console.log(payloadSearch.value)
            emitter.emit("searchContent", (payloadSearch.value.search ? payloadSearch.value.search : payloadSearch.value.theme))
        }

        onMounted(()=> {
            getThemes()
        })

        return {
            themesList,
            payloadSearch,
            doSearch
        }
    }
}
</script>
<style></style>