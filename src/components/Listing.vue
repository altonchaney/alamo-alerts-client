<template>
  <div class="main-container">
    <div class="location-control-container"
         v-bind:class="{ open: locationListOpen }">
      <div class="control">
        <p class="header">Select a Location</p>
        <h1 class="active-option" v-on:click="locationListOpen=true">{{ activeLocation.name }} <span class="icon-expand"></span></h1>
      </div>
      <div class="list" v-on:click="locationListOpen=false">
        <ul>
          <router-link :to="location.slug"
                       v-for="location in locations"
                       v-bind:key="location.slug">
            <li>
              <h1 v-bind:class="{ active: location.slug === activeLocation.slug }">{{ location.name }}</h1>
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
            <a v-bind:href="'https://twitter.com/AlamoAlerts_'+activeLocation.id+''" target="_blank">
              <button class="button-content"><span class="icon"></span> TWITTER</button>
            </a>
            <p class="description">Follow {{ activeLocation.name }}’s Twitter account to get alerts in your Feed. Turn on the bell for extra alertness.</p>
          </li>
          <!-- <li class="rss">
            <a v-bind:href="'https://twitrss.me/twitter_user_to_rss/?user=alamoalerts_'+activeLocation.id+''" target="_blank">
              <button class="button-content"><span class="icon"></span> RSS FEED</button>
            </a>
            <p class="description">Subscribe to {{ activeLocation.name }}’s RSS feed.</p>
          </li> -->
        </ul>
      </div>
      <p class="close-modal" v-on:click="alertSetupOpen=false">&times; CLOSE THIS</p>
    </div>
    <div class="main-list-container">
      <p class="header">Recently On Sale</p>
      <div v-for="location in locations"
        v-bind:key="'twitter-feed-embed-' + location.slug" v-bind:style="{ display: activeLocation.id === location.id ? 'block' : 'none' }">
        <a  class="twitter-timeline" data-lang="en" data-dnt="true" data-theme="dark"
      v-bind:href="'https://twitter.com/AlamoAlerts_'+location.id+'?ref_src=twsrc%5Etfw'"
        >
          Tweets by AlamoAlerts_{{ location.id }}
        </a>
      </div>
      
      <!-- <ul class="main-list">
        <template v-if="listings.length === 0">
          <li class="loader" 
              v-for="index in 8"
              v-bind:key="index">
            <div class="release-date"></div>
            <div class="title"></div>
          </li>
        </template>
        
        <li v-for="listing in listings" v-bind:key="listing.title + listing.timestamp">
          <p class="release-date">Since {{ listing.timestamp | moment }}</p>
          <a v-bind:href="'https://drafthouse.com/austin/theater/'+$route.params.locationslug+''" target="_blank">
            <h2>{{ listing.title }} &raquo;</h2>
            <h3 v-if="listing.addltimes">ADDITIONAL TIMES!</h3>
          </a>
        </li>
      </ul> -->
    </div>
    <div class="feed-footer">
      <p class="disclaimer">NOTE: Ticket availability subject to change.</p>
      <a v-bind:href="'https://drafthouse.com/austin/theater/'+$route.params.locationslug+''" target="_blank">
        <button class="button-content">SEE ALL LISTINGS</button></a>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'Listing',

    data() {
      return {
        locations: [
          { id: '003', name: 'Village', slug: 'village'},
          { id: '004', name: 'South Lamar', slug: 'south-lamar'},
          { id: '006', name: 'Slaughter Lane', slug: 'slaughter-lane'},
          { id: '007', name: 'Lakeline', slug: 'lakeline'},
          { id: '008', name: 'Mueller', slug: 'mueller'}
        ],
        activeLocation: {},
        locationListOpen: false,
        alertSetupOpen: false,
        listings: []
      }
    },

    created() {
      this.viewInit()
    },

    watch: {
      '$route': 'viewInit'
    },

    filters: {
      moment: function(date) {
        return moment(date).format('MMM Do')
      }
    },

    methods: {
      viewInit() {
        // first set the active location
        const currentSlug = this.$route.params.locationslug
        this.activeLocation = this.locations.find(function(obj) { return obj.slug === currentSlug })
        this.locationListOpen = false
      }
    }
  }
</script>
