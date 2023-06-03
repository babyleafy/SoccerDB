<template>
    <div :style="{ display: 'flex', justifyContent: 'center' }">
        <v-container>
            <v-row no-gutters>
                <v-col cols="8" class="pa-0 ma-0" >
                    <v-sheet class="pa-2 ma-2 custom-sheet" color="#1A202C" :style="{ borderRadius: '5px' }">
                        <PlayerSearch 
                            @changeHoveredPlayer="changeHoveredPlayer($event)"
                            @add-selected-player="addSelectedPlayer($event)"/>
                    </v-sheet>
                </v-col>
                <v-col cols="4" class="pa-0 ma-0">
                    <v-sheet class="pa-2 ma-2 custom-sheet" color="#1A202C" :style="{ borderRadius: '5px' }">
                        <PlayerCard :id=id :name=name />
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row no-gutters justify="center">
                <v-sheet class="pa-2 ma-2 custom-sheet" color="#1A202C" :style="{ borderRadius: '5px' }">
                    <SelectedPlayers 
                        :selected="selected" 
                        @removeSelectedPlayer="removeSelectedPlayer($event)"/>
                </v-sheet>
            </v-row>
            <v-row no-gutters justify="center">
                <LineChart title="Goals Scored" :key="chartKey" @fetch-data="fetchGoals"/>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import PlayerCard from '@/components/PlayerCard.vue'
import PlayerSearch from '@/components/PlayerSearch.vue'
import LineChart from '@/components/LineChart.vue'
import SelectedPlayers from '@/components/SelectedPlayers.vue'

const config = require('../../config.json')

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
            selected: new Map(),
            goalMap: new Map(),
            goalData: {
                datasets: []
            },
            chartKey: 0
        }
    },
    methods: {
        changeHoveredPlayer(data) {
            this.id = data.id;
            this.name = data.name;
        },

        addSelectedPlayer(data) {
            this.selected.set(data.key, data.value)
            this.chartKey += 1
        },
        removeSelectedPlayer(key) {
            this.selected.delete(key)
            this.chartKey -= 1
        },
        async fetchGoals(setData) {
            const fetchData = async () => { 
                for (const [id] of this.selected) {
                    if (!this.goalMap.has(id)) {
                        await fetch(`${config.backend_url}/player_goals/${id}`).then(
                            res => {
                                if (res.ok) {
                                    return res.json()
                                }
                            }
                        ).then(
                            res => {
                                const chartPoint = {
                                    label: res[0].player_name,
                                    data: []
                                }
                                res.forEach((season) => {
                                    chartPoint.data.push(
                                        {
                                            x: `${season.season}-01-01 23:39:30`,
                                            y: season.goal_count
                                        }
                                    )
                                })
                                
                                this.goalMap.set(id, chartPoint)
                            }
                        )
                    }
                }
                this.goalData.datasets.length = 0
                
                for (const [key] of this.goalMap) {
                    this.goalData.datasets.push(this.goalMap.get(key))
                }
                
                setData(this.goalData)
            }
            await fetchData()
        }
    }
}
</script>

<style scoped>
    .custom-sheet:hover {
        box-shadow: 4px 4px 8px rgba(53, 52, 52, 0.673);
        transition: box-shadow 0.3s ease-in-out;
    }
</style>
