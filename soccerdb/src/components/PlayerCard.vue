<template>
    <v-card v-if="data" align='center' :style="{ borderRadius: '5px', width: '100%' }" class="custom-card">
        <v-img
            :src="data.image_url"
            cover
            class="profile-picture"
        ></v-img>
        <v-card-text>
          <h2 class="player-name">{{ data.player_name }}</h2>
          <p>Club: {{ data.club_name ? data.club_name : "No club" }}</p>
          <p>Country: {{ data.country }}</p>
          <p>Date of Birth: {{ datestring }}</p>
          <p>Position: {{ data.position }}</p>
          <p>Foot: {{ data.foot }}</p>
          <p>Height (cm): {{data.height_in_cm}}</p>
          <p>Market Value (€): {{ data.market_value_in_eur ? Number(data.market_value_in_eur).toLocaleString(undefined) : "unknown" }}</p>
          <p>Max Market Value (€): {{ Number(data.highest_market_value_in_eur).toLocaleString(undefined) }}</p>
          <p>FIFA Rating: {{ stats ? stats.overall : 'Not Found' }}</p>
          <div v-if="stats !== null && stats.shooting !== null">
            <radar-chart :key="stats._id" :pace="stats.pace" :shooting="stats.shooting" :passing="stats.passing" :dribbling="stats.dribbling" :defending="stats.defending" :physic="stats.physic" />
          </div>
        </v-card-text>
    </v-card>
</template>

<script>
import RadarChart from './RadarChart'
export default {
  name: 'PlayerCard',
  components: {
    RadarChart
  },
  props: {  
    id: Number,
    name: String
  }
  ,
  data() {
    return {
        loading: false,
        post: null,
        error: null,
        data: null,
        datestring: null,
        stats: null,
    }
  },
  methods:{
    async sendMongoRequest(name) {
      const encodedName = encodeURIComponent(name);
      const url = `http://localhost:8081/players_fifa/${encodedName}`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
        });
        const data = await response.json();
        this.stats = data.data;
      } catch (error) {
        console.log(error);
        return { error };
      }
    },
    fetchData(id) {
      const config = require('../../config.json')
        fetch(
          `${config.backend_url}/player_id/${id}`
        ).then(

           res => {
            if (res.ok) {
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
                    image_url: ""
              }
            }
           }
        ).then(
           data => this.data = data
        ).then(() =>
          {
            const date = new Date(this.data.date_of_birth)
            this.datestring = date.toDateString()
          })
    },
    
  },
  mounted() {
    this.fetchData(this.id);
    this.sendMongoRequest(this.name);
  },
  watch: {
    id(newId) {
      this.fetchData(newId)
    },
    name(newName) {
      this.sendMongoRequest(newName);
    }
  }
}
</script>

<style scoped>
.custom-card {
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.3s ease;
}

.profile-picture {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  margin-top: 16px;
  border: 3px solid black;
}

.player-name {
  margin-top: 0px;
  margin-bottom: 0px;
}

.custom-card h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.text-white {
  color: #FFFFFF;
}

p {
  font-size: 16px;
  text-align: left;
}

.v-card-text {
  padding: 20px;
  margin: 3px 0;
}

.v-card-text p:first-of-type {
  margin-top: 0;
}

.v-card-text p:last-of-type {
  margin-bottom: 0;
}
</style>