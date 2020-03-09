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
                        <div>Joined {{ formatJoinDate(user.joinDate) }}</div>
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
                        <img @click="goToPost(favorite._id)" style="padding: 20px" height="200px" :src="favorite.imageUrl">
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
                        <v-btn @click="loadPost(post)" class="mt-3" color="info" floating fab small dark>
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn @click="handleDeleteUserPost(post)" class="mt-3" color="error" floating fab small dark>
                            <v-icon>delete</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <img @click="goToPost(post._id)" style="padding: 10px" height="200px" :src="post.imageUrl">
                        <v-card-text>{{ post.title }}</v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- Edit Post Dialog -->
        <v-dialog xs12 sm6 offset-sm3 persistent v-model="editPostDialog">
            <v-card>
                <v-card-title class="headline grey lighten-2">Update Post</v-card-title>
                <v-container>
                    <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleUpdateUserPost">
                        <v-layout row>
                            <v-flex xs12>
                                <v-text-field :rules="titleRules" v-model="title" label="Post title" type="text" required></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs12>
                                <v-text-field :rules="imageRules" v-model="imageUrl" label="Image URL" type="text" required></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs12>
                                <img :src="imageUrl" height="300px">
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs12>
                                <v-select v-model="categories" :rules="categoriesRules" :items="['Art', 'Education', 'Travel', 'Photography', 'Technology', 'Food']" multiple label="Categories"></v-select>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs12>
                                <v-textarea :rules="descRules" v-model="description" label="Description" type="text" required></v-textarea>
                            </v-flex>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn :disabled="!isFormValid" type="submit" class="success--text" text>Update</v-btn>
                            <v-btn class="error--text" text @click="editPostDialog = false">Cancel</v-btn>
                        </v-card-actions>
                    </v-form>
                </v-container>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
    name: 'Profile',
    data() {
        return {
            editPostDialog: false,
            isFormValid: true,
            title: "",
            imageUrl: "",
            categories: "",
            description: "",
            titleRules: [
                title => !!title || 'Title is required',
                title => title.length < 20 || 'Title must have less than 20 characters'
            ],
            imageRules: [
                image => !!image || 'Image is required'
            ],
            categoriesRules: [
                categories => categories.length >= 1 || 'At least one category is required'
            ],
            descRules: [
                desc => !!desc || 'Description is required',
                desc => desc.length < 200 || 'Title must have less than 200 characters'
            ]
        }
    },
    computed: {
        ...mapGetters(["user", "userFavorites", "userPosts"])
    },
    created() {
        this.handleGetUserPosts();
    },
    methods: {
        goToPost(id) {
            this.$router.push(`/posts/${id}`);
        },
        handleGetUserPosts() {
            this.$store.dispatch('getUserPosts', {
                userId: this.user._id
            });
        },
        formatJoinDate(date) {
            return moment(new Date(date)).format('ll');
        },
        handleUpdateUserPost() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('setUserPost', {
                    postId: this.postId,
                    userId: this.user._id,
                    title: this.title,
                    imageUrl: this.imageUrl,
                    categories: this.categories,
                    description: this.description
                });
                this.editPostDialog = false;
            }
        },
        loadPost({ _id, title, imageUrl, categories, description }, editPostDialog = true) {
            this.editPostDialog = editPostDialog;
            this.postId = _id;
            this.title = title;
            this.imageUrl = imageUrl;
            this.categories = categories;
            this.description = description;
        },
        handleDeleteUserPost(post) {
            this.loadPost(post, false);
            const deletePost = window.confirm('Are you sure you want to delete this post?');
            if (deletePost) {
                this.$store.dispatch('deleteUserPost', {
                    postId: this.postId
                });
            }
        }
    }
}
</script>