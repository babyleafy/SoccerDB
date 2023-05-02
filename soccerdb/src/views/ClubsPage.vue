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
                    <ClubCard :id=id :top-player="topScorer"/>
                </v-col>
            </v-row>
            <v-col>
                    <SelectedClubs
                        :selected="selected" 
                        @remove-selected-club="removeSelectedClub($event)"/>
            </v-col>
            <v-row>
                <h2> Trophies Won </h2>
                <BarChart :key="chartKey"
                        :labels="Array.from(selectedTrophyData.keys())"
                        :data="Array.from(selectedTrophyData.values())"/>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import ClubCard from "@/components/ClubCard.vue"
import ClubSearch from "@/components/ClubSearch.vue"
import SelectedClubs from "@/components/SelectedClubs.vue"
import BarChart from "@/components/BarChart.vue"

export default {
    name: 'ClubsPage',
    components: {
        ClubCard,
        ClubSearch,
        SelectedClubs,
        BarChart
    },
    data() {
        return {
            id: 0,
            selected: new Map(),
            clubTrophies: [],
            selectedTrophyData: new Map(),
            chartLabels: [],
            chartData: [],
            chartKey: 0,
        }
    },
    methods: {
        changeHoveredClub(id) {
            this.id = id
        },
        addSelectedClub(data) {
            
            this.selected.set(data.key, data.value)
            for (let i = 0; i < this.clubTrophies.length; i++) {
                if (this.clubTrophies[i].club_id == data.key) {
                    this.selectedTrophyData.set(data.value.club_name, this.clubTrophies[i].knockout_trophies)
                    this.chartKey += 1
                    break
                }
            }
        },
        removeSelectedClub(key) {
            this.selected.delete(key.club_id)
            this.selectedTrophyData.delete(key.club_name)
            this.chartKey += 1
        },
        setTrophyData() {
            const url = `http://localhost:8081/top_clubs/knockout_trophies`;
            fetch(url)
            .then(response => response.json())
            .then(data => {
                this.clubTrophies = data;
            })
            .catch(error => console.error(error));
        },
        
    },
    mounted() {
        this.setTrophyData()
    }
}
</script>
