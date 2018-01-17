<template>
  <div id="app" class="container">
    <!-- <img src="./assets/logo.png"> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;

    /* margin-top: 60px; */
    /* text-align: center; */

    color: #2c3e50;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

</style>
