<template>
    <div>
        <v-toolbar color="primary" density="compact">
            <v-btn @click="navigateBack" v-if="route.name !='inicio'" icon class="hidden-xs-only">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>Biblioteca Multimeda</v-toolbar-title>
            <v-spacer></v-spacer>
            <div v-if="route.name !='inicio'">
                <v-btn :to="{name: 'list'}">Buscar</v-btn>
                <v-btn :to="{name: 'imagenes'}">Imagenes</v-btn>
                <v-btn :to="{name: 'videos'}">Videos</v-btn>
                <v-btn :to="{name: 'texto'}">Textos</v-btn>
                <v-btn v-if="typeUser=='admin' || typeUser =='writer'" :to="{name: 'crear'}">Crear</v-btn>
            </div>
            <v-spacer></v-spacer>
            <LoginMenu />
        </v-toolbar>
    </div>
</template>
<script>
import LoginMenu from './LoginMenu.vue';
import { useRoute, useRouter } from 'vue-router';
import {getTypeUserLogged} from '@/util/session'
export default {
    components: {
        LoginMenu
    },
    setup(){
        const route = useRoute();
        const router = useRouter();
        const typeUser = getTypeUserLogged()


        //methods
        const navigateBack = () => {
            router.back()
        }

        return{
            navigateBack,
            route,
            typeUser
        }
    }
}
</script>
<style></style>