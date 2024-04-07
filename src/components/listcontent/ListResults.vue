<template>
    <v-row>
        <v-vol class="pa-5" v-for="(content, index) in listadoBusqueda" :key="index" cols="3">
            <v-card class="mx-auto" width="400px" height="450">
                <iframe v-if="content.category == 'videos'" width="400" height="315"
                    :src="'https://www.youtube.com/embed/'+content.url" title="" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen></iframe>
                <v-img v-else-if="content.category == 'imagenes'" width="400" height="315" :src="content.url" cover></v-img>

                <v-card-title>
                    {{ content.name }}
                </v-card-title>

                <v-card-subtitle>
                    {{ content.description }} <br> Creditos: {{ content.credits }} 
                </v-card-subtitle>
                <v-card-text v-if="content.category == 'texto'">
                    {{ content.text }}
                </v-card-text>
            </v-card>
        </v-vol>
    </v-row>
</template>
<script>
import emitter from '@/plugins/mitt';
import axios from 'axios';
import { ref, onMounted } from 'vue';
export default {
    setup() {
        const listadoBusqueda = ref([])

        const getListAllContent = async () => {
            try {
                const response = await axios.get("contents")
                console.log(response)
                listadoBusqueda.value = response.data
            } catch (error) {
                console.log(error)
            }
        }

        const searchAllContent = async (searchkey) => {
            try {
                const response = await axios.post("contents/search",{
                    search: searchkey
                })
                console.log(response)
                listadoBusqueda.value = response.data
            } catch (error) {
                console.log(error)
            }
        }

        onMounted(() => {
            getListAllContent();

            emitter.on("searchContent", (keysearch)=> {
                if(keysearch){
                    searchAllContent(keysearch)
                }else{
                    getListAllContent()
                }
            })
        })

        return {
            listadoBusqueda,
            getListAllContent
        }
    }
}
</script>
<style></style>