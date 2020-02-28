<template>
    <v-container text-center>
        <!-- User details card -->
        <v-flex sm6 offset-sm3>
            <v-card class="white--text" color="secondary">
                <v-layout style="padding: 10px">
                    <v-flex xs5>
                        <img height="125px" :src="user.avatar">
                    </v-flex>
                    <v-flex xs7 primary-title>
                        <div class="headline">{{ user.username }}</div>
                        <div>Joined {{ user.joinDate }}</div>
                        <div class="hidden-xs-only font-weight-regular">{{ user.favorites.length }} Favorites</div>
                        <div class="hidden-xs-only font-weight-regular">{{ userPosts.length }} Posts Added</div>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>

        <!-- Posts favorited by user -->
        <v-container class="mt-3" v-if="!userFavorites.length">
            <v-layout row wrap>
                <v-flex xs12>
                    <h2>You have no favorites currently. Go and add some!</h2>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container class="mt-3" v-else>
            <v-flex xs12>
                <h2 class="font-weight-light">Favorited
                    <span class="font-weight-regular">{{ userFavorites.length }}</span>
                </h2>
            </v-flex>
            <v-layout row wrap>
                <v-flex xs12 sm6 v-for="favorite in userFavorites" :key="favorite._id">
                    <v-card class="mt-3 ml-1 mr-2" hover>
                        <img style="padding: 20px" height="200px" :src="favorite.imageUrl">
                        <v-card-text>{{ favorite.title }}</v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- Posts created by user -->
        <v-container v-if="!userPosts.length">
            <v-layout row wrap>
                <v-flex xs12>
                    <h2>You have no posts currently. Go and add some!</h2>
                </v-flex>
            </v-layout>
        </v-container>
        <v-container class="mt-3" v-else>
         <v-flex xs12>
                <h2 class="font-weight-light">Your Posts
                    <span class="font-weight-regular">{{ userPosts.length }}</span>
                </h2>
            </v-flex>
            <v-layout row wrap>
                <v-flex xs12 sm6 v-for="post in userPosts" :key="post._id">
                    <v-card class="mt-3 ml-1 mr-2" hover>
                        <v-btn class="mt-3" color="info" floating fab small dark>
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn class="mt-3" color="error" floating fab small dark>
                            <v-icon>delete</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <img style="padding: 10px" height="200px" :src="post.imageUrl">
                        <v-card-text>{{ post.title }}</v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Profile',
    computed: {
        ...mapGetters(["user", "userFavorites", "userPosts"])
    },
    created() {
        this.handleGetUserPosts();
    },
    methods: {
        handleGetUserPosts() {
            this.$store.dispatch('getUserPosts', {
                userId: this.user._id
            });
        }
    }
}
</script>