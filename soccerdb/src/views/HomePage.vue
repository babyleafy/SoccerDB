<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <v-carousel cycle height="400" hide-delimiter-background show-arrows="hover">
      <v-carousel-item v-for="(slide, i) in slides" :key="i" @click="onCarsouelClick(slides[i])">
        <v-sheet :color="colors[i]" height="100%">
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
        colors: [
          'indigo',
          'warning',
          'pink darken-2',
          'red lighten-1',
        ],
        slides: [
          'Players',
          'Clubs',
          'Matches',
          'Top'
        ],
        routes: [
          'players',
          'clubs',
          'matches',
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
