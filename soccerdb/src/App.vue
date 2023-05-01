<template>
  <div class="button-group-container">
    <div class="button-group">
      <router-link to="/" class="button" active-class="active">Home</router-link>
      <router-link to="/players" class="button" active-class="active">Players</router-link>
      <router-link to="/clubs" class="button" active-class="active">Clubs</router-link>
      <router-link to="/top" class="button" active-class="active">Top</router-link>
    </div>
  </div>
  <router-view></router-view>
</template>

<script>

  export default {
    name: 'App',
  }
</script>

<style>

  .button-group-container {
    display: flex;
    flex-direction: column;
  }

  .button-group {
    display: flex;
    justify-content: center;
  }

  .button {
    padding: 10px 20px;
    margin: 0 5px;
    border: none;
    background-color: #f1f1f1;
    color: #333;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    cursor: pointer;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  .button:hover {
    background-color: #ddd;
  }

  .active {
    background-color: #4CAF50;
    color: white;
  }
</style>
