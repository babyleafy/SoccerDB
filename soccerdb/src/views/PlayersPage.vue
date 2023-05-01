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
                        <PlayerCard :id=id :name=name></PlayerCard>
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
import PlayerCard from '@/components/PlayerCard.vue'
import PlayerSearch from '@/components/PlayerSearch.vue'
import LineChart from '@/components/LineChart.vue'
import SelectedPlayers from '@/components/SelectedPlayers.vue'

export default {
    name: 'PlayersPage',
    components: {
        PlayerCard,
        PlayerSearch,
        LineChart,
        SelectedPlayers
    },
    data() {
        return {
            id: null,
            name: null,
            selected: new Map()
        }
    },
    methods: {
        changeHoveredPlayer(data) {
            this.id = data.id;
            this.name = data.name;
        },

        addSelectedPlayer(data) {
            this.selected.set(data.key, data.value)
        },
        removeSelectedPlayer(key) {
            this.selected.delete(key)
        }
    }
}
</script>
