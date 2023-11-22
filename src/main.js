import Vue from 'vue'
import GameList from './components/GameList'
import ReadMore from 'vue-read-more';

Vue.use(ReadMore);
Vue.component('gameList', GameList)

const app = new Vue({
  el: '#app'
})

