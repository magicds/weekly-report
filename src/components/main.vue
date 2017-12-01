<template>
  <div class="maim">
    <my-header></my-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import Header from './header';
export default {
  name: 'main',
  components: {
    'my-header': Header
  }
};
</script>

<style>

</style>

