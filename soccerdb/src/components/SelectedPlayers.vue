<template>
    <div class="selected-players">
        <h1>Selected Players</h1>
        <div id="selection" v-if="selected">
            <v-data-table-virtual v-if="selected"
                    class=".custom-table"   
                    :headers="headers"
                    :items="selected.values()"
                    item-value="player_name"
                    @click:row="handleRowClick"
                    hover>
            </v-data-table-virtual>
        </div>
    </div>
</template>

<script>

export default {
    name: "SelectedPlayers",
    props: {
        selected: Map
    },
    emits: ["removeSelectedPlayer"],
    data() {
        return {
            headers: [
                {
                    title: 'Name',
                    align: 'start',
                    key: 'player_name',

                },
                { title: 'Club', align: 'end', key: 'club_name' },
                { title: 'Date of Birth', align: 'end', key: 'dob' },
                { title: 'Country', align: 'end', key: 'country' },
                { title: 'Position', align: 'end', key: 'position' },
                { title: 'ID', align: 'start', key: 'player_id' },
            ]
        }
    },
    methods: {
        handleRowClick(event, {item}) {
            if (window.getSelection().toString().length === 0) {
                this.$emit("removeSelectedPlayer", item.columns.player_id)
            }
        }
    }
}
</script>


<style scoped>
.selected-players {
  display: flex;
  flex-direction: column;
}

h1 {
    color:aquamarine;
    font-size: 2.5rem;
    text-align: center;
}
</style>