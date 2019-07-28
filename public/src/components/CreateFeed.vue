<template>
    <section class="section">
        <div class="container">
            <h2 class="subtitle">Ajouter un flux RSS</h2>
            <form @submit.prevent>
                <div class="field">
                    <input class="input" type="text" @keypress="typing=true" placeholder="Nom" v-model="feed.name">
                </div>
                <div class="field">
                    <input class="input" type="text" @keypress="typing=true" placeholder="Url" v-model="feed.url">
                </div>
                <div class="field">
                    <input class="button" type="button" v-on:click="addFeed()" value="Ajouter">
                </div>
            </form>
        </div>
    </section>
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
