<template>
        <v-card class="mx-auto" color="grey-lighten-3">
            <v-card-text>
                <v-text-field :loading="loading" 
                    v-model="name"
                    density="compact" variant="solo"
                    type="search"
                    label="Search players"
                    @change="fetchData"
                    append-inner-icon="mdi-magnify" 
                    single-line 
                    hide-details
                    @click:append-inner="fetchData">
                </v-text-field>
            </v-card-text>

            
        </v-card>

        <v-data-table v-show="data"
                class=".custom-table"
                v-model:items-per-page="itemsPerPage"
                :headers="headers"
                :items="data"

                item-value="player_name"
                @click:row="handleRowClick"
                hover>
        
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
        onClick () {
            this.loading = true

            setTimeout(() => {
            this.loading = false
            this.loaded = true
            //console.log(this.name)
            }, 2000)
        },
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
                    //console.log(data)
                    if (Object.keys(data).length === 0) {
                        //console.log(data)
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
                //console.log(item)
                //console.log(item.columns.player_id)
                this.$emit('changeHoveredPlayer', item.columns.player_id)

                this.$emit('addSelectedPlayer', {
                    key:item.columns.player_id, 
                    value:item.columns
                })
            }
            
        },
        handleRowClickSelected(event, {item}) {
            
            
            if (window.getSelection().toString().length === 0) {
                //console.log(item.columns)
                //console.log(this.selected.delete(item.columns.player_id))
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