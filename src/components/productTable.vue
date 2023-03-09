<template>
  <div class="hello">
    <div v-if="startGetProduct">
      Toplam Ürün : {{ products.totalCount }}<br/>
      Yüklenen Ürün Sayısı : {{ products.data.length }}
    </div>
    <div v-else>
      
      Henüz alt ürün yüklenmedi
    </div>
    <table>
      <th>Ürün ID</th>
      <th>Property1</th>
      <th>Property2</th>
    </table>
    <div style="height:700px; overflow:auto">
      <table v-if="products.data.length>0">
        <tr v-for="product in products.data" :key="product.id">
          <td>{{ product.ProductId }}</td>
          <td>{{ product.ProductName }}</td>
          <td>{{ product.SeoLink }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>

export default {
  name: 'productTable',
  props: ['subProducts','startGetProduct'],
  data(){
    return{
      products:{
        data:[],
        totalCount:''
      },
      productContent:'',
      start:0
    }
  },
  methods:{
    postCategories(cats){
      const vm=this;
      const postDataCats=[]
      cats.map(function(cat){
        let pushCats={};
        pushCats['id']=cat.CategoryId;
        pushCats['name']=cat.CategoryId;
        if(cat.ParentCode!=0){
          pushCats['parent']=cat.ParentCode;
        }
        pushCats['url']=vm.baseUrl+cat.SeoLink;
        postDataCats.push(pushCats)
      });
      // KATEGORİLER PERSONAYA POST EDİLİYOR
      vm.axios({
        method:'post',
        headers: { 'Content-Type': 'application/json' },
        url: 'https://api.personaclick.com/import/categories',
        data: {
          'shop_id' : this.personaSettings['storeKey'],
          'shop_secret' : this.personaSettings['secretKey'],
          'categories' : postDataCats
        }
      }).then(function (response) {
        console.log("Persona katalog post başarılı ")
        console.log(response);
        
      }).catch (function (error){
        console.log(error)
      })
    },
    postProducts(){
      const vm=this;
      const postDataProducts=[]
      vm.products.data.map(function(product){
        let pushProduct={};
        pushProduct['id']=product.ProductId;
        pushProduct['name']=product.ProductName;
        pushProduct['stock_quantity']=product.Stock;
        pushProduct['brand']=product.Brand;
        pushProduct['barcode']=product.Barcode;
        pushProduct['is_new']=product.IsNewProduct;

        let rate='';
        if(product.CommentRate==0){
          rate=0;
        }	
        else if(product.CommentRate<=20){
          rate=1;
        }
        else if(product.CommentRate<=40){
          rate=2;
        }
        else if(product.CommentRate<=60){
          rate=3;
        }
        else if(product.CommentRate<=80){
          rate=4;
        }
        else if(product.CommentRate<=100){
          rate=5;
        }
        if(rate!=0){
          pushProduct['rating']=rate;
        }

        if(product.Stock>0){
          pushProduct['available']=true;
        }else{
          pushProduct['available']=false;
        }
        pushProduct['price']=product.SellingPriceVatIncluded;
       
        if(product.ImageUrl!=null){
          pushProduct['picture']=vm.baseUrl+product.ImageUrl;
        }else{
          pushProduct['picture']=vm.baseUrl+"veri-girisi-50-10-57-K.jpg"
        }
        if(product.DefaultCategoryId!=''){
          pushProduct['categories']=[]
          product.Categories.map(cat => pushProduct['categories'].push(cat.CategoryId));
        }
        pushProduct['currency']=product.Currency;
        pushProduct['url']=vm.baseUrl+product.SeoLink;
        postDataProducts.push(pushProduct);
      });
      console.log("postDataProducts")
      console.log(postDataProducts)

      // ÜRÜNLERİN SİLİNİYOR

      vm.axios({
        method:'PATCH',
        headers: { 'Content-Type': 'application/json' },
        url: 'https://api.personaclick.com/import/products',
        data: {
          'shop_id' : this.personaSettings['storeKey'],
          'shop_secret' : this.personaSettings['secretKey'],
          'items' : []
        }
      }).then(function (response) {
        console.log("Persona ürün silme başarılı ");
        console.log(response);
        
      }).catch (function (error){
        console.log(error)
      })

      // ÜRÜNLER PERSONAYA POST EDİLİYOR
      vm.axios({
        method:'PUT',
        headers: { 'Content-Type': 'application/json' },
        url: 'https://api.personaclick.com/import/products',
        data: {
          'shop_id' : this.personaSettings['storeKey'],
          'shop_secret' : this.personaSettings['secretKey'],
          'items' : postDataProducts
        }
      }).then(function (response) {
        console.log("Persona product post başarılı ");
        console.log(response);
        
      }).catch (function (error){
        console.log(error)
      })
    },
    getCategories(){
        const vm = this;
        this.axios({
          method: 'post',
          url: this.baseUrl+this.wsUrl['getCategories'],
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {'limit':500}
        }).then(function (response) {
          vm.postCategories(response.data.data)
        }).catch((error) => {
          console.log(error)
        }); 

      // $data .=  '<categories>';
				
				
			// 	$url = $site."rest1/category/getCategories";

			// 	$fields = array( 'token' => $token);

			// 	$ch = curl_init();
			// 	curl_setopt($ch, CURLOPT_URL, $url);
			// 	curl_setopt($ch, CURLOPT_POST, 1);
			// 	curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
			// 	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

			// 	$response = curl_exec($ch);
			// 	curl_close($ch);
				
			// 	$obj = json_decode($response,true);
				
			// 	$totalRow = $obj["summary"]["totalRecordCount"];
				
			// 	$limit=500;
			// 	$toplam_sayfa = ceil($totalRow / $limit);
				
			// 	for($i = 1; $i <= $toplam_sayfa; $i++){
					
			// 		$start = ($i*$limit) - $limit;
			// 		// Get Categoris
			// 		$url = $site."rest1/category/getCategories";

			// 		$fields = array( 'token' => $token,
			// 		'start' => $start,
			// 		'limit' => $limit,
			// 		'f' => 'IsActive | true | equal',
			// 		'columns' => 'CategoryId,ParentCode,CategoryName,SeoLink,CategoryName,IsActive',
			// 		'orderby' => 'CategoryId ASC');

			// 		$ch = curl_init();
			// 		curl_setopt($ch, CURLOPT_URL, $url);
			// 		curl_setopt($ch, CURLOPT_POST, 1);
			// 		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
			// 		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
			// 		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

			// 		$response = curl_exec($ch);
			// 		curl_close($ch);
			// 		$json=json_decode($response,true);
					
					
			// 		$arr=$json["data"];
			// 		foreach($arr as $key=>$value){
						
			// 			$data .=  '<category id="'.$value["CategoryId"].'" url="'.$site.$value["SeoLink"].'" ';
			// 			if ($value["ParentCode"]!=0){
			// 				$data .=  'parentId="'.$value["ParentCode"].'"';
			// 			}	
			// 			$data .=  '>'.bulDegistir($value["CategoryName"]);
			// 			$data .=  '</category>';
			// 		}
					
			// 	}
				
				
				
			// $data .=  '</categories>';
    },
    async getProducts(){
        const vm = this;
        await this.axios({
          method: 'post',
          url: this.baseUrl+this.wsUrl['getProducts'],
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          data: {
            'limit' : 500,
            'start' : this.start,
            'FetchAllCategories': true
          }
        }).then(function (response) {
          console.log(vm.products.data.length)
          if(vm.products.data.length==response.data.summary.totalRecordCount){
            vm.postProducts();
            return false
          }else{
            vm.products.data.push(...response.data.data)
            vm.products.totalCount=response.data.summary.totalRecordCount
            vm.start=vm.start+500
            vm.getProducts()
          }
        }).catch((error) => {
          console.log(error)
        }); 
    }
  },
  watch :{
    startGetProduct:{
      handler(val) {
        if(val){
          this.getProducts();
          this.getCategories();
        }
      }
    }
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
