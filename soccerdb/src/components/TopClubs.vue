<template>
    <div>
      <div class="button-container">
        <button class="rounded-button goals-button" @click="getTopClubs('goals')">Goals</button>
        <button class="rounded-button value-button" @click="getTopClubs('value')">Value</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Club ID</th>
            <th>Club Name</th>
            <th>{{ orderBy }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(club, index) in clubs" :key="index">
            <td>{{ club.club_id }}</td>
            <td>{{ club.club_name }}</td>
            <td>{{ club[orderBy] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TopClubs',
    data() {
      return {
        clubs: [],
        orderBy: '',
      };
    },
    methods: {
      getTopClubs(orderBy) {
        this.orderBy = orderBy;
        fetch(`http://localhost:8081/top_clubs/${orderBy}?page=10`)
          .then((response) => response.json())
          .then((data) => {
            this.clubs = data;
          })
          .catch((error) => {
            console.error(error);
          });
      },
    },
  };
  </script>
  
  <style>
  .rounded-button {
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: bold;
    margin-right: 10px;
  }
  
  .goals-button {
    background-color: blue;
    color: white;
  }
  
  .value-button {
    background-color: green;
    color: white;
  }
  </style>
  