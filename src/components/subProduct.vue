<template>
  <div class="hello">
    <div>
      Toplam Alt Ürün : {{ subProducts.totalCount }}<br/>
      Yüklenen Alt Ürün Sayısı : {{ subProducts.data.length }}
    </div>
    <table>
      <th>Main Ürün ID</th>
      <th>Property1</th>
      <th>Property2</th>
    </table>
    <div style="height:700px; overflow:auto">
      <table v-if="subProducts.data.length>0">
        <tr v-for="subP in subProducts.data" :key="subP.id">
          <td>{{ subP.MainProductId }}</td>
          <td>{{ subP.Property1 }}</td>
          <td>{{ subP.Property2 }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'productTable',
  data(){
    return{
      subProducts:{
        data:[],
        totalCount:''
      },
      start:0
    }
  },
  methods:{
     getSubProduct(){
        const vm = this;
        this.axios({
          method: 'post',
          url: this.baseUrl+this.wsUrl['getSubProduct'],
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
            'limit' : 500,
            'start' : this.start
          }
        }).then(function (response) {
          if(!response.data.success){
            vm.getSubProduct()
          }else{
            if(response.data.data){
              vm.subProducts.data.push(...response.data.data)
              vm.subProducts.totalCount=response.data.summary.totalRecordCount
              vm.start=vm.start+500
              vm.getSubProduct()
            }else{
              vm.$emit('startProduct',vm.subProducts.data)
              return false
            }
          }
        }).catch((error) => {
          console.log(error)
        }); 
    }
  },
  created(){
    this.getSubProduct();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
