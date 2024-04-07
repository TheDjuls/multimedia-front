<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12">
                <div class="text-h3">Crear Contenido</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-text-field density="compact" variant="outlined" label="Nombre" v-model="stateUbicacion.nombre"
                    :error-messages="vuelidate.nombre.$errors.map(e => e.$message)" @blur="vuelidate.nombre.$touch"
                    @input="vuelidate.nombre.$touch"></v-text-field>
                <v-text-field density="compact" variant="outlined" label="Descripcion"
                    v-model="stateUbicacion.descripcion"
                    :error-messages="vuelidate.descripcion.$errors.map(e => e.$message)"
                    @blur="vuelidate.descripcion.$touch" @input="vuelidate.descripcion.$touch"></v-text-field>
                <v-select density="compact" color="primary" label="Categoria" item-title="name" item-value="name"
                    variant="outlined" :items="listCategories" v-model="stateUbicacion.categoria"
                    :error-messages="vuelidate.categoria.$errors.map(e => e.$message)"
                    @blur="vuelidate.categoria.$touch" @input="vuelidate.categoria.$touch"></v-select>
                <v-select density="compact" color="primary" label="Tema" item-title="name" item-value="name"
                    variant="outlined" :items="listThemes" v-model="stateUbicacion.tema"
                    :error-messages="vuelidate.tema.$errors.map(e => e.$message)" @blur="vuelidate.tema.$touch"
                    @input="vuelidate.tema.$touch"></v-select>
                <v-text-field v-if="stateUbicacion.categoria === 'videos' || stateUbicacion.categoria === 'imagenes'"
                    density="compact" variant="outlined" label="Url" v-model="stateUbicacion.url"></v-text-field>
                <v-textarea v-if="stateUbicacion.categoria === 'texto'" label="Contenido" variant="outlined"
                    v-model="stateUbicacion.texto"></v-textarea>
                <v-btn color="primary" block :disabled="vuelidate.$invalid" @click="saveContent()">Crear</v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { getIdUserLogged } from '@/util/session'
export default {
    setup() {
        const listCategories = ref([])
        const listThemes = ref([])
        const author = getIdUserLogged()

        const initialState = {
            nombre: '',
            descripcion: '',
            categoria: null,
            tema: null,
            url: '',
            texto: ''
        }

        const stateUbicacion = reactive({
            ...initialState,
        })

        const rules = {
            nombre: {
                required: helpers.withMessage('Debe completar este campo', required),
                minLength: helpers.withMessage('El nombre debe contener al menos 1 caracteres', minLength(1))
            },
            descripcion: {
                required: helpers.withMessage('Debe completar este campo', required),
                minLength: helpers.withMessage('El nombre debe contener al menos 1 caracteres', minLength(1))
            },
            categoria: {
                required: helpers.withMessage('Debe completar este campo', required)
            },
            tema: {
                required: helpers.withMessage('Debe completar este campo', required)
            }
        }


        const vuelidate = useVuelidate(rules, stateUbicacion)

        const getCategories = async () => {
            try {
                const response = await axios.get("/categories")
                listCategories.value = response.data

            } catch (error) {
                alert("Ha ocurrido un error al obtener los temas")
                console.log(error)
            }
        }

        const getThemes = async () => {
            try {
                const response = await axios.get("/themes")
                listThemes.value = response.data

            } catch (error) {
                alert("Ha ocurrido un error al obtener los temas")
                console.log(error)
            }
        }

        function validarEnlaceYouTube(enlace) {
            const regexYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
            return regexYouTube.test(enlace);
        }

        function validarURL(url) {
            // Expresión regular para validar una URL
            const regexURL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
            return regexURL.test(url);
        }

        function obtenerCodigoVideoYouTube(url) {
            const regex = /[?&]v=([^&]+)/;
            const match = url.match(regex);
            return match ? match[1] : null;
        }

        const getUrlCorrect = (url) => {
            if(stateUbicacion.categoria === 'videos'){
                return obtenerCodigoVideoYouTube(url)
            } else {
                return url
            }
        }

        function clearForm() {
            vuelidate.value.$reset()

            for (const [key, value] of Object.entries(initialState)) {
                stateUbicacion[key] = value
            }
        }

        const saveContent = async () => {
            if (stateUbicacion.categoria === 'videos' || stateUbicacion.categoria === 'imagenes') {
                if (!stateUbicacion.url || stateUbicacion.url.length === 0) {
                    alert("Coloque la url del video o la imagen")
                    return
                } else {
                    //valido si es video que sea de youtube
                    if (stateUbicacion.categoria === 'videos') {
                        const valido = validarEnlaceYouTube(stateUbicacion.url)
                        if (!valido) {
                            alert("no es un video de youtube")
                            return
                        }
                    } else {
                        const valido = validarURL(stateUbicacion.url)
                        if (!valido) {
                            alert("no es una url valida para la imagen")
                            return
                        }
                    }
                }
            } else {
                if (!stateUbicacion.texto || stateUbicacion.texto.length === 0) {
                    alert("Llenar el campo texto")
                    return
                }
            }

            //se arma el payload de guardado
            const payloadContent = {
                "name": stateUbicacion.nombre,
                "description": stateUbicacion.descripcion,
                "category": stateUbicacion.categoria,
                "theme": stateUbicacion.tema,
                "credits": author,
                "url": getUrlCorrect(stateUbicacion.url),
                "text": stateUbicacion.texto
            }
            try {
                const response = axios.post("contents", payloadContent)
                if (response) {
                    alert("Contenido creado exitosamente")
                    clearForm()
                }
            } catch (error) {
                alert("Ha ocurrido un error al guardar")
            }

        }

        onMounted(() => {
            getCategories()
            getThemes()
        })

        return {
            listCategories,
            listThemes,
            stateUbicacion,
            vuelidate,
            saveContent
        }
    }
}
</script>
<style></style>