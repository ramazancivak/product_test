import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

/* STATIC VERIABLE */

const globalVeriable = {
    data(){
        return{
            baseUrl:'https://shop.dijitall.net/',
            basePass:'159753',
            wsUrl:{
                'authLogin':'rest1/auth/login/dijitall',
                'getSubProduct':'rest1/subProduct/getSubProducts',
                'getProducts':'rest1/product/get',
                'getCategories':'rest1/category/getCategories',
                'getCustomers':'rest1/customer/getCustomers',
                'getAddress':'rest1/customer/getAddress'
            },
            personaSettings:{
                'storeKey':'3f7cb1dd356e09ce39e84e80db3de3',
                'secretKey':'cb0c8d3b67b8f5fa7a2083c676e6e801'
            }
        }
    }
}
createApp(App)
    .mixin(globalVeriable)
    .use(store)
    .use(VueAxios, axios)
    .use(router)
.mount('#app')
