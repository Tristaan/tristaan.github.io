<template>
  <section class="holder">
    <div class="l-holder"v-if="loaded == 0">
      <div class="loader"></div>
    </div>
    <div class="pure-g" v-if="loaded > 1">
      <game-tile
        v-for="game in games"
        :key="game.id"
        :cover="game.cover.url"
        :name="game.name"
        :rating="game.rating"
        :completion="100"
        :about="game.summary"
        :officialUrl="game.website"
        :igdbUrl="game.url"
        :id="game.id"
        ></game-tile>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import GameTile from './GameTile'
export default {
  name: 'GameList',
  data() {
    return {
      games: [],
      loaded: 0
    };
  },
  mounted() {
    var gs=[
      '740,991,987,986,498,6032,1011,706,273,25391',
      '5809,286,356,333,4575,4576,8290,1015,1016,2606',
      '77344,4156,4083,528,6273,846,320,923,922,897',
      '820,338,247,233,10395,71,72,130,131,9550',
      '5904,284,569,281,9192,280,7351,673,819,730',
      '733,3823,7893,5901,7894,4122,3811'
    ];
    for(var i=0; i<6; i++) {
      this.getGames(gs[i])
    }
  },
  methods: {
    getGames(ids) {
        axios({
          url: "https://cors-anywhere.herokuapp.com/"+"api-v3.igdb.com:443/games",
          method: 'POST',
          cors: false,
          headers: {
            'Accept': 'application/json',
            'Host': 'http://lh.me:4000',
            'user-key': 'aca2fc15ea2a22bf67a5791c0c2820e8'
          },
          data: "fields cover.*,websites.*,first_release_date,name,rating,slug,summary,url; where id=("+ids+") & websites.category = 1;"
        })
          .then(response => {
            var curr = response.data.map(v => {
              var url = v.websites.reduce((a,w) => {
                if(w.category == 1 || w.category == 13) { return w.url; }

              });
              if(url == undefined) {
                url = v.websites[0].url;
              }
              if(typeof v.websites === 'object') {
                url = v.websites.url;
              }
              v.website = url;
              return v;
            });

            this.games = this.games.concat(curr);
            console.log(this.games);
            this.loaded++;
            this.$forceUpdate();
          })
          .catch(err => {
            console.error(err);
          });
    },
  },
  components: { GameTile }
}
</script>

<style scoped lang="scss">
.l-holder {
  flex: 1;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
}
.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
h1 {
  color: darkslategrey;
  font-size: 2rem;
}
</style>
