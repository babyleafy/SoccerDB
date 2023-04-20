<template>
    <v-card v-if="data" align='center'>
        <v-img
          :src="data.image_url"
          cover
          class="text-white"
        > </v-img>
        <v-card-text align='left'>
          <h2>
            Name: {{ data.player_name }}
          </h2>
          <p>Club: {{ data.club_name ? data.club_name : "No club" }}</p>
          <p>Country: {{ data.country }}</p>
          <p>Date of birth: {{ datestring }}</p>
          <p>Position: {{ data.position }}</p>
          <p>Foot: {{ data.foot }}</p>
          <p>Height (cm): {{data.height_in_cm}}</p>
          <p>Market value (€): {{ data.market_value_in_eur ? Number(data.market_value_in_eur).toLocaleString(undefined) : "unknown" }}</p>
          <p>Max Market value (€): {{ Number(data.highest_market_value_in_eur).toLocaleString(undefined) }}</p>
        </v-card-text>
    </v-card>
</template>

<script>


export default {
  name: 'Players',
  props: {
    id: Number
  }
  ,
  data() {
    return {
        loading: false,
        post: null,
        error: null,
        data: null,
        datestring: null
    }
  },
  methods:{
    /**
     * TODO: REPLACE WITH ACTUAL FETCH / API ROUTING
     */
    fetchData(id) {
      const config = require('../../config.json')
        fetch(
          `${config.backend_url}/player_id/${id}`
        ).then(

           res => {
            if (res.ok) {
              //this.data=res.json()
              return res.json()
            }
            else {
              return {
                    player_name: "ERROR!",
                    country: "Belgium",
                    date_of_birth: "1995-01-30",
                    position: "Attack", 
                    foot: "Right", 
                    height_in_cm: "180", 
                    market_value_in_eur: "50000", 
                    image_url: "https://img.a.transfermarkt.technology/portrait/header/s_104725_1028_2013_09_24_1.jpg?lm=1"
                
              }
            }
           }
        ).then(
           data => this.data = data
        ).
        then( () =>
          {const date = new Date(this.data.date_of_birth)
            this.datestring = date.toDateString()
          console.log(this.data)}
          )
    }
  },
  mounted() {
    this.fetchData(this.id)
  },
  watch: {
    id(newId, oldId) {
      this.fetchData(newId)
    }
  }
}
</script>