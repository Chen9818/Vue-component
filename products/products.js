import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

let productModal = ''
let delProductModal = ''

const app = createApp({
	data() {
		return {
			url:"https://vue3-course-api.hexschool.io/v2",
			apiPath:"wei-z",
			isNew: false,
			showProducts:[],	//渲染商品表格用
			showOneProduct:[],	//查詢特定商品細節用
			pagination: {},
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
				})
				.catch((error) => {
					window.location.href = "../login/login.html"
					alert(error.data.message)
				})
		},

		showProduct(page = 1){
			axios.get(`${this.url}/api/${this.apiPath}/admin/products?page=${page}`)
				.then((res)=>{
					const { products, pagination } = res.data;
					this.showProducts = products;
					this.pagination = pagination;
					this.showOneProduct = ""
				})
				.catch((error)=>{
					window.location.href = "../login/login.html"
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
				this.tempProduct = JSON.parse(JSON.stringify(item))
				this.isNew = false
				productModal.show()     //show出modal，hide隱藏
			} else if (isNew === "delete") {
				this.tempProduct = JSON.parse(JSON.stringify(item))
				delProductModal.show()
			}
		},
	},
	mounted() {
		//在cookie中帶入token
		// const token = ('; '+document.cookie).split(`; COOKIE_NAME=`).pop().split(';')[3].split("token=")[1];
		const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")
		axios.defaults.headers.common["Authorization"] = token
		this.checkLogin()
	}
})

// 分頁元件
app.component('pagination', {
	template: '#pagination',
	props: ['pages'],
	methods: {
		emitPages(item) {
			this.$emit('emit-pages', item);
		},
	},
});


// 產品新增/編輯元件
app.component('productModal', {
	template: '#productModal',
	props: ['product', 'isNew'],
	data() {
		return {
			apiUrl: 'https://vue3-course-api.hexschool.io/v2',
			apiPath: 'wei-z',
			modal: null,
		};
	},
	mounted() {
		productModal = new bootstrap.Modal(document.getElementById('productModal'));
	},
	methods: {
	updateProduct() {
		// 新增商品
		let api = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
		let httpMethod = 'post';
		// 編輯商品 
		if (!this.isNew) {
			api = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
			httpMethod = 'put';
		}
		axios[httpMethod](api, { data: this.product })
		.then((response) => {
			alert(response.data.message);
			this.hideModal();
			this.$emit('update');
		}).catch((error) => {
			alert(error.data.message);
		});
	},
	createImages() {
		this.product.imagesUrl = [];
		this.product.imagesUrl.push('');
	},
	openModal() {
		productModal.show();
	},
	hideModal() {
		productModal.hide();
	},
},
})

  // 產品刪除元件
app.component('delProductModal', {
	template: '#delProductModal',
	props: ['item','currentPage'],
	data() {
		return {
			apiUrl: 'https://vue3-course-api.hexschool.io/v2',
			apiPath: 'wei-z',
			modal: null,
		};
	},
	mounted() {
		delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
	},
	methods: {
	delProduct() {
		axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`)
		.then((response) => {
			this.hideModal();
			this.$emit('update',this.currentPage);
		}).catch((error) => {
			alert(error.data.message);
		});
	},
	openModal() {
		delProductModal.show();
	},
	hideModal() {
		delProductModal.hide();
	},
},
});


app.mount('#app');