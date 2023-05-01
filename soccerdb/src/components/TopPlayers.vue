<template>
  <div class="container text-center">
    <div class="title">
      <h1>Top Players</h1>
      <h2>Which attribute do you want to rank by?</h2>
    </div>
      <div class="button-group">
          <button class="rounded text-black" :class="{'bg-blue-500 text-white': orderBy === 'goals'}" @click="sendRequest('goals')">
            Goals <i class="emoji">⚽️</i>
          </button>
          <button class="rounded text-black" :class="{'bg-green-500 text-white': orderBy === 'assists'}" @click="sendRequest('assists')">
            Assists <i class="emoji">🙌</i>
          </button>
          <button class="rounded text-black" :class="{'bg-red-500 text-white': orderBy === 'red_cards'}" @click="sendRequest('red_cards')">
            Red Cards <i class="emoji">🟥</i>
          </button>
          <button class="rounded text-black" :class="{'bg-yellow-500 text-white': orderBy === 'yellow_cards'}" @click="sendRequest('yellow_cards')">
            Yellow Cards <i class="emoji">🟨</i>
          </button>
          <button class="rounded text-black" :class="{'bg-indigo-500 text-white': orderBy === 'minutes_played'}" @click="sendRequest('minutes_played')">
            Minutes <i class="emoji">⏱️</i>
          </button>
          <button class="rounded text-black" :class="{'bg-purple-500 text-white': orderBy === 'height'}" @click="sendRequest('height')">
            Height <i class="emoji">📏</i>
          </button>
          <button class="rounded text-black" :class="{'bg-pink-500 text-white': orderBy === 'current_value'}" @click="sendRequest('current_value')">
            Current Value <i class="emoji">💰</i>
          </button>
          <button class="rounded text-black" :class="{'bg-gray-500 text-white': orderBy === 'highest_value'}" @click="sendRequest('highest_value')">
            Highest Value <i class="emoji">💸</i>
          </button>
          <button class="rounded text-black" :class="{'bg-green-500 text-white': orderBy === 'overall'}" @click="sendMongoRequest('overall')">
            FIFA Stat (Special)<i class="emoji">📊</i>
          </button>
      </div>
      <div class="table-container">
        <table class="centered">
            <thead>
            <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Club</th>
                <th>Position</th>
                <th>{{ orderBy.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="(player, index) in currentPlayers" :key="orderBy === 'overall' ? player._id : player.player_id"
                :class="getClass((currentPage - 1) * pageSize + index + 1) + (selectedPlayerId === player.player_id ? ' selected' : '')"
                @click="selectedPlayerId = orderBy === 'overall' ? null : player.player_id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ orderBy === 'overall' ? player.long_name : player.player_name }}</td>
                <td>{{ player.club }}</td>
                <td>{{ player.position }}</td>
                <td>
                  {{ orderBy === 'current_value' || orderBy === 'highest_value'
                    ? player[orderBy].toLocaleString('en-US', { style: 'currency', currency: 'EUR' })
                    : player[orderBy] }}
                </td>               
              </tr>
            </tbody>
        </table>
        <PlayerCard v-if="selectedPlayerId" :id="selectedPlayerId" class="player-card"/>
      </div>
      <div class="pagination" v-if="orderBy !== ''" :style="{ pointerEvents: orderBy === '' ? 'none' : 'auto' }">
        <button :disabled="currentPage === 1" @click="prevPage()">Previous</button>
        <button v-if="currentPage > 3" @click="goToPage(1)">1</button>
        <span v-if="currentPage > 4">...</span>
        <button v-for="page in visiblePages" :key="page" :class="{ active: currentPage === page }" @click="goToPage(page)">{{ page }}</button>
        <span v-if="currentPage < pageCount - 3">...</span>
        <button v-if="currentPage < pageCount - 2" @click="goToPage(pageCount)">{{ pageCount }}</button>
        <button :disabled="currentPage === pageCount" @click="nextPage()">Next</button>
      </div>
  </div>
</template>
  
  <script>
  import PlayerCard from '@/components/PlayerCard.vue'

  export default {
    name: 'TopPlayers',
    components: {
      PlayerCard
    },
    data() {
      return {
        players: [],
        orderBy: '',
        currentPage: 1,
        pageSize: 10,
        selectedPlayerId: null,
      };
    },
    computed: {
      pageCount() {
        return Math.ceil(this.players.length / this.pageSize);
      },
      currentPlayers() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.players.slice(startIndex, endIndex);
      },
      visiblePages() {
        let startPage = this.currentPage - 3
        let endPage = this.currentPage + 3
        if (startPage < 1) {
          startPage = 1
          endPage = 7
        }
        if (endPage > this.pageCount) {
          endPage = this.pageCount
          startPage = this.pageCount - 6
        }
        const pages = []
        for (let i = startPage; i <= endPage; i++) {
          pages.push(i)
        }
        return pages
      },
    },
    methods: {
      async sendMongoRequest(orderBy) {
        const url = 'http://localhost:8081/top_fifa';
        try {
          const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
          });
          const data = await response.json();
          this.players = data.data;
          this.orderBy = orderBy;
        } catch (error) {
          return { error };
        }
      },
      sendRequest(orderBy) {
        const url = `http://localhost:8081/top_players/${orderBy}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.players = data;
            this.orderBy = orderBy;
          })
          .catch(error => console.error(error));
      }, 
      getClass(index) {
        if (index === 1) {
          return 'gold';
        } else if (index === 2) {
          return 'silver';
        } else if (index === 3) {
          return 'bronze';
        } else {
          return '';
        }
      },
      prevPage() {
        this.currentPage -= 1;
      },
      nextPage() {
        this.currentPage += 1;
      },
      goToPage(page) {
        this.currentPage = page;
      },
    }
  };
  </script>

<style>
  body {
    font-family: 'Open Sans', sans-serif;
    background-color: #f2f2f2;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .table-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    width: 100%;
    position: relative;
  }

  .player-card {
    flex: 0 0 300px; /* Set the width of the player card */
    height: 100%; /* Make the player card take up the full height of the table */
    overflow: auto; /* Add scrollbars if needed */
  }

  .table-container > table {
    width: 70%;
  }

  .table-container > PlayerCard {
    width: 30%;
  }

  h1 {
    font-family: 'Open Sans', sans-serif;
    font-size: 48px;
    margin-bottom: 20px;
  }

  h2 {
    font-family: 'Open Sans', sans-serif;
    font-size: 24px;
    margin-bottom: 40px;
  }

  button {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px;
    border: none;
    cursor: pointer;
    outline: none;
    color: black;
    font-size: 16px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  button:hover {
    background-color: #a1cfff;
  }

  .button-group {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 40px;
  }

  .button-group button {
    margin: 10px;
    border-radius: 999px;
    font-size: 16px;
    padding: 10px 20px;
    transition: all 0.3s ease;
  }

  .button-group button:hover {
    transform: scale(1.05);
  }

  .rounded {
    border-radius: 20px;
    border: 1px solid black;
  }

  .emoji {
    display: inline-block;
    font-size: 20px;
    margin-left: 5px;
    vertical-align: middle;
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
    background-color: #000000;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 0 auto;
    background-color: white;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
    font-size: 16px;
  }

  th {
    background-color: #1a202c;
    color: white;
    font-weight: normal;
  }

  tbody tr:hover {
    background-color: #d3c3c35e;
  }

  tbody tr.selected {
    font-weight: bold;
    border: 2px solid #000;
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

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }

  .pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    background-color: #eee;
    cursor: pointer;
  }

  .pagination button.active {
    background-color: #3b82f6;
    color: #fff;
  }


</style>
