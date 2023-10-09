<template>
<div class="data-container">
    <Message :msg="msg" :msgClass="msgClass" />

    <div class="data-table-heading">
        <div class="data-id-heading">Nº:</div>
        <div class="data-title-heading">Nome da Festa:</div>
        <div class="data-actions-heading">Ações:</div>
    </div>

    <div class="data-table-body">
        <div class="data-row" v-for="(party, index) in parties" :key="index">
            <div class="data-id-container">{{index + 1}}</div>

            <div class="data-title-container">
                <router-link :to="`/party/${party.idfestas}`">{{party.title}}</router-link>
            </div>

            <div class="data-actions-container">
                <router-link :to="`/editparty/${party.idfestas}`" class="edit-btn">Editar</router-link>
                <button class="remove-btn" @click="remove(party.idfestas)">Remover</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import Message from "./Message.vue";

export default {
    name: "DataTable",

    components:{
        Message
    },

    props: ["parties"],

    data(){
        return{
            msg: null,
            msgClass: null
        }
    },

    methods:{
        async remove(id){
            const userId = this.$store.getters.userId;
            const token = this.$store.getters.token;

            //console.log(id)

            const data = {
                id: id,
                userId: userId
            };

            const jsonData = JSON.stringify(data);

            await fetch("http://localhost:3000/api/party", {
                method: "DELETE",
                headers:{
                    "Content-type": "application/json",
                    "auth-token": token
                },
                body: jsonData
            })
            .then((resp) => resp.json())
            .then((data) =>{
                if(data.erro){
                    this.msg = data.erro;
                    this.msgClass = "error"
                }
                else{
                    this.msg = data.msg;
                    this.msgClass = "success"
                }

                //pegar as festas novamente para atualizar
                    this.$parent.getParties();

                setTimeout(() =>{
                    this.msg = null //vai sumir  mensagem de excluido depois de alguns segundos
                    
                }, 2500)
            })
            .catch((erro) =>{
                console.log(erro);
            })

        }
    }
}

</script>

<style scoped>
    .data-table-heading, .data-row{
        display: flex;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid #CCC;
    }

    .data-table-heading div, .data-row div{
        flex: 1 1 0;
    }

    .data-id-heading, .data-id-container{
        max-width: 50px;
    }

    .edit-btn, .remove-btn{
        padding: 10px 16px;
        background-color: #000;
        color: #FFF;
        margin: 5px;
        text-decoration: none;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: .5s;
    }

    .edit-btn{
        background-color: #007BFF;
    }

    .edit-btn:hover{
        background-color: #0069D9;
    }

    .remove-btn{
        background-color: #DC3545;
    }

    .remove-btn:hover{
        background-color: #C82333;
    }

</style>

<!-- SIGNIFICA QUE VAI DIVIDIR POR IGUAL O ESPAÇO DOS TRES
    .data-table-heading div, .data-row div{
        flex: 1 1 0;
    } 


    VOU DEIXAR NO CANTO ESSES DOIS JUNTOS
    .data-id-heading, .data-id-container{
        max-width: 50px;
    }

-->