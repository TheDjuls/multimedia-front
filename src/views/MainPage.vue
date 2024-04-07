<template>
    <div>
        <AppBar />
        <StatsList v-if="route.name=='inicio'" />
        <router-view></router-view>
    </div>
</template>
<script>
import AppBar from '@/components/mainpage/AppBar'
import StatsList from '@/components/mainpage/StatsList'
import { useRoute } from 'vue-router';
export default {
    components: {
        AppBar,
        StatsList
    },
    setup() {
        const route = useRoute();


        return{
            route
        }
    }
}
</script>
<style></style>