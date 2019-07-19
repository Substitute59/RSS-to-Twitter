<template>
    <div>
        <div v-show="feeds.length>0">
            <h3>Flux RSS</h3>
            <div v-for="(feed, index) in feeds" v-bind:key="index">
                <div>
                    <span>{{ feed.name }}</span>
                    <input type="checkbox" v-model="feed.active"
                        :checked="feed.active" :value="feed.active"
                        v-on:change="updateFeed(feed)"
                        title="Actif ?"/>
                    <span title="Supprimer le flux ?"
                          v-on:click="deleteFeed(feed.id)">X</span>
                    <div v-for="(item, idx) in feed.items" v-bind:key="idx">
                        {{ item.title + ':' + item.link }}
                    </div>
                </div>
            </div>
        </div>

        <div v-show="feeds.length==0">
            <p>
                <strong>Aucun flux</strong>
            </p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import parser from 'rss-parser-browser';

    import bus from './../bus.js'

    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"

    export default {
        data() {
            return {
                feeds: []
            }
        },
        created: function () {
            this.fetchFeed();
            this.listenToEvents();
        },
        methods: {
            fetchFeed() {
                let uri = 'http://localhost:4000/api/all';
                axios.get(uri).then((response) => {
                    this.feeds = response.data;
                    this.feeds.forEach(feed => {
                        parser.parseURL(CORS_PROXY + feed.url, (err, parsed) => {
                            if (!err && parsed) {
                                feed.items = parsed.feed.entries;
                            }
                        })
                    });
                });
            },

            updateFeed(feed) {
                let id = feed.id;
                let uri = 'http://localhost:4000/api/update/' + id;
                feed.editing = false;
                axios.post(uri, feed).then((response) => {
                    console.log(response);
                    this.fetchFeed();
                }).catch((error) => {
                    console.log(error);
                })
            },

            deleteFeed(id) {
                let uri = 'http://localhost:4000/api/delete/' + id;
                axios.get(uri).then((response) => {
                    console.log(response);
                    this.fetchFeed();
                }).catch((error) => {
                    console.log(error);
                })
            },

            listenToEvents() {
                bus.$on('refreshFeed', ($event) => {
                    this.fetchFeed(); //update feed
                })
            }
        }
    }
</script>
