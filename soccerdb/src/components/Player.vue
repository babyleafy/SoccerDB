<template>
    <h1> {{ id }} {{ data }}</h1>
    <v-btn v-if="data">
        Button
    </v-btn>
    <div class="d-flex justify-center">
      <v-card v-if="data" width='400' align='center'>
        <v-img
          height="200"
          :src="data.image_url"
          cover
          class="text-white"
        > </v-img>
        <v-card-text align='left'>
          <h2>
            Name: {{ data.name }}
          </h2>
          <p>Country: {{ data.country }}</p>
          <p>Date of birth: {{ datestring }}</p>
          <p>Position: {{ data.position }}</p>
          <p>Foot: {{ data.foot }}</p>
          <p>Height (cm): {{data.height_in_cm}}</p>
          <p>Market value (€): {{ Number(data.market_value_in_eur).toLocaleString(undefined) }}</p>
        </v-card-text>
    </v-card>
    </div>
    
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
        new Promise(r => setTimeout(r, 10)).then(
            
                this.data = {
                    name: "Ian Raeymaekers",
                    country: "Belgium",
                    date_of_birth: "1995-01-30",
                    position: "Attack", 
                    foot: "Right", 
                    height_in_cm: "180", 
                    market_value_in_eur: "50000", 
                    image_url: "https://img.a.transfermarkt.technology/portrait/header/s_104725_1028_2013_09_24_1.jpg?lm=1"
                
            }
        ).then( () =>
          {const date = new Date(this.data.date_of_birth)
            this.datestring = date.toDateString()
          console.log(this.data)}
          )
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>