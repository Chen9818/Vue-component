let productModal = ""
let delProductModal = ""

Vue.createApp({
	data() {
		return {
			url:"https://vue3-course-api.hexschool.io/v2",
			apiPath:"wei-z",
			allProducts:[],
			isNew: false,
			showProduct:[],
			tempProduct: {
				imagesUrl:[],
			},
			productModal:"",
			delProductModal:""
		}
	},
	methods: {
		checkLogin(){
			axios.post(`${this.url}/api/user/check`)
				.then((res) => {
					console.log(res)
					this.getProducts()
				})
				.catch((error) => {
					console.log(error.response)
					window.location.href = "login.html"
					alert("url出錯")
				})
		},
		getProducts(){
			axios.get(`${this.url}/api/${this.apiPath}/admin/products`)
				.then((res)=>{
					console.log(res)
					this.allProducts = res.data.products
				})
				.catch((error)=>{
					console.log(error)
					window.location.href = "login.html"
					alert("url或token出錯")
				})
		},
    
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
				productModal.show()
			} else if (isNew === "delete") {
				this.tempProduct = { ...item }
				delProductModal.show()
			}
		},
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
				this.getProducts()
			}).catch((error) => {
				alert(error.data.message)
			})
		},
	},
	mounted() {
		productModal = new bootstrap.Modal(document.getElementById("productModal"))
		delProductModal = new bootstrap.Modal(document.getElementById("delProductModal"))

		//在cookie中帶入token
		// const token = ('; '+document.cookie).split(`; COOKIE_NAME=`).pop().split(';')[3].split("token=")[1];
		const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")
		axios.defaults.headers.common["Authorization"] = token
		this.checkLogin()
	}
}).mount("#app")