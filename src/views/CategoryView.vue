<template>
    <div>
        <div style="width: 100%">
            <v-img width="100%" height="300px" :src="currentCategory.cover" cover></v-img>
        </div>
        <v-container fluid>
            <ListResult />
        </v-container>
    </div>
</template>
<script>
import ListResult from '@/components/listcontent/ListResults.vue'
import { watch, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import emitter from '@/plugins/mitt';
export default {
    components: {
        ListResult
    },
    setup() {
        const route = useRoute();
        const currentCategory = ref({})

        const getCategory = async (category) => {
            try {
                const response = await axios.get(`categories/name/${category}`)
                currentCategory.value = response.data
                //voy por la info de esa categoria
                emitter.emit("searchContent", category)
            } catch (error) {
                alert("Ha ocurrido un error al obtener los temas")
                console.log(error)
            }
        }

        watch(() => route.name, (newPath) => {
            getCategory(newPath)
        });

        onMounted(() => {
            getCategory(route.name)
        })
        return {
            route,
            currentCategory
        }
    }
}
</script>
<style></style>