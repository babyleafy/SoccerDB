<template>
  <div>
    <router-link to="/">HomePage</router-link>
    <router-link to="/players">Players</router-link>
    <router-link to="/clubs">Clubs</router-link>
    <router-link to="/matches">Matches</router-link>
    <router-link to="/top">Top</router-link>
    <router-view></router-view>
    <Player id=99946></Player>
  </div>
</template>

<script>
import HomePage from './views/HomePage.vue'

export default {
  name: 'App',
}
</script>
