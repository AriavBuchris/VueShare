import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/lib/util/colors';

// use theme-generator.vuetifyjs.com or colors.co to design and export theme
Vue.use(Vuetify, { 
    theme: {
        primary: colors.teal.lighten1,
        secondary: colors.teal.lighten3,
        accent: colors.red.lighten1,
        error: colors.red.accent1,
        warning: colors.amber.base,
        info: colors.blue.accent3,
        success: colors.green.darken1
    }
});

export default new Vuetify({});