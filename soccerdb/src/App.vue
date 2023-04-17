<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
  <Player id=1234></Player>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import Player from './components/Player.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    Player
  }
}
</script>
