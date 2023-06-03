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
            <v-row no-gutters justify="center" style="padding-bottom: 24px;">
                <v-sheet class="pa-2 ma-2 custom-sheet" color="#1A202C" :style="{ borderRadius: '5px' }">
                    <SelectedPlayers 
                        :selected="selected" 
                        @removeSelectedPlayer="removeSelectedPlayer($event)"/>
                </v-sheet>
            </v-row>
            <v-row no-gutters justify="center">
                <div>
                    <h2> 
                        <span class="first-word"> {{ selectedStat.charAt(0).toUpperCase() + selectedStat.slice(1) }}</span>
                        by Player
                    </h2>
                </div>
            </v-row>
            <v-row no-gutters justify="center">
                <div class="button-group">
                    <button :class="['rounded', 'text-black', { 'bg-blue-500': selectedStat === 'goals' }]"
                        @click="setSelectedStat('goals')">
                        Goals <i class="emoji">⚽️</i>
                    </button>
                    <button :class="['rounded', 'text-black', { 'bg-green-500': selectedStat === 'assists' }]"
                        @click="setSelectedStat('assists')">
                        Assists <i class="emoji">🙌</i>
                    </button>
                    <button :class="['rounded', 'text-black', { 'bg-red-500': selectedStat === 'minutes' }]"
                        @click="setSelectedStat('minutes')">
                        Minutes <i class="emoji">⌛</i>
                    </button>
                </div>
                <LineChart :key="chartKey" @fetch-data="fetchGoals"/>
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
            selectedStat: 'goals',
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
        setSelectedStat(stat) {
            this.selectedStat = stat;
            this.chartKey += 1;
        },
        addSelectedPlayer(data) {
            this.selected.set(data.key, data.value);
            this.chartKey += 1;
        },
        removeSelectedPlayer(key) {
            this.selected.delete(key);
            this.chartKey += 1;
        },
        async fetchGoals(setData) {
            const fetchData = async () => { 
                this.goalMap = new Map();

                for (const [id] of this.selected) {
                    await fetch(`${config.backend_url}/player_${this.selectedStat}/${id}`).then(
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
                                console.log(season);
                                chartPoint.data.push(
                                    {
                                        x: `${season.season}-01-01 23:39:30`,
                                        y: season[this.selectedStat + "_count"]
                                    }
                                )
                            })
                            
                            this.goalMap.set(id, chartPoint)
                        }
                    )
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

    h2 {
        color: rgb(0, 12, 8);
        font-size: 2.5rem;
        text-align: center;
    }

    button {
        border: none;
        cursor: pointer;
        outline: none;
        color: black;
        border-radius: 4px;
        transition: all 0.3s ease;
    }

    button:hover {
        background-color: aliceblue;
    }

    .button-group {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .button-group button {
        margin: 5px;
        font-size: 14px;
        padding: 5px 10px;
        transition: all 0.3s ease;
    }

    .button-group button:hover {
        transform: scale(1.03);
    }

    .rounded {
        border-radius: 20px;
        border: 1px solid black;
    }

    .emoji {
        display: inline-block;
        font-size: 14px;
        margin-left: 5px;
        vertical-align: middle;
    }

    .bg-blue-500 {
        background-color: #3B82F6;
    }

    .bg-green-500 {
        background-color: #10B981;
    }

    .bg-red-500 {
        background-color: #EF4444;
    }

    h2 .first-word {
        color: rgb(42, 0, 91);
    }
</style>
