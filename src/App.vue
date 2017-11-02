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
.container,
.container-fixed,
.container-fixed-md,
.container-fixed-sm,
.container-fixed-xs,
.container-fluid {
    margin-right: auto;
    margin-left: auto;
    padding-right: 10px;
    padding-left: 10px;
}

@media (min-width: 768px) {
    .container {
        max-width: 740px;
    }
}

@media (min-width: 992px) {
    .container {
        max-width: 960px;
    }
}

@media (min-width: 1200px) {
    .container {
        max-width: 1160px;
    }
}

#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;

    margin-top: 60px;
    /* text-align: center; */

    color: #2c3e50;

    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

</style>
