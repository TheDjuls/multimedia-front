<template>
    <div>
        <v-row class="pa-5">
            <v-col cols="4">
                <v-select density="compact" color="primary" label="Tema"
                             item-title="name" item-value="name" 
                            variant="outlined" :items="themesList"></v-select>
            </v-col>
            <v-col cols="6">
                <v-text-field density="compact" variant="outlined" label="Busqueda" 
                        ></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn color="primary">Buscar</v-btn>
            </v-col>    
        </v-row>
    </div>
</template>
<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';
export default {
    setup() {
        const themesList = ref([])

        const getThemes = async () => {
            try {
                const response = await axios.get("/themes")
                themesList.value = response.data

            } catch (error) {
                alert("Ha ocurrido un error al obtener los temas")
                console.log(error)
            }
        }

        onMounted(()=> {
            getThemes()
        })

        return {
            themesList
        }
    }
}
</script>
<style></style>