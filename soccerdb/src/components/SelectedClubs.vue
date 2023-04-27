<template>
    <h1>SELECTEDCLUBS</h1>
    <div id="selection" v-if="selected">
        <v-data-table-virtual v-if="selected"
                class=".custom-table"   
                :headers="headers"
                :items="selected.values()"

                item-value="club_name"
                @click:row="handleRowClick"
                hover>
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
                { title: 'Roster size', align: 'end', key: 'squad_size' },
                { title: 'Market value (million €)', align: 'end', key: 'total_market_value' },
                { title: 'Coach', align: 'end', key: 'coach_name' },
                { title: 'ID', align: 'end', key: 'club_id' },
            ]
        }
    },
    methods: {
        handleRowClick(event, {item}) {
            if (window.getSelection().toString().length === 0) {
                this.$emit("removeSelectedClub", item.columns.club_id)
            }
        }
    }
}
</script>