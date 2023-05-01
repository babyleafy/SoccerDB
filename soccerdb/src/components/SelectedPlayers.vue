<template>
    
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
                { title: 'Date of birth', align: 'end', key: 'dob' },
                { title: 'Country', align: 'end', key: 'country' },
                { title: 'Position', align: 'end', key: 'position' },
                { title: 'ID', align: 'end', key: 'player_id' },
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