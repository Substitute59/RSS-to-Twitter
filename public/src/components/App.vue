<template>
    <div id="app">
        <div>
            <div>
                <create-feed></create-feed>
                <div>
                    <list-feed></list-feed>
                </div>
            </div>
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
