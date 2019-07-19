<template>
    <div>
        <h2>Ajouter un flux RSS</h2>
        <form @submit.prevent>
            <div>
                <input type="text" @keypress="typing=true" placeholder="Nom" v-model="feed.name">
                <input type="text" @keypress="typing=true" placeholder="Url" v-model="feed.url">
                <input type="button" v-on:click="addFeed()" value="Ajouter">
            </div>
        </form>
    </div>
</template>

<script>
    import axios from 'axios';
    import bus from "./../bus.js";

    export default {
        data() {
            return {
                feed: {},
                typing: false,
            }
        },
        methods: {
            addFeed() {
                let url = 'http://localhost:4000/api/add';
                let param = {
                    name: this.feed.name,
                    url: this.feed.url,
                    active: 1
                };
                axios.post(url, param).then((response) => {
                    console.log(response);
                    this.clearFeed();
                    this.refreshFeed();
                    this.typing = false;
                }).catch((error) => {
                    console.log(error);
                })
            },
            clearFeed() {
                this.feed = {};
            },
            refreshFeed() {
                bus.$emit("refreshFeed");
            }
        }
    }
</script>
