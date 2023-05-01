<template>
    <div>
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
    </div>
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
        selected: 'clubs'
      };
    }
  };
  </script>
  
  <style>
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
  </style>
  