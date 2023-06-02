<template>
    <h1>Selected Clubs</h1>
    <div id="selection" v-if="selected">
        <v-data-table-virtual v-if="selected" class=".custom-table" :headers="headers" :items="selected.values()"
            item-value="club_name" @click:row="handleRowClick" hover>
        </v-data-table-virtual>
    </div>
</template>

<script>

export default {
    name: "SelectedClubs",
    props: {
        selected: Map
    },
    emits: ["removeSelectedClub"],
    data() {
        return {
            headers: [
                {
                    title: 'Name',
                    align: 'start',
                    key: 'club_name',

                },
                { title: 'Roster size', align: 'start', key: 'squad_size' },
                { title: 'League', align: 'start', key: 'domestic_competition' },
                { title: 'Stadium', align: 'start', key: 'stadium_name' },
                { title: 'ID', align: 'start', key: 'club_id' },
            ]
        }
    },
    methods: {
        handleRowClick(event, { item }) {
            if (window.getSelection().toString().length === 0) {
                this.$emit("removeSelectedClub", item.columns)
            }
        }
    }
}
</script>

<style scoped>

h1 {
    color:aquamarine;
    font-size: 2.5rem;
    text-align: center;
}
</style>