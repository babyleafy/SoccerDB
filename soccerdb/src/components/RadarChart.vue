<template>
  <div class="chart-container">
    <canvas ref="radarChart"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'RadarChart',
  props: {
    pace: { type: Number, required: true },
    shooting: { type: Number, required: true },
    passing: { type: Number, required: true },
    dribbling: { type: Number, required: true },
    defending: { type: Number, required: true },
    physic: { type: Number, required: true },
  },
  data() {
    return {
      chartInstance: null,
    }
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy()
      }
      const ctx = this.$refs.radarChart.getContext('2d')
      this.chartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defense', 'Physical'],
          datasets: [
            {
              label: 'Stats',
              data: [this.pace, this.shooting, this.passing, this.dribbling, this.defending, this.physic],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scale: {
            ticks: {
              stepSize: 10,
              values: [20, 30, 40, 50, 60, 70, 80, 90, 99],
              
            },
          },
        },
      })
    },
  },
}
</script>

<style scoped>
canvas {
  width: 80%;
  height: 80%;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
