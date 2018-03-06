import axios from 'axios'
import Listing from '@/components/Listing'

describe('Listing.vue', () => {
  // Inspect the raw component options
  it('has a created hook', () => {
    expect(typeof Listing.created).toBe('function')
  })
  it('has an init function', () => {
    expect(typeof Listing.methods.viewInit).toBe('function')
  })

  it('returns the twitter api call', (done) => {
    axios.get('http://api.alamoalerts.com/tweets/village').then((response) => {
        // expect, assert, whatever
        expect(response.data.length).toBeGreaterThan(0)
    }).then(done, done)
  })
})
