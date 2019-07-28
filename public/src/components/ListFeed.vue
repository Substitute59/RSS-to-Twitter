<template>
    <section class="section">
        <div class="container">
            <div v-show="feeds.length>0">
                <h2 class="subtitle">Flux RSS</h2>
                <nav class="panel">
                    <div class="panel-block" v-for="(feed, index) in feeds" v-bind:key="index">
                        <feed v-bind:feed="feed"></feed>
                    </div>
                </nav>
            </div>

            <div v-show="feeds.length==0">
                <p>
                    <strong>Aucun flux</strong>
                </p>
            </div>
        </div>
    </section>
</template>

<script>
    import axios from 'axios';

    import bus from './../bus.js';
    import Feed from './Feed.vue';

    export default {
        components: {Feed},
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
                });
            },

            listenToEvents() {
                bus.$on('refreshFeed', ($event) => {
                    this.fetchFeed(); //update feed
                })
            }
        }
    }
</script>
