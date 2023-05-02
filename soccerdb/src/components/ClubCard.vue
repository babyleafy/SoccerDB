<template>
      <v-card class="card" v-if="data" align='center'>
        <v-img
          src=""
          cover
          class="text-white"
        > </v-img>
        <v-card-text align='left'>
          <h2>
            {{ data.club_name }}
          </h2>
          <p>Roster size: {{ data.squad_size }}</p>
          <p>Market value (million €): {{ data.total_market_value ? Number(data.total_market_value).toLocaleString(undefined) : "unknown" }}</p>
          <p>Coach name: {{ data.coach_name }}</p>
          <p>Top Player: {{ topPlayer }}</p>
          <p>Id: {{ data.club_id }}</p>
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
            const url = `http://localhost:8081/top_players_in_clubs`;
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                this.topPlayersData = data;
            })
            .catch(error => console.error(error));
        },
        setTopPlayer() {
            for (let i = 0; i < this.topPlayersData.length; i++) {
                if (this.topPlayersData[i].club_id === this.id) {
                    this.topPlayer = this.topPlayersData[i].player_name
                    console.log(this.topPlayer)
                    return
                }
            }
            this.topPlayer = ""
        }
    },
    mounted() {
        this.fetchData(this.id)
        this.setTopPlayersData().then(() => this.setTopPlayer())
        
    },
    watch: {
        id(newId, oldId) {
            this.fetchData(newId)
            this.setTopPlayer()
        }
    }
}
</script>

<style scoped>
.card {
  background-color: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 10px;
  width: 300px;
  transition: all 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
}

.text-white {
  color: #FFFFFF;
}

h2 {
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  text-transform: uppercase;
}

p {
  font-size: 16px;
  margin: 10px 0;
}
.v-card-text {
  padding: 20px;
}

.v-card-text p:first-of-type {
  margin-top: 0;
}

.v-card-text p:last-of-type {
  margin-bottom: 0;
}
</style>
