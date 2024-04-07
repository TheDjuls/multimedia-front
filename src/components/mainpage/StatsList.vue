<template>
    <v-container>
        <v-row>
            <v-col v-for="(stat, index) in listStats" :key="index" cols="4">
                <v-card color="#385F73"  theme="dark" height="200">
                    <v-card-title class="text-h5">
                        {{ stat._id.toUpperCase() }}
                    </v-card-title>

                    <v-card-subtitle>
                        Mas de  {{ stat.count }} {{ stat._id }} disponibles
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import axios from 'axios'
import { ref, onMounted } from 'vue'
export default {
    setup() {
        const listStats = ref([])

        const getStats = async () => {
            try {
                const response = await axios.get("/contents/stats")
                listStats.value = response.data

            } catch (error) {
                alert("Ha ocurrido un error al obtener los estadisticas")
                console.log(error)
            }
        }

        onMounted(()=> {
            getStats()
        })

        return {
            listStats
        }
    }
}
</script>
<style></style>