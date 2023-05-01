<template>
    <div class="container text-center">
        <div class="button-group">
            <button class="rounded text-black" :class="{'bg-blue-500 text-white': orderBy === 'goals'}" @click="sendRequest('goals')">Goals</button>
            <button class="rounded text-black" :class="{'bg-green-500 text-white': orderBy === 'assists'}" @click="sendRequest('assists')">Assists</button>
            <button class="rounded text-black" :class="{'bg-red-500 text-white': orderBy === 'red_cards'}" @click="sendRequest('red_cards')">Red Cards</button>
            <button class="rounded text-black" :class="{'bg-yellow-500 text-white': orderBy === 'yellow_cards'}" @click="sendRequest('yellow_cards')">Yellow Cards</button>
            <button class="rounded text-black" :class="{'bg-indigo-500 text-white': orderBy === 'minutes_played'}" @click="sendRequest('minutes_played')">Minutes</button>
            <button class="rounded text-black" :class="{'bg-purple-500 text-white': orderBy === 'height'}" @click="sendRequest('height')">Height</button>
            <button class="rounded text-black" :class="{'bg-pink-500 text-white': orderBy === 'current_value'}" @click="sendRequest('current_value')">Current Value</button>
            <button class="rounded text-black" :class="{'bg-gray-500 text-white': orderBy === 'highest_value'}" @click="sendRequest('highest_value')">Highest Value</button>
        </div>
        <table class="centered">
            <thead>
            <tr>
                <th>Player ID</th>
                <th>Player Name</th>
                <th>{{ orderBy }}</th>
            </tr>
            </thead>
            <tbody>
                <tr class="gold" v-for="(player, index) in players.slice(0, 1)" :key="player.player_id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ player.player_name }}</td>
                    <td>{{ player[orderBy] }}</td>
                </tr>
                <tr class="silver" v-for="(player, index) in players.slice(1, 2)" :key="player.player_id">
                    <td>{{ index + 2 }}</td>
                    <td>{{ player.player_name }}</td>
                    <td>{{ player[orderBy] }}</td>
                </tr>
                <tr class="bronze" v-for="(player, index) in players.slice(2, 3)" :key="player.player_id">
                    <td>{{ index + 3 }}</td>
                    <td>{{ player.player_name }}</td>
                    <td>{{ player[orderBy] }}</td>
                </tr>
                <tr v-for="(player, index) in players.slice(3)" :key="player.player_id">
                    <td>{{ index + 4 }}</td>
                    <td>{{ player.player_name }}</td>
                    <td>{{ player[orderBy] }}</td>
                </tr>
            </tbody>


        </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TopPlayers',
    data() {
      return {
        players: [],
        orderBy: ''
      }
    },
    methods: {
      sendRequest(orderBy) {
        this.orderBy = orderBy;
        const url = `http://localhost:8081/top_players/${orderBy}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.players = data;
          })
          .catch(error => console.error(error));
      }
    }
  };
  </script>

<style>
button {
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 10px;
  border: none;
  cursor: pointer;
  outline: none;
}

.rounded {
  border-radius: 20px;
  border: 1px solid black;
}

.bg-blue-500 {
  background-color: #3B82F6;
}

.bg-green-500 {
  background-color: #10B981;
}

.bg-red-500 {
  background-color: #EF4444;
}

.bg-yellow-500 {
  background-color: #FBBF24;
}

.bg-indigo-500 {
  background-color: #6366F1;
}

.bg-purple-500 {
  background-color: #8B5CF6;
}

.bg-pink-500 {
  background-color: #EC4899;
}

.bg-gray-500 {
  background-color: #6B7280;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
}

th, td {
  border: 1px solid black;
  padding: 8px;
}

.gold {
  background-color: gold;
}

.silver {
  background-color: silver;
}

.bronze {
  background-color: #cd7f32;
}

</style>
