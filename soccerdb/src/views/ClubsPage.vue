<template>
    <div>
        Club Statistics
    </div>
    <Club :id="id"></Club>
</template>

<script>
import Club from "../components/Club.vue"
export default {
    name: 'ClubsPage',
    components: {
        Club,
    },
    data() {
        return {
            id: 131
        }
    }
}
</script>
