<template>
  <div class="home">
    <subProduct class="float-left col-6" @startProduct="event($data)"/>
    <productTable class="float-left float-left" :startGetProduct="startGetProduct" :subProducts="subProductData"/>
  </div>
</template>

<script>
// @ is an alias to /src
import productTable from '@/components/productTable.vue'
import subProduct from '@/components/subProduct.vue'

export default {
  name: 'HomeView',
  components: {
    productTable,
    subProduct
  },
  data(){
    return{
      startGetProduct:false,
      subProductData:[]
    }
  },
  methods:{
    event(data){
      this.startGetProduct=true
      this.subProductData=data
    }
  },
  mounted() {
  }
}
</script>
<style>
.home>div{
  width:50%;
  float:left;
}
</style>
