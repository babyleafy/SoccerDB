<template>
      <v-card v-if="data" align='center'>
        <v-img
          src=""
          cover
          class="text-white"
        > </v-img>
        <v-card-text align='left'>
          <h2>
            Name: {{ data.club_name }}
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