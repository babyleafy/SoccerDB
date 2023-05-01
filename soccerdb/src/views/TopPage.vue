<template>
  <div class="container">
    <h1 class="title">The Top: Find the Most Extreme Stats!</h1>
  </div>
  <div class="btn-group">
    <button class="btn" :class="{ active: selected === 'clubs' }" @click="selected = 'clubs'">Clubs</button>
    <button class="btn" :class="{ active: selected === 'players' }" @click="selected = 'players'">Players</button>
  </div>
  
  <div v-if="selected === 'clubs'">
    <TopClubs />
  </div>

  <div v-else-if="selected === 'players'">
    <TopPlayers />
  </div>

  <img v-if="selected === ''" src="https://cdn.dribbble.com/users/2102893/screenshots/4639599/cristiano_ronaldo.jpg" class="centered-image">
</template>
  
<script>
  import TopClubs from '@/components/TopClubs.vue';
  import TopPlayers from '@/components/TopPlayers.vue';
  
  export default {
    name: 'TopPage',
    components: {
      TopClubs,
      TopPlayers
    },
    data() {
      return {
        selected: ''
      };
    }
  };
</script>
  
<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px;
  }

  .title {
    font-size: 2rem;
    padding: 5px;
    margin: 0px;
  }

  .btn-group {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .btn {
    background-color: #ccc;
    border: none;
    color: black;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .btn.active {
    background-color: #4CAF50;
    color: white;
  }

  .centered-image {
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
</style>
  