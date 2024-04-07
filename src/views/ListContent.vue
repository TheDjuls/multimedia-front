<template>
    <v-container fluid>
        <SearchBar />
        <ListResult />
    </v-container>
</template>
<script>
import SearchBar from '@/components/listcontent/SearchBar.vue'
import ListResult from '@/components/listcontent/ListResults.vue'

export default {
    components:{
        SearchBar,
        ListResult
    },
    setup() {

    }
}
</script>
<style>
    
</style>