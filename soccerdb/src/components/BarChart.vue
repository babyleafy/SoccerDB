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
              data: this.data,
              backgroundColor: [ 'rgba(54, 162, 235, 0.2)'],
              borderColor: ['rgb(75, 192, 192)',],
            },

          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            x: {
                title: {
                  display: true,
                  text: 'Clubs'
                }
            },
            y: {
              title: {
                display: true,
                text: 'Trophies Won'
              }
            }
  }
        }
      }
    }
  }
  </script>