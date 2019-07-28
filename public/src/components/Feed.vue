<template>
  <div>
    <label class="checkbox">
      <input type="checkbox" v-model="feed.active"
      :checked="feed.active" :value="feed.active"
      v-on:change="updateFeed()"
      title="Actif ?">
    </label>
    <span class="feed-name" v-on:click="showFeed()">{{ feed.name }}</span>
    <div class="lds-ellipsis" v-bind:class="{ 'is-hidden': isHidden }"><div></div><div></div><div></div><div></div></div>
    <span class="delete is-pulled-right" title="Supprimer le flux ?"
      v-on:click="deleteFeed()"></span>
    <div class="modal" v-bind:class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box">
          <ul>
            <li v-for="(item, idx) in items" v-bind:key="idx">
              &bull; <a v-bind:href="item.link" target="_blank">{{ item.title }}</a>
            </li>
          </ul>
        </div>
      </div>
      <button v-on:click="closeFeed()" class="modal-close is-large" aria-label="close"></button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import parser from 'rss-parser-browser';

  import bus from './../bus.js';

  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

  export default {
    props: ['feed'],
    data() {
      return {
        isActive: false,
        isHidden: true,
        items: []
      }
    },
    methods: {
      updateFeed() {
        let id = this.feed.id;
        let uri = 'http://localhost:4000/api/update/' + this.feed.id;
        this.feed.editing = false;
        axios.post(uri, this.feed).then((response) => {
          console.log(response);
          bus.$emit("refreshFeed");
        }).catch((error) => {
          console.log(error);
        })
      },

      deleteFeed() {
        let uri = 'http://localhost:4000/api/delete/' + this.feed.id;
        axios.get(uri).then((response) => {
          console.log(response);
          bus.$emit("refreshFeed");
        }).catch((error) => {
          console.log(error);
        })
      },

      showFeed() {
        this.isHidden = false;
        parser.parseURL(CORS_PROXY + this.feed.url, (err, parsed) => {
          if (!err && parsed) {
            this.items = parsed.feed.entries;
            this.isActive = true;
            this.isHidden = true;
          }
        })
      },

      closeFeed() {
        this.isActive = false;
      }
    }
  }
</script>

<style>
  .lds-ellipsis {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 11px;
  }
  .lds-ellipsis div {
    position: absolute;
    top: 0;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: rgba(10,10,10,.2);
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: 6px;
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: 6px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: 26px;
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: 45px;
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(19px, 0);
    }
  }
  .panel-block > div {
    width: 100%;
  }
  .feed-name {
    cursor: pointer;
  }
</style>
