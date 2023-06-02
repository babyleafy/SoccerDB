<template>
    <div :style="{ display: 'flex', justifyContent: 'center' }">
        <v-container>
            <v-row no-gutters>
                <v-col cols="8" class="pa-0 ma-0" >
                    <v-sheet class="pa-2 ma-2 custom-sheet" color="#1A202C" :style="{ borderRadius: '5px' }">
                        <ClubSearch
                            @change-hovered-club="changeHoveredClub($event)"
                            @add-selected-club="addSelectedClub($event)"/>
                    </v-sheet>
                </v-col>
                <v-col cols="4" class="pa-0 ma-0">
                    <v-sheet class="pa-2 ma-2 custom-sheet" color="#1A202C" :style="{ borderRadius: '5px' }">
                        <ClubCard :id=id :top-player="topScorer"/>
                    </v-sheet>                    
                </v-col>
            </v-row>
            <v-row no-gutters justify="center">
                <v-sheet class="pa-2 ma-2 custom-sheet" color="#1A202C" :style="{ borderRadius: '5px' }">
                    <SelectedClubs
                        :selected="selected" 
                        @remove-selected-club="removeSelectedClub($event)"/>
                </v-sheet>
            </v-row>
            <v-row no-gutters justify="center">
                <h1> Trophies Won </h1>
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

<style scoped>
    .custom-sheet:hover {
        box-shadow: 4px 4px 8px rgba(53, 52, 52, 0.673);
        transition: box-shadow 0.3s ease-in-out;
    }

</style>
