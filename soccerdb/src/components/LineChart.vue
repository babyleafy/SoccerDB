<template>
    <h1> {{title}} </h1>
    <Line :data="data" :options="options" />
</template>

<script>

const data = {
        datasets: [
            {
            label: "MESSI",
            data: [{
                x: '2021-03-05 23:39:30',
                y: 50
            }, {
                x: '2021-08-05 01:00:28',
                y: 60
            }, {
                x: '2021-11-07 09:00:28',
                y: 20
            }]
        }],
    }

const options = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'year',
                    tooltipFormat: 'YYYY'
                }
            }
  }
}

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,

} from 'chart.js'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-moment'

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
    name: "LineChart",
    components: {
        Line
    },
    props: {
        title: String
    },
    emits: [
        "fetchData",
    ],
    data() {
        return {data, options}
    },
    methods: {
        setData(d) {
            this.data = d
        }
    },
    mounted() {
        this.$emit("fetchData", (d) => this.setData(d))
        console.log('MOUNTED')
        console.log(this.data)
    }
}
</script>