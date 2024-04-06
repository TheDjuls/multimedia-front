import { createRouter, createWebHashHistory } from 'vue-router'
import Inicio from './../views/MainPage.vue'


const routes = [
    { path: '/', name: 'inicio', component: Inicio },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

function validateAuth(to, from, next) {
  const isAuthenticated = localStorage.getItem("sessionUser");
  if (isAuthenticated) {
      next();
    } else {
      if (to.path !== '/') {
        next('/');
      } else {
        next();
      }
    }
}

// Agregar la función de validación globalmente para todas las rutas
router.beforeEach(validateAuth);


export default router