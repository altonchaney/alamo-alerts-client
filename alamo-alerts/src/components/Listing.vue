<template>
  <div class="main-list-container">
    <p class="header">Recently On Sale</p>
    <ul class="main-list">
      <li v-for="listing in listings">
        <p class="release-date">Releasing May 19th</p>
        <h2>{{ listing.title }}</h2>
        <h3 v-if="listing.addltimes">ADDITIONAL TIMES!</h3>
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'Listing',

    data() {
      return {
        listings: []
      }
    },

    created() {
      this.fetchData()
    },

    watch: {
      '$route': 'fetchData'
    },

    methods: {
      fetchData() {
        this.listings.length = 0
        axios.get('http://localhost:3131/tweets/'+this.$route.params.locationslug)
        .then((resp) => {
          for (let i=0; i < resp.data.length; i++) {
            // remove leading text
            // split string by line breaks and dashes
            const listingStrings = resp.data[i].text.slice(26).split('\n- ')
            const datePosted = resp.data[i]
            console.log(listingStrings)
            // push each of this strings into a listing object
            for (let j=0; j < listingStrings.length; j++) {
              let listingObject = {}
              // finally check and set addltime flag
              if (listingStrings[j].includes(" [Add'l Times]")) {
                listingObject.title = listingStrings[j].substr(0, listingStrings[j].length-14)
                listingObject.addltimes = true
              } else {
                listingObject.title = listingStrings[j]
                listingObject.addltimes = false
              }
              this.listings.push(listingObject)
            }
            console.log(this.listings)
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
    }
  }
</script>
