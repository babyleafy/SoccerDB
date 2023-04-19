<template>
  <PlayerSearch @changeSelectedPlayer="changeSelectedPlayer($event)"></PlayerSearch>
  <Player :id=id></Player>
</template>

<script>
import Player from './components/Player.vue'
import PlayerSearch from './components/PlayerSearch.vue'

export default {
  name: 'App',
  components: {
    Player,
    PlayerSearch
  },
  data() {
    return {
      id: 99946
    }
  },
  methods: {
    changeSelectedPlayer(id) {
      this.id = id
      console.log('hello')
      console.log(id)
      console.log(this.id)
    }
  }
}
</script>
