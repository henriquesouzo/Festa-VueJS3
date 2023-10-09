<template>

    <footer>
        <h3>Party Time &copy; 2023</h3>
        <p>O melhor local para compartilhar seus eventos!</p>
    </footer>

</template>

<script>
export default {
    name: "Footer"
}
</script>

<style scoped>

    footer{
        background-color: #25282E;        
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 300px;
        margin-top: auto;
    }

    footer h3{
        color: #FFF;
        margin-bottom: 15px;
        font-weight: 300;
        font-size: 1.6rem;
    }

    footer p{
        color: #C1B696;
    }
</style>

<!-- margin-top: auto; para posicionar sempre abaixo da pagina o footer...mas é necessario adicionar mais coisas no App.vue -->