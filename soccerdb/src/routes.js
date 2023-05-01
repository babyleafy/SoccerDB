import HomePage from './views/HomePage.vue';
import PlayersPage from './views/PlayersPage.vue';
import ClubsPage from './views/ClubsPage.vue';
import TopPage from './views/TopPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/players',
    name: 'players',
    component: PlayersPage
  },
  {
    path: '/clubs',
    name: 'clubs',
    component: ClubsPage
  },
  {
    path: '/top',
    name: 'top',
    component: TopPage
  },
]

export default routes
