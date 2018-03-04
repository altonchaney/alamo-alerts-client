<template>
  <div id="app">
    <section class="hero">
      <div class="background-image"></div>
      <div class="content">
        <div class="logo"></div>
        <p>Get alerted when movies go on sale at your Alamo Drafthouse location!</p>
      </div>
    </section>
    <section class="main">
      <div class="main-container">
        <div class="location-control-container"
             v-on:click="locationListOpen=!locationListOpen"
             v-bind:class="{ open: locationListOpen }">
          <div class="control">
            <p class="header">Select a Location</p>
            <h1 class="active-option">{{ activeLocation.name }} <span class="icon-expand"></span></h1>
          </div>
          <div class="list">
            <ul>
              <router-link :to="location.slug"
                            v-for="location in locations">
                <li v-on:click="activeLocation = location">
                  <h1 v-bind:class="{ active: location.id === activeLocation.id }">{{ location.name }}</h1>
                </li>
              </router-link>
            </ul>
          </div>
        </div>
        <div class="alert-setup-container" v-bind:class="{ open: alertSetupOpen }">
          <div class="background" v-on:click="alertSetupOpen=false"></div>
          <div class="content" v-on:click="alertSetupOpen=true">
            <div class="alert">
              <div class="button-content"><span class="icon"></span> SET UP ALERT</div>
            </div>
            <ul class="alert-options">
              <li class="twitter">
                <a href="https://twitter.com/AlamoAlerts" target="_blank">
                  <button class="button-content"><span class="icon"></span> TWITTER</button>
                </a>
                <p class="description">Follow this location’s Twitter account to get alerts in your Feed. Turn on the bell for extra alertness.</p>
              </li>
              <li class="rss">
                <button class="button-content"><span class="icon"></span> RSS FEED</button>
                <p class="description">Subscribe to this location’s RSS feed.</p>
              </li>
            </ul>
          </div>
          <p class="close-modal" v-on:click="alertSetupOpen=false">&times; CLOSE THIS</p>
        </div>
        <router-view/>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        locations: [
          { id: '0003', name: 'Village', slug: 'village'},
          { id: '0006', name: 'South Lamar', slug: 'south-lamar'},
          { id: '0009', name: 'Mueller', slug: 'mueller'}
        ],
        activeLocation: { id: '0003', name: 'Village', slug: 'village'},
        locationListOpen: false,
        alertSetupOpen: false
      }
    },
    created() {
      this.activeLocation = this.locations.find(function(obj) { return obj.slug === this.$route.params.locationslug })
    },
    methods: {
      setActiveLocation(locationId) {
        this.activeLocation = this.locations.find(function(obj) { return obj.id === locationId })
      }
    }
  }
</script>

<style>
@import './css/normalize.css';
@import './css/main.css';
</style>
