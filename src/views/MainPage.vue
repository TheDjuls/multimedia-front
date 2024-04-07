<template>
    <div>
    <AppBar />
    <router-view></router-view>
    </div>
</template>
<script>
import AppBar from '@/components/mainpage/AppBar'

export default {
    components:{
        AppBar,
    },
    setup() {

    }
}
</script>
<style>
    
</style>