<template>
    <div>

        <v-container>
            <v-row no-gutters>
                <v-col justify="start">
                <v-sheet class="pa-2 ma-2">
                    <PlayerSearch 
                        @changeHoveredPlayer="changeHoveredPlayer($event)"
                        @add-selected-player="addSelectedPlayer($event)"/>
                </v-sheet>
                </v-col>
                <v-col cols="3">
                    <v-sheet class="pa-2 ma-2">
                        <Player :id=id></Player>
                    </v-sheet>
                </v-col>
                <v-col>
                    <SelectedPlayers 
                        :selected="selected" 
                        @removeSelectedPlayer="removeSelectedPlayer($event)"/>
                </v-col>
                <v-row>
                    <LineChart/>
                </v-row>
                
            </v-row>
            
        </v-container>
        

    </div>
</template>

<script>
import Player from '../components/Player.vue'
import PlayerSearch from '../components/PlayerSearch.vue'
import LineChart from '@/components/LineChart.vue'
import SelectedPlayers from '@/components/SelectedPlayers.vue'

export default {
    name: 'PlayersPage',
    components: {
        Player,
        PlayerSearch,
        LineChart,
        SelectedPlayers
    },
    data() {
        return {
            id: null,
            selected: new Map()
        }
    },
    methods: {
        changeHoveredPlayer(id) {
            this.id = id
        },

        addSelectedPlayer(data) {
            
            console.log('hello', this.selected)
            console.log(data)
            this.selected.set(data.key, data.value)

            console.log([...this.selected.entries()])
        },
        removeSelectedPlayer(key) {
            this.selected.delete(key)
        }
    }
}
</script>
