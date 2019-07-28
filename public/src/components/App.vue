<template>
    <div id="app">
        <div class="container">
            <section class="hero">
                <div class="hero-body">
                    <div class="container">
                        <h1 class="title has-text-centered">RSS to Twitter</h1>
                    </div>
                </div>
            </section>
            <create-feed></create-feed>
            <list-feed></list-feed>
        </div>
    </div>
</template>

<script>
    import CreateFeed from './CreateFeed.vue';
    import ListFeed from './ListFeed.vue';

    export default {
        name: 'app',
        components: {CreateFeed, ListFeed},
    }
</script>
