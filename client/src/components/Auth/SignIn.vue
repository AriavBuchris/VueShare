<template>
    <v-container id="signin_text">
        <!-- SignIn Title -->
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <h1>Welcome Back!</h1>
            </v-flex>
        </v-layout>
        <!-- Error Alert -->
        <v-layout v-if="error" row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <form-alert :message="error.message"></form-alert>
            </v-flex>
        </v-layout>
        <!-- SignIn Form -->
        <v-layout row wrap>
            <v-flex xs12 sm6 offset-sm3>
                <v-card color="accent" dark>
                    <v-container ma-3>
                        <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="handleSigninUser">
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Password" type="password" required></v-text-field>
                                </v-flex>
                            </v-layout>
                            <v-layout row>
                                <v-flex xs12>
                                    <v-btn :loading="loading" :disabled="!isFormValid || loading" color="secondary" type="submit">Sign In</v-btn>
                                        <template v-slot:loader>
                                            <span class="custom-loader">
                                                <v-icon light>cached</v-icon>
                                            </span>
                                        </template>
                                    <h3>Don't have an account?
                                        <router-link to="/signup">Sign Up</router-link>
                                    </h3>
                                </v-flex>
                            </v-layout>
                        </v-form>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'SignIn',
    data() {
        return {
            isFormValid: true,
            username: "",
            password: "",
            usernameRules: [
                username => !!username || "Username is required",
                username => username.length < 10 || "Username must be less than 10 characters"
            ],
            passwordRules: [
                password => !!password || "Password is required",
                password => password.length >= 4 || "Password must be at least 4 characters"
            ]
        };
    },
    computed: {
        ...mapGetters(["loading", "user", "error"])
    },
    watch: {
        user(value) {
            // watch for when user state changes redirect to home page
            if (value) {
                this.$router.push('/');
            }
        }
    },
    methods: {
        handleSigninUser() {
            if (this.$refs.form.validate()) {
                this.$store.dispatch('signinUser', {
                    username: this.username,
                    password: this.password
                })
            }
        }
    }
}
</script>

<style>
#signin_text {
    text-align: center;
}
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}
@-moz-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@-webkit-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@-o-keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
@keyframes loader {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>