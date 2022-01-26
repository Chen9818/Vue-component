let productModal = ""
let delProductModal = ""

Vue.createApp({
	data() {
		return {
			url:"https://vue3-course-api.hexschool.io/v2",
			apiPath:"wei-z",
			allProducts:"",		//對商品編輯、新增、刪除用
			isNew: false,
			showProducts:[],	//渲染商品表格用
			showOneProduct:[],	//查詢特定商品細節用
			tempProduct: {
				imagesUrl:[],
			},
		}
	},
	methods: {
		checkLogin(){
			axios.post(`${this.url}/api/user/check`)
				.then((res) => {
					console.log(res)
					this.showProduct()
					this.getProducts()
				})
				.catch((error) => {
					window.location.href = "login.html"
					alert(error.data.message)
				})
		},

		//渲染商品表格用(array)
		showProduct(){
			axios.get(`${this.url}/api/${this.apiPath}/admin/products`)
				.then((res)=>{
					console.log(res)
					this.showProducts = res.data.products
				})
				.catch((error)=>{
					window.location.href = "login.html"
					alert(error.data.message)
				})
		},

		//對商品編輯、新增、刪除用(object)
		getProducts(){
			axios.get(`${this.url}/api/${this.apiPath}/admin/products/all`)
				.then((res)=>{
					console.log(res)
					this.allProducts = res.data.products
				})
				.catch((error)=>{
					window.location.href = "login.html"
					alert(error.data.message)
				})
		},
    
		//新增、編輯、刪除
		openModal(isNew, item) {
			if (isNew === "new") {
				this.tempProduct = {
					imagesUrl: [],
				}
				this.isNew = true
				productModal.show()
			} else if (isNew === "edit") {
				this.tempProduct = { ...item }
				this.isNew = false
				productModal.show()     //show出modal，hide隱藏
			} else if (isNew === "delete") {
				this.tempProduct = { ...item }
				delProductModal.show()
			}
		},

		//新增、編輯產品
		updateProduct(){
			let url = `${this.url}/api/${this.apiPath}/admin/product`
			let http = "post"

			if (!this.isNew) {
				url = `${this.url}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
				http = "put"
			}
			axios[http](url, { data: this.tempProduct })
				.then((res) => {
					alert(res.data.message)
					productModal.hide()
					this.showProduct()
					this.getProducts()
				})
				.catch((error) => {
					alert(error.data.message)
				})
		},

		delProduct() {
			const url = `${this.url}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`
			axios.delete(url).then((res) => {
				alert(res.data.message)
				delProductModal.hide()
				this.showProduct()
				this.getProducts()
			}).catch((error) => {
				alert(error.data.message)
			})
		},
		createImages() {
			//編輯產品內新增副圖
			this.tempProduct.imagesUrl = [];
			this.tempProduct.imagesUrl.push('');
		},
	},
	mounted() {
		//利用js操作BS5 modal
		productModal = new bootstrap.Modal(document.getElementById("productModal"))
		delProductModal = new bootstrap.Modal(document.getElementById("delProductModal"))

		//在cookie中帶入token
		// const token = ('; '+document.cookie).split(`; COOKIE_NAME=`).pop().split(';')[3].split("token=")[1];
		const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")
		axios.defaults.headers.common["Authorization"] = token
		this.checkLogin()
	}
}).mount("#app")