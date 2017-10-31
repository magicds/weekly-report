<template>
  <div class="maim">
    <my-header></my-header>

    <router-view></router-view>

  </div>
</template>

<script>
import Header from './header'
export default {
  name: 'main',
  components: {
    'my-header': Header
  }
}
</script>

<style>

</style>

