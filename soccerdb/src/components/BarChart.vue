<template>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </template>
  
<script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default {
    name: 'BarChart',
    components: { Bar },
    props: {
      labels: Array,
      data: Array
    },
    data() {
      return {
        chartData: {
          labels: this.labels,
          datasets: [ 
            { 
              label: "Selected Clubs",
              data: this.data } 
          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: true,
        }
      }
    },
    mounted() {
      console.log(this.labels)
      console.log(this.data)
      console.log('mounted!')
    }
  }
  </script>