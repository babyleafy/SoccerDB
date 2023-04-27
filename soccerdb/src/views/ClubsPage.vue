<template>
    <div>
        <v-container>
            <v-row no-gutters>
                <v-col justify="start">
                <v-sheet class="pa-2 ma-2">
                    <ClubSearch
                        @change-hovered-club="changeHoveredClub($event)"
                        @add-selected-club="addSelectedClub($event)"/>
                </v-sheet>
                </v-col>
                <v-col cols="3">
                    <v-sheet class="pa-2 ma-2">
                        <ClubCard :id=id></ClubCard>
                    </v-sheet>
                </v-col>
                
                
            </v-row>
            <v-col>
                    <SelectedClubs
                        :selected="selected" 
                        @remove-selected-club="removeSelectedClub($event)"/>
            </v-col>
        </v-container>
    </div>
</template>

<script>
import ClubCard from "@/components/ClubCard.vue"
import ClubSearch from "@/components/ClubSearch.vue"
import SelectedClubs from "@/components/SelectedClubs.vue"

export default {
    name: 'ClubsPage',
    components: {
        ClubCard,
        ClubSearch,
        SelectedClubs
    },
    data() {
        return {
            id: 131,
            selected: new Map()
        }
    },
    methods: {
        changeHoveredClub(id) {
            this.id = id
        },
        addSelectedClub(data) {
            this.selected.set(data.key, data.value)
        },
        removeSelectedClub(key) {
            this.selected.delete(key)
        }
    }
}
</script>
