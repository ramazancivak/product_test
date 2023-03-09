<template>
  <nav>
    <router-link to="/">Get Products and sub Products</router-link> |
    <router-link to="/customerPost">Get Customer and Post Persona</router-link> | 
    <router-link to="/customerLocationPost">Get Customer Location and Post Persona</router-link>
  </nav>
  <router-view/>
</template>

<script>

export default {
  data(){
    return{
      token:null
    }
  },
   mounted(){
      const vm=this
      this.axios({
            method:'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            url: this.baseUrl+this.wsUrl['authLogin'],
            data: {
              'pass':this.basePass
            }
      }).then(function (response) {
        vm.token=response.data.data[0].token;
      }).catch (function (error){
         console.log(error)
      })
      
      this.axios.interceptors.request.use(config => {
        //Tabiki burada token değerini local yada session storage gibi bir yerden okumamız gerekebilir
        config.data["token"] = vm.token;
        return config;
      });
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
