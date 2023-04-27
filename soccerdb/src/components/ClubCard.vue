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
          <p>Id: {{ data.club_id }}</p>
        </v-card-text>
    </v-card>
</template>

<script>

export default {
    props: {
        id: Number
    },
    data() {
        return {
            loading: false,
            post: null,
            error: null,
            data: null,
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
            .then( () =>
                console.log(this.data)
            )
        }
    },
    mounted() {
        this.fetchData(this.id)
    },
    watch: {
        id(newId, oldId) {
        this.fetchData(newId)
        }
    }
}
</script>