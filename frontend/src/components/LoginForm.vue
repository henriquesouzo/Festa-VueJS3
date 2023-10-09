<template>
    <div>
        <Message :msg="msg" :msgClass="msgClass" />

        <form @submit="login($event)" id="login-form">

            <div class="input-container">
                <label for="email">E-mail:</label>
                <input type="email" name="email" id="email" v-model="email" placeholder="Digite o seu e-mail">
            </div>

            <div class="input-container">
                <label for="password">Senha:</label>
                <input type="password" name="password" id="password" v-model="password" placeholder="Digite a sua senha">
            </div>

            <InputSubmit text="Entrar" />

        </form>

    </div>
</template>

<script>
import Message from './Message.vue';
import InputSubmit from './form/InputSubmit.vue';

export default {
    name: "LoginForm",

    components: {
        Message,
        InputSubmit
    },

    data(){
        return{
            email: null,
            password: null,
            msg: null,
            msgClass: null
        }
    },

    methods: {
        async login(e){
            e.preventDefault();

            const data = {
                email: this.email,
                password: this.password
            }

            const jsonData = JSON.stringify(data);

            await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: jsonData
            })
            .then((resp) => resp.json())
            .then((data) => {
                let auth = false;

                if(data.error){
                    this.msg = data.error;
                    this.msgClass = "error";
                }
                else{ //se não tiver erro para fazer o login
                    auth = true;

                    this.msg = data.msg;
                    this.msgClass = "success";

                    //emitir um evento para o vuex salvar o usuario
                    this.$store.commit("authenticate", {token: data.token, userId: data.userId})
                }

            setTimeout(() => {

                    if(!auth){
                        this.msg = null;
                    }
                    else{
                        //redirect
                        this.$router.push("dashboard");
                    }

                }, 3000);

            })
        }
    }

}
</script>

<style scoped>
    #login-form{
        max-width: 400px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }

    .input-container{
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    text-align: left;
}

.input-container label {
    margin-bottom: 10px;
    color: #555;
}

.input-container input{
    padding: 10px;
    border: 1px solid #e8e8e8;
}
</style>