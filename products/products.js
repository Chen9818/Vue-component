Vue.createApp({
  data() {
    return {
      url:"https://vue3-course-api.hexschool.io/v2",
      apiPath:"wei-z",
      allProducts:[],
      showProduct:[]
    }
  },
  methods: {
    checkLogin(){
      axios.post(`${this.url}/api/user/check`)
      .then((res)=>{
        console.log(res);
        this.getProducts()
      })
      .catch((error)=>{
        console.log(error.response);
        window.location.href = "login.html"
        alert("url出錯")
      })
    },
    getProducts(){
      axios.get(`${this.url}/api/${this.apiPath}/admin/products`)
      .then((res)=>{
        console.log(res);
        this.allProducts = res.data.products
      })
      .catch((error)=>{
        console.log(error);
        window.location.href = "login.html"
        alert("url或token出錯")
      })
    }
  },
  mounted() {
    // const token = ('; '+document.cookie).split(`; COOKIE_NAME=`).pop().split(';')[3].split("token=")[1];
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common['Authorization'] = token
    // console.log(token);
    this.checkLogin()
  }
}).mount("#app")