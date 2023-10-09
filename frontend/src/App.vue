<template>

  <div class="tudo">
    <Navbar />
    <div class="routerview">
      <router-view class="container" />
    </div>
    <Footer />
  </div>  

</template>

<script>
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default {
  name: "App",
  components:{
    Navbar,
    Footer
  }
}
</script>

<style>
.tudo{  
  display: flex;
  flex-direction: column;
  min-height: 100vh;  
}

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Helvetica;
  color: #444;
}

.container{
  min-height: 300px;  
}

a{
  transition: .5s;
}

a:hover{
  color: #c1b696;
}

</style>

<!-- ESSES VÃO TIRAR AS MARGENS DE ESPAÇO QUE VEM PADRÃO DOS LADOS
  margin: 0;
  padding: 0;
  box-sizing: border-box; ELE LIMITA A LARGURA DOS INPUTS


  ESSA CLASSE TUDO VAI DEIXAR SEMPRE O FOOTER ABAIXO DA PAGINA
  .tudo{  
    display: flex;
    flex-direction: column;
    min-height: 100vh;  
}

É NECESSARIO ADICIONAR NO FOOTER ESSE CODIGO CSS NO STYLE
margin-top: auto;
 -->
