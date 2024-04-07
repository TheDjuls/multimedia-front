<template>
    <div class="text-center">
        <v-menu v-model="menu" :close-on-content-click="false" location="start">
            <template v-slot:activator="{ props }">
                <v-btn prepend-icon="mdi-account" class="mr-2" v-bind="props">
                    {{ usuarioLogged != null ? usuarioLogged.username : 'Iniciar Sesion ' }}
                </v-btn>
            </template>

            <v-card v-if="usuarioLogged == null" min-width="300">
                <v-list>

                    <v-list-item>
                        <v-text-field density="compact" variant="outlined" label="Usuario" single-line hide-details
                            v-model="userPayload.username" :rules="[errors.username]"></v-text-field>
                    </v-list-item>

                    <v-list-item>
                        <v-text-field density="compact" variant="outlined" label="Password" type="password" single-line
                            hide-details v-model="userPayload.password" :rules="[errors.password]"></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-text-field density="compact" variant="outlined" label="Nombre completo" single-line
                            hide-details v-model="userPayload.fullName" :rules="[errors.fullName]"></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-text-field density="compact" variant="outlined" label="Correo" single-line hide-details
                            v-model="userPayload.email" :rules="[errors.email]"></v-text-field>
                    </v-list-item>
                    <v-list-item v-if="isNewRegister">
                        <v-select v-model="userPayload.type" density="compact" color="primary" label="Tipo Usuario"
                            :items="typesUser" item-title="name" item-value="key" single-line hide-details
                            variant="outlined"></v-select>
                    </v-list-item>
                    <v-list-item>
                        <div class="text-caption cursor-pointer text-center text-blue" @click="toogleTypeLogin">
                            {{ isNewRegister ? 'Ya tienes cuenta?' : 'Aun no te haz registrado?' }}</div>
                    </v-list-item>
                </v-list>

                <v-card-actions>
                    <v-btn class="mx-auto" color="primary" variant="text" :disabled="vuelidate.$invalid"
                        @click="isNewRegister ? registerNewUser() : login()">
                        {{ isNewRegister ? 'Registrar' : 'Iniciar Sesion' }}
                    </v-btn>
                </v-card-actions>
            </v-card>

            <v-card v-else min-width="300">
                <v-list>
                    <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
                        :title="(`${usuarioLogged.fullName}`)"
                        :subtitle="usuarioLogged.type">
                        <template v-slot:append>
                            <v-btn variant="text" icon="mdi-logout" @click="logout"></v-btn>
                        </template>
                    </v-list-item>
                    <v-list-item to="/configs" class="cursor-pointer">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-cog"></v-icon>
                        </template>

                        <v-list-item-title> Administracion</v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/list" class="cursor-pointer">
                        <template v-slot:prepend>
                            <v-icon icon="mdi-note"></v-icon>
                        </template>

                        <v-list-item-title> Ver Contenido</v-list-item-title>
                    </v-list-item>
                </v-list>

            </v-card>
        </v-menu>
    </div>
</template>
<script>
/* eslint-disable */
import { ref, reactive, onMounted } from 'vue'
import { email, required, minLength, maxLength, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { useRouter } from 'vue-router';
import axios from 'axios';


export default {
    setup() {
        //variables
        const router = useRouter();
        const usuarioLogged = ref(null)
        const menu = ref(false)
        const isNewRegister = ref(false)
        const errors = ref({
        });
        const typesUser = ref([{
            key: 'writer', name: 'Creador'
        }, {
            key: 'reader', name: 'Lector'
        }])

        let userPayload = reactive({
            fullName: '',
            username: '',
            password: '',
            email: '',
            type: 'reader'
        })

        const rules = {
            fullName: { requiredIf: requiredIf(isNewRegister), minLength: minLength(2), maxLength: maxLength(255) },
            username: { required, maxLength: maxLength(255) },
            password: { required, minLength: minLength(1), maxLength: maxLength(10) },
            email: { requiredIf: requiredIf(isNewRegister), email, minLength: minLength(2), maxLength: maxLength(255) }
        }

        const vuelidate = useVuelidate(rules, userPayload)

        //methods
        const toogleTypeLogin = () => {
            isNewRegister.value = !isNewRegister.value;
        }

        const closeModal = () => {
            menu.value = false
        }

        const logout = () => {
            localStorage.clear()
            usuarioLogged.value = null
            router.go('/')
        }


        const updateDataSession = () => {
            usuarioLogged.value = JSON.parse(localStorage.getItem("sessionUser"))
            console.log(usuarioLogged.value)
            if (!usuarioLogged.value ||Object.keys(usuarioLogged.value).length === 0) {
                usuarioLogged.value = null
            }
            console.log(usuarioLogged.value)
        }

        const setSession = (user) => {
            localStorage.setItem('sessionUser', JSON.stringify(user));
            updateDataSession()
        }

        const login = async () => {
            const payload = {
                "username": userPayload.username,
                "password": userPayload.password
            }
            try {
                const response = await axios.post("login", payload)
                setSession(response.data);
                router.push({name:'list'})
                console.log(response.data)
            } catch (error) {
                alert("Ha ocurrido un error al iniciar sesion")
                console.log(error)
            }
        }

        const registerNewUser = async () => {
            console.log(userPayload)
            const payload = {
                "fullName": userPayload.fullName,
                "type": userPayload.type,
                "username": userPayload.username,
                "password": userPayload.password,
                "email": userPayload.email
            }
            try {
                const response = await axios.post("users", payload)
                login()
                console.log(response.data)
            } catch (error) {
                alert("Ha ocurrido un error al registrarse")
                console.log(error)
            }

        }


        //lifecycle 
        onMounted(() => {
            updateDataSession()
        })

        return {
            login,
            logout,
            registerNewUser,
            toogleTypeLogin,
            isNewRegister,
            menu,
            vuelidate,
            errors,
            userPayload,
            usuarioLogged,
            typesUser
        }
    }
}
</script>
<style></style>