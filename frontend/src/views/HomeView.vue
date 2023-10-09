<template>
  <div class="home">
    <h1>Veja as últimas festas</h1>

    <div :class="{'pesquisa input': this.encontrou == true, 'pesquisaRed input': this.encontrou == false}">
      <input type="text" v-model="pesquisa" placeholder="Pesquisar Festa" @keydown.enter="sistemaPesquisa">
      <button @click="sistemaPesquisa">Pesquisar</button>
      <h3 v-if="this.encontrou == false">Não foi encontrado a festa</h3>
    </div>

    <div class="parties-container">

      <div v-if="this.pesquisaFestas.length > 0" class="parties-container"> <!-- Para evitar bug na pesquisa de quando não achar nada, não vai executar as div dentro dela -->

        <div class="party-container" v-for="(party, index) in pesquisaFestas" :key="index">

          <div class="party-img" :style="{'background-image': 'url(' + party.photos[0] + ')'}"></div>
          <router-link :to="`/party/${party.idfestas}`" class="party-title">{{ party.title }}</router-link>
          <p class="party-date">Data: {{ party.partyDate }}</p>
          <router-link :to="`/party/${party.idfestas}`" class="party-details-btn">Ver mais</router-link>

        </div>

      </div>

    </div>

    <p v-if="parties.length == 0">Não há festas ainda...</p>

    <div class="pagina">
      <button id="primeira" class="pagina-button" @click="mudaPagina(1)">Primeira</button>

      <div class="paginas" v-for="page in paginaQuantidade" :key="page.id">       
          <button :class="{'classe-botao-ativo': this.paginaAtual == (page.id), 'pagina-button': this.paginaAtual != (page.id)}" @click="mudaPagina(page.id)">{{ page.id }}</button>   
      </div>

    </div>

  </div>
</template>

<script>

export default {
  data(){
    return{
      parties: [],
      pesquisaFestas: [],
      pesquisa: "",
      encontrou: true,
      paginaAtual: null,
      paginaQuantidade: [],
      festaQuantidade: 0,
      botoesTotal: 0,
      festaAtual: 0,
      inicio: 0,
      fim: 0
    }
  },

  created(){
    this.getParties();
  },

  methods:{

    async getParties(){
      await fetch("http://localhost:3000/api/party/all", {
                method: "GET",
                headers: { 
                    "Content-type": "application/json"
                }
            })
            .then((resp) => resp.json())
            .then((data) => {
                //console.log(data);

                data.parties.forEach((party, index) =>{
                  if(party.partyDate){
                    party.partyDate = new Date(party.partyDate).toLocaleDateString();
                  }

                  if(party.photos.length > 0){
                    party.photos = party.photos.split(","); //onde tiver virgula vai separar em um array e ser novo objeto

                    party.photos.forEach((photo, index) =>{
                        party.photos[index] = photo.replace("public", "http://localhost:3000").replaceAll("\\", "/");
                    })
                  }

                })

                this.parties = data.parties;
                this.pesquisaFestas = data.parties;

                //console.log(this.parties);

                this.paginacao(1);
            })
            .catch((err) => {
                console.log(err);
            });        

    },

    async sistemaPesquisa(){
      if(this.pesquisa == "" || this.pesquisa == " " || this.pesquisa.length < 1){
        //console.log("Esta vazio a pesquisa");
        //this.pesquisaFestas = this.parties;
        this.mudaPagina(1);
        this.encontrou = true;        
      }
      else{
        //console.log(this.pesquisa);
        //var filtro = this.parties.filter(festa => festa.title.toLowerCase() == this.pesquisa.toLowerCase()); //vou deixar as duas comparações com letras minusculas para que mesmo que digite alguma letra maiuscula diferente, a pesquisa ache a palavra pesquisada
        var filtro = this.parties.filter(festa => festa.title.toLowerCase().includes(this.pesquisa.toLowerCase())); //aqui busca se tiver pelo menos uma parte do nome, vai trazer todos que tiver essa parte do titulo
        //console.log(filtro);                
        if(filtro.length > 0){   
          this.pesquisaFestas = filtro;
          this.encontrou = true;
        }
        else{
          //console.log("Não encontrou a festa");
          this.pesquisaFestas = [];
          this.encontrou = false;      
        }
      }
    },


    async paginacao(numero){
      //console.log(numero);
      this.paginaAtual = numero;      

      this.festaQuantidade = 0;
      this.paginaQuantidade.length = 0; //limpo o array de botões
      
      this.parties.forEach(festa =>{
        this.festaQuantidade += 1;
        //console.log(this.festaQuantidade);
      });

      var quantidade = this.festaQuantidade / 9; //quantas paginas vai ter sendo que cada uma so vai poder aparecer 9
      //console.log(quantidade);
      var arredondamento = Math.ceil(quantidade); //arredonda para cima e inteiro
      //console.log(arredondamento);
      this.botoesTotal = arredondamento;

      if(this.botoesTotal <= 3){ //porque so quero mostrar no maximo 3 botões de troca de pagina, e mudar e aparecer os outros botões conforme passa as paginas
        for(var i = 1; i <= this.botoesTotal; i++){
          //console.log(i)
          this.paginaQuantidade.push({id: i});
        }    
      }
      else if(this.botoesTotal > 3){ //se for mais que 3, vou limitar a mostrar somente os primeiros 3 botões
        for(var i = 1; i <= 3; i++){
          //console.log(i)
          this.paginaQuantidade.push({id: i});
        } 
      }        

      //console.log(this.paginaQuantidade);

      this.mudaPagina(numero);
      
    },

    async mudaPagina(numero){
      //console.log(numero);
      var paginaAntiga = this.paginaAtual;
      this.paginaAtual = numero;  

      this.fim = this.paginaAtual * 9;
      this.inicio = this.fim - 9;

      this.pesquisaFestas = []; //limpando a lista
       
      this.festaAtual = 0;

        this.parties.forEach(festa =>{
          this.festaAtual = this.festaAtual + 1;
          //console.log(this.festaAtual);

          if(this.festaAtual <= this.fim){

            if(this.festaAtual > this.inicio){
              //console.log("entrou no if do forEach")
              this.pesquisaFestas.push(festa);
            }
          }        
        });      

      //console.log(this.pesquisaFestas);
      if(paginaAntiga == 3 && this.paginaAtual == 2 || this.paginaAtual == 1 && this.paginaQuantidade.length > 3){ //se eu estiver voltando os botões ao contrario, quero que apareça o 1...sem esquecer que posso clicar no botão de primeira que pula tudo
        this.paginaQuantidade.length = 0; //limpo o array de botões

        for(var i = 1; i <= 3; i++){
          //console.log(i)
          this.paginaQuantidade.push({id: i});
        }
      }
      else if(this.paginaAtual >= 3 && this.paginaAtual < this.botoesTotal){ //se clicar no botão 3 por exemplo, vou querer mostrar o botão 4 e trocar o botão 1
        this.paginaQuantidade.length = 0; //limpo o array de botões

        for(var i = this.paginaAtual - 1; i <= this.paginaAtual + 1; i++){
          //console.log(i)
          this.paginaQuantidade.push({id: i});
        }
      }
      
    }
  }

}
</script>

<style scoped>
  .home{
    padding-top: 40px;
    padding-bottom: 100px;
    text-align: center;
  }

  .home h1{
    margin-bottom: 30px;
  }

  .parties-container{
    display: flex;
    flex-wrap: wrap;
    width: 1000px;
    margin: 0 auto;    
  }

  .party-container{
    width: 30.3%;
    margin: 1.5%;
    display: flex;
    flex-direction: column;
  }

  .party-img{
    width: 100%;
    height: 200px;
    background-color: #CCC;
    margin-bottom: 12px;
    background-position: center;
    background-size: cover;
  }

  .party-title{
    color: #25282E;
    text-decoration: none;
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  .party-date{
    color: #777;
    margin-bottom: 12px;
  }

  .party-details-btn{
    width: 100%;
    text-transform: uppercase;
    color: #FFF;
    background-color: #25282E;
    transition: .5s;
    border: 0;
    padding: 12px;
    text-decoration: none;
    text-align: center;
  }

  .party-details-btn:hover{
    background-color: #141619;
  }

  .pesquisa input{
   border-radius: 5px;
   padding: 10px 100px;
   margin-right: 5px;
   font-size: 18px;
   text-align: center;
   border-color: #141619;
  } 

  .pesquisa button{
    color: #FFF;
    background-color: #25282E;
    transition: .5s;
    border: 0;
    padding: 13px 12px;
    text-align: center;    
    cursor: pointer;
  }

  .pesquisa button:hover{
    background-color: #141619;
  }

  .pesquisa h3{
    color: red;
    margin-top: 5px;
  }

  .pesquisaRed input{
    border-radius: 5px;
    padding: 10px 100px;
    margin-right: 5px;
    font-size: 18px;
    text-align: center;
    border-color: red;
  }

  .pesquisaRed button{
    color: #FFF;
    background-color: #25282E;
    transition: .5s;
    border: 0;
    padding: 13px 12px;
    text-align: center;    
    cursor: pointer;
  }

  .pesquisaRed button:hover{
    background-color: #141619;
  }

  .pesquisaRed h3{
    color: red;
    margin-top: 5px;
  }

  .pagina{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 50px;
  }

  .pagina-button{
    margin-right: 10px;
    color: #FFF;
    background-color: #25282E;
    transition: .5s;
    border: 1px solid #141619;
    padding: 13px 12px;
    text-align: center;    
    cursor: pointer;
  }

  .pagina-button:hover{
    background-color: #141619;
  }

  .classe-botao-ativo{
    color: #141619;
    background-color: #FFF;
    margin-right: 10px;
    transition: .5s;
    padding: 13px 12px;
    text-align: center;    
    cursor: pointer;
    border: 1px solid #141619;
  }

  .classe-botao-ativo:hover{
    background-color: #777;
  }
  
</style>

<!-- margin: 0 auto; para centralizar na tela 


https://github.com/nextapps-de/flexsearch   //se eu quiser um sistema de busca que com partes de uma palavra ja buscar esses resultados, tenho que instalar essa biblioteca -->