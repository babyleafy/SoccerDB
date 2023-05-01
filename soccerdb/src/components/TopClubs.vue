<template>
  <div class="container text-center">
    <div class="title">
      <h1>Top Clubs</h1>
      <h2>Which attribute do you want to rank by?</h2>
    </div>
      <div class="button-group">
          <button class="rounded text-black" :class="{'bg-blue-500 text-white': orderBy === 'avg_goals'}" @click="sendRequest('avg_goals')">
            Average Goals <i class="emoji">⚽️</i>
          </button>
          <button class="rounded text-black" :class="{'bg-indigo-500 text-white': orderBy === 'total_goals'}" @click="sendRequest('total_goals')">
            Total Goals <i class="emoji">⚽️</i>
          </button>
          <button class="rounded text-black" :class="{'bg-green-500 text-white': orderBy === 'value'}" @click="sendRequest('value')">
            Value <i class="emoji">💰</i>
          </button>
          <button class="rounded text-black" :class="{'bg-red-500 text-white': orderBy === 'knockout_trophies'}" @click="sendRequest('knockout_trophies')">
            Knockout Trophies <i class="emoji">🏆</i>
          </button>
          <button class="rounded text-black" :class="{'bg-yellow-500 text-white': orderBy === 'average_age'}" @click="sendRequest('average_age')">
            Average Age <i class="emoji">⌛</i>
          </button>
          <button class="rounded text-black" :class="{'bg-pink-500 text-white': orderBy === 'national_clubs'}" @click="sendRequest('national_clubs')">
            National Players <i class="emoji">🌍</i>
          </button>
      </div>
      <div class="table-container">
        <table class="centered">
            <thead>
            <tr>
                <th>Rank</th>
                <th>Club</th>
                <th>League</th>
                <th>{{ orderBy.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="(club, index) in currentclubs" :key="club.club_id"
                :class="getClass((currentPage - 1) * pageSize + index + 1) + (club.club_id === selectedClubId ? ' selected' : '')"
                @click="selectedClubId = club.club_id">
                <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
                <td>{{ club.club_name }}</td>
                <td>{{ club.league }}</td>
                <td>
                  {{ orderBy === 'value'
                    ? club[orderBy].toLocaleString('en-US', { style: 'currency', currency: 'EUR' })
                    : club[orderBy] }}
                </td>               
              </tr>
            </tbody>
        </table>
        <clubCard v-if="selectedClubId" :id="selectedClubId" class="club-card"/>
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
  import ClubCard from '@/components/ClubCard.vue'

  export default {
    name: 'Topclubs',
    components: {
      ClubCard,
    },
    data() {
      return {
        clubs: [],
        orderBy: '',
        currentPage: 1,
        pageSize: 10,
        selectedClubId: null,
      };
    },
    computed: {
      pageCount() {
        return Math.ceil(this.clubs.length / this.pageSize);
      },
      currentclubs() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.clubs.slice(startIndex, endIndex);
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
      sendRequest(orderBy) {
        const url = `http://localhost:8081/top_clubs/${orderBy}`;
        fetch(url)
          .then(response => response.json())
          .then(data => {
            this.clubs = data;
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

  .club-card {
    flex: 0 0 300px; /* Set the width of the club card */
    height: 100%; /* Make the club card take up the full height of the table */
    overflow: auto; /* Add scrollbars if needed */
  }

  .table-container > table {
    width: 70%;
  }

  .table-container > clubCard {
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
