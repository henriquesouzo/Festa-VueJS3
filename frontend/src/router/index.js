import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store/index'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: false
    }
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: true
    }
  },
  {
    path: '/newparty',
    name: 'NewParty',
    component: () => import('../views/NewParty.vue'),
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: true
    }
  },
  {
    path: '/editparty/:id',
    name: 'editParty',
    component: () => import('../views/EditParty.vue'),
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: true
    }
  },
  {
    path: '/party/:id',
    name: 'Party',
    component: () => import('../views/Party.vue'),
    meta: { //se precisa de autenticação para entrar nesta rota
      requiresAuth: false
    }
  }

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {

    if (store.getters.authenticated === false) {

      next({
        path: '/login',
        params: {nextUrl: to.fullPath}
      })
     
    } else {
      next()
    }

  } else {
      next()
  }
})

export default router
