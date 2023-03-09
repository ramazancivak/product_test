<template>
  <div class="about">
    <h1>Toplam Üye Sayısı {{totalRecordCount}}</h1>
    <div v-if="customers.length>0">
      
      Yüklenen Ürün Sayısı : {{ customers.length }}
      TR Üye Sayısı : {{ customers.filter(user=>user.lang=='tr').length  }} --------- {{ customers.filter(user=>user.lang=='tr' && user.email_bulk=='true').length }}
      EN Üye Sayısı : {{ customers.filter(user=>user.lang=='en').length  }} --------- {{ customers.filter(user=>user.lang=='en' && user.email_bulk=='true').length }}
      FR Üye Sayısı : {{ customers.filter(user=>user.lang=='fr').length  }} --------- {{ customers.filter(user=>user.lang=='fr' && user.email_bulk=='true').length }}
    </div>
    <div v-else>
      Henüz ürün yüklenmedi
    </div>
    <table>
      <th>Customer ID</th>
      <th>Email</th>
      <th>Telefon</th>
      <th>Sipariş</th>
      <th>Ad Soyad</th>
      <th>Dil</th>
    </table>
     <div style="height:700px; overflow:auto">
      <table v-if="customers.length>0">
        <tr v-for="product in customers" :key="product.id">
          
          <td>{{ product.id }}</td>
          <td>{{ product.email }}</td>
          <td>{{ product.phone }}</td>
          <td>{{ product.bought_something }}</td>
          <td>{{ product.first_name + "" + product.last_name }}</td>
          <td>{{ product.lang }}</td>
        </tr>
      </table>
    </div> 
  </div>
</template>

<script>
export default {
  data(){
    return{
      customers: [],
      start:0,
      totalRecordCount:0,
    }
  },
  methods:{
    getAge(val){
      const todayDate = new Date();
      const birthday = new Date(val)

      let todayYear = todayDate.getFullYear();
      let todayMonth = todayDate.getMonth();
      let todayDay = todayDate.getDate();
      let age = todayYear - birthday.getFullYear();
      
      if (todayMonth < birthday.getMonth())
      {
        age--;
      }
      if (birthday.getMonth()== todayMonth && todayDay < birthday.getDate())
      {
        age--;
      }

      return age;
    },
    async getCustomer(){
      const vm = this;
      await this.axios({
        method:'post',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        url: this.baseUrl+this.wsUrl['getCustomers'],
        data: {
          'limit' : 500,
          'start' : vm.start,
        }
      }).then(function (response) {
        vm.totalRecordCount=response.data.summary.totalRecordCount;
        if(vm.start > response.data.summary.totalRecordCount){

          return false

        }else{
          let newDataAll=[];
          let newDataBulten=[];
          let newDataZiyaretci=[];
          let getUsers=response.data.data;
          getUsers.map(function(user) {

            let dataUser={};

            const age 		= vm.getAge(user.Birthdate);
            const gender		= user.Gender == "2" ? "f":"m";
            if (user.Email != ""){
              dataUser.email= user.Email;
            }
            if (user.OrderCount > 0){
              dataUser.bought_something= true;
            }else{
              dataUser.bought_something= false;
            }
            if (user.Language != ""){
              dataUser.lang= user.Language;
            }
            if (user.Mobile != ""){
              dataUser.phone= user.Mobile;
            }
            if (user.CustomerId != ""){
              dataUser.id= user.CustomerId;
            }
            if (user.Gender != "0"){
              dataUser.gender= gender;
            }
            if (user.Name != ""){
              dataUser.first_name= user.Name;
            }
            if (user.Surname != ""){
              dataUser.last_name= user.Surname;
            }
            if (user.Email != ""){
              dataUser.phone= user.Mobile;
            }
            if (user.Birthdate != "0000-00-00"){
              dataUser.birthday = user.Birthdate.split(" ")[0];
            }
            if (user.Birthdate!= "0000-00-00" && age > 15){
              dataUser.age = age;
            }
            
            dataUser.email_bulk= user.IsEmailNotificationOn;
            dataUser.email_chain= user.IsEmailNotificationOn;
            dataUser.sms_bulk= user.IsSmsNotificationOn;
            dataUser.sms_chain= user.IsSmsNotificationOn;
            dataUser.sms_transactional= user.IsSmsNotificationOn;
            
            vm.customers.push(Object.assign({}, dataUser));
            
            newDataAll.push(Object.assign({}, dataUser))
            
            if(user.CustomerGroupCode=='TE2'){
              newDataBulten.push(Object.assign({}, dataUser))
            }
            if(user.CustomerGroupCode=='TZ0'){
              newDataZiyaretci.push(Object.assign({}, dataUser))
            }
          });
          // 500 kullanıcı personaya post ediliyor.
          if(newDataAll.length>0){
            vm.postUsersPersona(newDataAll,'9351') // Tüm kullanıcılar segmenti
          }
          if(newDataBulten.length>0){
            vm.postUsersPersona(newDataBulten,'10416') // Tüm kullanıcılar segmenti
          }
          if(newDataZiyaretci.length>0){
            vm.postUsersPersona(newDataZiyaretci,'10415') // Tüm kullanıcılar segmenti
          }
          vm.start = vm.start+500;
          vm.getCustomer()
        }
      }).catch (function (error){
         console.log(error)
      })
    },
    async postUsersPersona(data,segmentid){
      console.log(data,segmentid)
      // POST USERS DATA
      // const vm=this;
      // await vm.axios({
      //   method:'post',
      //   headers: { 'Content-Type': 'application/json' },
      //   url: 'https://api.personaclick.com/import/audience',
      //   data: {
      //     'shop_id' : "ac0063b0ac1331c30ee29421b7439e",
      //     'shop_secret' : "2879fb04a8843e1de9997b210219cc3a",
      //     'segment_id' : segmentid,
      //     'audience' : data
      //   }
      // }).then(function (response) {
      //   console.log("Persona post başarılı ")
      //   console.log(response);
        
      // }).catch (function (error){
      //   console.log(error)
      // })
    }
    
  },
  mounted(){
    setTimeout(()=>{
      this.getCustomer()
    },2000)
  }
}
</script>