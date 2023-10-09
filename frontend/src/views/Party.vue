<template>
    <div class="party">
        <h1>{{ party.title }}</h1>

        <div class="party-container">
            <div class="party-images" v-if="party.photos">

                <div class="main-image" :style="{'background-image': 'url(' + party.photos[0] + ')'}"></div> <!-- Foto Principal a maior -->

                <div class="party-mini-images" v-if="party.photos[1]"> <!-- se existe mais de uma foto -->
                    <div class="mini-image" v-for="(photo, index) in party.photos.slice(1, party.photos.length)" :key="index"
                    :style="{'background-image': 'url(' + party.photos[index + 1] + ')'}"></div> <!-- .slice(1, party.photos.length) é para não repetir a mesma foto -->
                </div>

            </div>

            <div class="party-details">
                <p class="bold">Descrição da Festa:</p>
                <p class="party-description">{{ party.description }}</p>
                <p class="bold">Data da Festa:</p>
                <p class="party-date">{{ party.partyDate }}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            party: {}
        }
    },
    
    created(){
        this.getParty();
    },

    methods:{
        async getParty(){
            const id = this.$route.params.id;
            const token = this.$store.getters.token;

            await fetch(`http://localhost:3000/api/party/${id}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "auth-token": token 
                }
            })
            .then((resp) => resp.json())
            .then((data) =>{
                //console.log(data);

                if(data.erro != null){ //se o usuario tentar entrar em uma festa privada que não é a dele, ele vai ser redirecionado para a home
                    this.$router.push('/');
                }

                this.party = data.party[0];
                this.party.partyDate = new Date(this.party.partyDate).toLocaleDateString(); //converte a data para o formato do Brasil

                this.party.photos = this.party.photos.split(","); //onde tiver virgula vai separar em um array e ser novo objeto

                this.party.photos.forEach((photo, index) =>{
                    this.party.photos[index] = photo.replace("public", "http://localhost:3000").replaceAll("\\", "/");
                })
            })
            .catch((erro) =>{
                console.log(erro)
            })

        }
    }
}
</script>

<style scoped>
    .party{
        text-align: center;
        padding-top: 40px;
        padding-bottom: 100px;
        width: 1000px;
        margin: 0 auto;
    }

    .party h1{
        margin-bottom: 40px;
    }

    .party-container{
        display: flex;
    }

    .party-images {
        width: 380px;
        margin-right: 30px;
    }

    .main-image{
        width: 100%;
        height: 200px;
        background-color: #CCC;
        margin-bottom: 15px;
        background-position: center;
        background-size: cover;
    }

    .party-mini-images{
        display: flex;
        flex-wrap: wrap;
    }

    .mini-image{
        width: 80px;
        height: 80px;
        margin-right: 15px;
        margin-bottom: 15px;
        background-position: center;
        background-size: cover;
        background-color: #CCC;
    }

    .party-details{
        display: flex;
        flex-direction: column;
        align-items: flex-start;        
    }

    .bold{
        margin-bottom: 12px;
        font-weight: bold;
    }

    .party-description, .party-date{
        margin-bottom: 20px;
    }
</style>


<!-- 
background-size: cover; centraliza a imagem de fundo e posiciona ela melhor
flex-wrap: wrap; joga uma imagem em baixo da outra quando passar a largura definida
-->