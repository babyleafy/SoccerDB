<template>
    <v-card class="mx-auto" color="grey-lighten-3">
      <v-card-text>
        <v-text-field
          :loading="loading"
          v-model="name"
          dense
          outlined
          type="search"
          label="Search players"
          @change="fetchData"
          append-icon="mdi-magnify"
          single-line
          hide-details
          @click:append="fetchData"
        ></v-text-field>
      </v-card-text>
    </v-card>
  <v-data-table
    class="custom-table"
    v-model:items-per-page="itemsPerPage"
    :headers="headers"
    :items="data"
    item-value="club_name"
    @click:row="handleRowClick"
    :dense="true"
    :footer-props="{ showFirstLastPage: true }"
    :items-per-page-options="[10, 20, 50]"
    :loading="loading"
    :loading-text="'Loading...'"
    :no-data-text="'No results found.'"
    :no-results-text="'No matching records found'"
    :search="name">
        
        </v-data-table>
</template>

<script>


export default {
    name: 'PlayerSearch',
    emits: ["changeHoveredPlayer", "addSelectedPlayer"],
    data() {
        return {
            name: null,
            loading: false,
            post: null,
            error: null,
            data: [{}, {}, {}, {}, {}],
            datestring: null,
            itemsPerPage: 5,
            headers: [
                {
                    title: 'Name',
                    align: 'start',
                    key: 'player_name',

                },
                { title: 'Club', align: 'end', key: 'club_name' },
                { title: 'Date of birth', align: 'end', key: 'dob' },
                { title: 'Country', align: 'end', key: 'country' },
                { title: 'Position', align: 'end', key: 'position' },
                { title: 'ID', align: 'end', key: 'player_id' },
            ],
        }
    },
    methods: {
        /**
         * TODO: REPLACE WITH ACTUAL FETCH / API ROUTING
         */
        fetchData() {
            this.loading = true
            const config = require('../../config.json')

            const fetchRoute = this.name && this.name != '' 
                ? `${config.backend_url}/player_name/${this.name}`
                : `${config.backend_url}/players`

            fetch(
                fetchRoute
            ).then(

                res => {
                    if (res.ok) {
                        this.loading = false
                        this.loaded = true
                        return res.json()
                    }
                }
            ).then(
                data => {
                    if (Object.keys(data).length === 0) {
                        this.data = [{}, {}]
                    }
                    else {
                        this.data = data
                    }
                    
                }
            ).then(() => {
                        
                        this.data.forEach((player) => {
                            if (player.date_of_birth) {
                                const date = new Date(player.date_of_birth)
                                player.dob = date.toDateString()
                            }
                        })
                        this.padArray(this.data, 5, {})
                }
            )
        },
        handleRowClick(event, {item}) {
            
            if (window.getSelection().toString().length === 0 &&
                item != null &&
                item.columns != null &&
                item.columns.player_id != null
            ) {
                this.$emit('changeHoveredPlayer', {id: item.columns.player_id, name: item.columns.player_name})
                this.$emit('addSelectedPlayer', {
                    key:item.columns.player_id, 
                    value:item.columns
                })
            }
            
        },
        padArray(arr, count, padding) {
            for(let i = 0; i < count - arr.length; i++) {
                            this.data.push(padding)
            }
        }
    }
}
</script>