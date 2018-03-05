<template>
  <div id="alamoalerts">
    <section class="hero">
      <div class="background-image"></div>
      <div class="content">
        <div class="logo"></div>
        <p>Get alerted when movies go on sale at your Alamo Drafthouse location!</p>
      </div>
    </section>
    <section class="main">
      <router-view/>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'AlamoAlerts',
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style>
@import './css/normalize.css';
@import './css/main.css';
</style>
