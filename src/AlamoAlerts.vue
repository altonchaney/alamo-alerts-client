<template>
  <div id="alamoalerts">
    <section class="hero">
      <div class="background-image" v-bind:style="{ backgroundImage: 'url(' + heroImageUrl + ')' }"></div>
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
  import axios from 'axios'

  export default {
    name: 'AlamoAlerts',
    data() {
      return {
        heroImageUrl: ""
      }
    },
    created() {
      this.getHeroImage()
    },
    methods: {
      getHeroImage() {
        axios.get('https://api.themoviedb.org/3/discover/movie?api_key=69e93151bbb7ee3e03a532dd2995da45&language=en-US&region=US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_year=' + new Date().getFullYear())
        .then((resp) => this.heroImageUrl = 'https://image.tmdb.org/t/p/w1280/' + resp.data.results[0].backdrop_path)
        .catch((err) => console.log(err))
      }
    }
  }
</script>

<style>
@import './css/normalize.css';
@import './css/main.css';
</style>
