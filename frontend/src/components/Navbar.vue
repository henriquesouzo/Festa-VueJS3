<template>
  <div id="nav">

    <router-link to="/" id="logo-container">
      <img src="/img/partytimelogo.png" alt="Party Time" />
    </router-link>

    <h2 id="nav-title">Party Time</h2>

    <div id="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/login" v-show="!authenticated">Entrar</router-link>
      <router-link to="/register" v-show="!authenticated">Cadastrar</router-link>
      <router-link to="/dashboard" v-show="authenticated">Dashboard</router-link>
      <router-link to="/profile" v-show="authenticated">Configurações</router-link>
      <button @click="logout($event)" v-show="authenticated">Logout</button>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "Navbar",
  methods: {
    logout(e){
      e.preventDefault();

      //emit evento de logout do usuario
      this.$store.commit("logout");

      //redirect
      this.$router.push("/");
    }
  },
  computed:{ //sempre que alterar algo na pagina vai checar as função abaixo
    ...mapState([
      'authenticated'
    ])
  }
};
</script>

<style scoped>
#nav{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #eee;
}

#nav a{
    text-decoration: none;
    margin-right: 15px;
}

#nav img{
    width: 35px;
}

#nav-title{
    font-size: 3rem;
    font-weight: 300;
}

#logo-container, #nav-links {
    display: flex;
    justify-content: flex-end;
}

button{
    background-color: #fff;
    border: none;
    font-size: 16px;
    cursor: pointer;
}

button:hover{
    color: #C1B696;
}

</style>

<!-- justify-content: space-between; que vai ter um espaço igual entre cada div na horizontal -->