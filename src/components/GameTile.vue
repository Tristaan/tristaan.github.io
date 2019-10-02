<template>
  <div :style="'background-image: url('+cover.replace('t_thumb', 't_cover_big')+')'" class="pure-u-4-24 game-tile">
    <div class="game-data">
      <div class="p-1">
        <h3> {{name}} </h3>
        <read-more
          more-str="read more"
          :text="about"
          link="#"
          less-str="read less"
          :max-chars="250">
        </read-more>

        <div>
          <a :href="officialUrl"><i class="fas fa-external-link-alt"></i> Official website</a>
          <a :href="igdbUrl"><i class="fas fa-external-link-alt"></i> IGDB</a>
        </div>
      </div>
      <progress-bar
        class="r-bar"
        :text="Math.round(rating) + '/100'"
        text-position="inside"
        text-fg-color="#fefefe"
        bar-color="#ffc439"
        size="huge"
        :val="Math.round(rating)"></progress-bar>
      <progress-bar
        class="p-bar"
        text="Completion"
        text-position="inside"
        text-fg-color="#fefefe"
        bar-color="#548eb9"
        size="huge"
        :val="completion"></progress-bar>
    </div>
  </div>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
import axios from 'axios'
export default {
  name: 'GameTile',
  data() {
    return {
      image: ''
    };
  },
  props: {
    cover: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'Game'
    },
    rating: {
      type: Number,
      default: 100
    },
    completion: {
      type: Number,
      default: 100
    },
    about: {
      type: String,
      default: 'About game'
    },
    officialUrl: {
      type: String,
      default: 'https://google.com'
    },
    igdbUrl: {
      type: String,
      default: 'https://www.igdb.com'
    },
    id: {
      type: Number,
      default: 0
    },
  },
  mounted () {
  },
  components: {
    ProgressBar
  }
}
</script>

<style lang="scss">
.p-1 {
  padding: 0.5rem;
}
.game-tile {
  a {
    color: #ffc439;
  }
  height: 500px;
  background-size: cover;
  position: relative;
  .game-data {
    overflow: hidden;
    position: relative;
    height: 0;
    width: 100%;
    transition: height ease .4s;
    background: rgba(0,0,0,0.6);
    color: #fefefe;
    .p-1 {
      box-sizing: border-box;
      height: 406px;
      overflow-y: scroll;
      p {
        margin: 0;
      }
      a {
        margin: 0.4rem;
      }
    }
    .p-bar {
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 10;
      color: #fefefe;
    }
    .r-bar {
      position: absolute;
      bottom: 46px;
      width: 100%;
      z-index: 10;
      color: #fefefe;
    }
  }
  &:hover {
    .game-data {
      height: 100%;
    }
  }
}
</style>
