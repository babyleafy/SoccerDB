<template>
  <h1>⚽️ Welcome to SoccerDB ⚽️</h1>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <v-carousel cycle height="400" hide-delimiter-background show-arrows="hover">
      <v-carousel-item v-for="(slide, i) in slides" :key="i" @click="onCarsouelClick(slides[i])">
        <v-sheet :style="{ backgroundImage: 'url(' + images[i] + ')' }" width="100%" height="100%">
          <div class="d-flex fill-height justify-center align-center" >
            <div class="text-h2">
              {{ slide }}
            </div>
          </div>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  props: {
    msg: String
  },

  data () {
      return {
        images: [
        'https://w0.peakpx.com/wallpaper/456/247/HD-wallpaper-casemiro-brazilian-soccer-player-real-madrid-midfielder-white-stone-background-la-liga-spain-football-carlos-henrique-casimiro.jpg', 
        'https://dailypost.ng/wp-content/uploads/2021/04/manchester-city-bayern-munich-real-madrid-liverpool-psg-barcelona.jpg', 
        'https://www.10wallpaper.com/wallpaper/1366x768/1512/Cristiano_Ronaldo-FIFA_BALLON_DOR_2015_Wallpaper_01_1366x768.jpg'],
        slides: [
          'Players',
          'Clubs',
          'Top'
        ],
        routes: [
          'players',
          'clubs',
          'top'
        ],
      }
    },
    methods: {
      onCarsouelClick(i) {
        this.$router.push(`/${i}`)
      }
    }
}
</script>

<style scoped>
  h1 {
    text-align: center;
    font-size: 3rem;
    margin: 3rem;
  }

  .text-h2 {
    font-family: "Arial Rounded MT Bold", Arial, sans-serif;
    font-weight: bold;
    font-size: 2rem;
    color: white;
    border-radius: 20px;
  }

  v-sheet {
    background-size: cover;
  }
</style>