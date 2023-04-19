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

        <v-data-table v-if="data"
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
    emits: ["changeSelectedPlayer"],
    data() {
        return {
            lastSelectedItem: "asdf",
            name: null,
            loading: false,
            post: null,
            error: null,
            data: null,
            datestring: null,
            itemsPerPage: 5,
            headers: [
                {
                    title: 'Name',
                    align: 'start',
                    sortable: false,
                    key: 'player_name',


                },
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
            console.log(this.name)
            }, 2000)
        },
        /**
         * TODO: REPLACE WITH ACTUAL FETCH / API ROUTING
         */
        fetchData() {
            this.loading = true
            const config = require('../../config.json')
            fetch(
                `${config.backend_url}/player_name/${this.name}`
            ).then(

                res => {
                    if (res.ok) {
                        //this.data=res.json()
                        this.loading = false
                        this.loaded = true
                        return res.json()
                    }
                }
            ).then(
                data => this.data = data
            ).then(() => {
                    this.data.forEach((player) => {
                        const date = new Date(player.date_of_birth)
                        player.dob = date.toDateString()
                    })}
                )
        },
        handleRowClick(event, {item}) {
            if (window.getSelection().toString().length === 0) {
                console.log(item)
                console.log(item.columns.player_name)
                console.log(item.columns.player_id)
                this.lastSelectedItem = item.player_name
                this.$emit('changeSelectedPlayer', item.columns.player_id)
            }
        }
    }
}
</script>