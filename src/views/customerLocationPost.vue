<template>
  <div class="about">
    <h1>Toplam Üye Sayısı {{totalRecordCount}}</h1>
    <div v-if="customers.length>0">
      Yüklenen Üye Sayısı : {{ customers.length }}
      | Location Eklenen Üye Sayısı {{ countForLocation }}
    </div>
    <div v-else>
      Henüz Üye yüklenmedi
    </div>
    <!-- <table>
      <th>Customer ID</th>
      <th>Email</th>
      <th>Location</th>
    </table>
    <div style="height:700px; overflow:auto">
      <table v-if="customers.length>0">
        <tr v-for="user in customers" :key="user.id">
          
          <td>{{ user.id }}</td>
          <td>{{ user.email }}</td>
          <td v-if="user.location">{{ user.location }}</td>
        </tr>
      </table>
    </div> -->
  </div>
</template>
<script>

export default {
  data(){
    return{
      customers: [] ,
      autPass : {'pass': "159753"},
      start:0,
      totalRecordCount:0,
      countForLocation:0
    }
  },
  methods:{
    async getCustomer(){
      const vm = this;
      await this.axios({
        method:'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: this.baseUrl+this.wsUrl['getCustomers'],
        data: {
          'limit' : 500,
          'start' : vm.start,
          'columns' : 'CustomerId,Email'
        }
      }).then(function (response) {
        vm.totalRecordCount=response.data.summary.totalRecordCount;
        if(vm.customers.length == vm.totalRecordCount){
           vm.startLocation()
          // localStorage.setItem("dataCustomer", JSON.stringify(vm.customers))
          // window.location.assign("/customerLocationPersona")

        }else{
          let getUsers=response.data.data;
          let count=0;
           for(let i=0; i<getUsers.length&&count==i; i++){
              let dataUser={};
            
              if (getUsers[i].Email != ""){
                dataUser.email= getUsers[i].Email;
              }
              if (getUsers[i].CustomerId != ""){
                dataUser.id= getUsers[i].CustomerId;
              }
              vm.customers.push(Object.assign({}, dataUser));
              count++;
           }
           
          vm.start = vm.start+500;
          vm.getCustomer()

          
        }
      }).catch (function (error){
         console.log(error)
      })
    },
    async startLocation(){

        const vm = this;
        let count=0;
        for(let i=0; i<vm.customers.length&&count==i; i++){
          await this.axios({
            method:'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            url: vm.baseUrl+vm.wsUrl['getAddress'],
            data: {
              'CustomerId' : vm.customers[i].id
            }
          }).then(function (response) {
            count++;
            vm.countForLocation++;
            if(response.data.data!=[] && response.data.data[0]){
              vm.customers[i].location = response.data.data[0].City;
            }
          })
        }
        
    },
    async postUsersPersona(data){
      // // POST USERS DATA
      await this.axios({
        method:'post',
        headers: { 'Content-Type': 'application/json' },
        url: 'https://api.personaclick.com/import/audience',
        data: {
          'shop_id' : "c52f7f623d3a331db405c59d1c8e12",
          'shop_secret' : "696a905c819f9dd9ed0f6b2c90856fe9",
          'audience' : data
        }
      }).then(function (response) {
        console.log("Persona post başarılı ")
        console.log(response);
      }).catch (function (error){
        console.log(error)
      })
    }
  },
  watch:{
    countForLocation(val){
      if(val==this.totalRecordCount){
        // Locasyon yükleme işlemi tamamlandığında personaya post et
        let postLimit=1000;
        let page = val/postLimit;
        for(let i=0; i<page; i++){
          let start = i * postLimit;
          // 1000 kullanıcı personaya post ediliyor.
          console.log(start +"ile" + (start+postLimit) + "arasındaki veriler post edilecek")
          this.postUsersPersona(this.customers.slice(start,start+postLimit))
        }
      }
    }
  },
  mounted(){
    setTimeout(()=>{
      this.getCustomer()
    },2000)
  }
}
</script>