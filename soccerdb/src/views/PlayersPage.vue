<template>
    <div>

        <v-container>
            <v-row no-gutters>
                <v-col justify="start">
                <v-sheet class="pa-2 ma-2">
                    <PlayerSearch @changeSelectedPlayer="changeSelectedPlayer($event)"></PlayerSearch>
                </v-sheet>
                </v-col>
                <v-col cols="3">
                    <v-sheet class="pa-2 ma-2">
                        <Player :id=id></Player>
                    </v-sheet>
                </v-col>
            </v-row>
            
        </v-container>
        

    </div>
</template>

<script>
import Player from '../components/Player.vue'
import PlayerSearch from '../components/PlayerSearch.vue'
export default {
    name: 'PlayersPage',
    components: {
        Player,
        PlayerSearch
    },
    data() {
        return {
            id: null
        }
    },
    methods: {
        changeSelectedPlayer(id) {
            this.id = id
            console.log('hello')
            console.log(id)
            console.log(this.id)
        }
    }
}
</script>
