<template>
    <v-card class="custom-card" v-if="data" align='center' :style="{ borderRadius: '5px', width: '100%' }">
      <v-img
        src=""
        cover
        class="text-white"
      > </v-img>
      <v-card-text>
        <h2>
          {{ data.club_name }}
        </h2>
        <p>League: {{ data.domestic_competition ? data.domestic_competition.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "" }}</p>
        <p>Stadium: {{ data.stadium_name }}</p>
        <p>Roster Size: {{ data.squad_size ? data.squad_size : "Unknown" }}</p>
        <p>Market Value (€): {{ marketValue ? marketValue.toLocaleString() : "Unknown" }}</p>
        <p>Top Player: {{ topPlayer }}</p>
      </v-card-text>
    </v-card>
</template>

<script>

export default {
    props: {
        id: Number,
    },
    data() {
        return {
            loading: false,
            post: null,
            error: null,
            data: null,
            topPlayer: "",
            topPlayersData: [],
            marketValue: 0,
        }
    },
    methods: {
        fetchData(id) {
            const config = require('../../config.json')
            fetch(
            `${config.backend_url}/club_id/${id}`
            ).then(
                res => {
                    if (res.ok) {
                        return res.json()
                    }
            }
            ).then(
                data => this.data = data
            )
        },
        async setTopPlayersData() {
            const config = require('../../config.json')
            const url = `${config.backend_url}/top_players_in_clubs`;
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                this.topPlayersData = data;
            })
            .catch(error => console.error(error));
        },
        async setMarketValue(id) {
            const config = require('../../config.json')
            const url = `${config.backend_url}/clubs/market_value/${id}`;
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                this.marketValue = data[0].value;
            })
            .catch(error => console.error(error));
        },
        setTopPlayer() {
            for (let i = 0; i < this.topPlayersData.length; i++) {
                if (this.topPlayersData[i].club_id === this.id) {
                    this.topPlayer = this.topPlayersData[i].player_name
                    return
                }
            }
            this.topPlayer = ""
        }
    },
    mounted() {
        this.fetchData(this.id);
        this.setTopPlayersData().then(() => this.setTopPlayer());
        this.setMarketValue(this.id);
    },
    watch: {
        id(newId, oldId) {
            this.fetchData(newId);
            this.setTopPlayer();
            this.setMarketValue(newId);
        }
    }
}
</script>

<style scoped>
.custom-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
}

.text-white {
  color: #FFFFFF;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-transform: uppercase;
}

p {
  font-size: 16px;
  text-align: left;
}

.v-card-text {
  padding: 20px;
  margin: 3px 0;
}

.v-card-text p:first-of-type {
  margin-top: 0;
}

.v-card-text p:last-of-type {
  margin-bottom: 0;
}
</style>
