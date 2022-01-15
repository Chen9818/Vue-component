Vue.createApp({
    data() {
        return {
            user:{
                "username": "wwenba2k@gmail.com",
                "password": "a878702487"
              }
        }
    },
    methods: {
        login(){
            url = "https://vue3-course-api.hexschool.io/v2/admin/signin"
            axios({
                method:"post",
                url:url,
                data:this.user
            })
            .then(res=>{
                console.log(res)
                document.cookie = `token=${res.data.token}`
                window.location.href = 'products.html' //跳轉到商品頁面
            })
            .catch(error=>{console.log(error);})
        }
    },
    mounted() {

    },
}).mount("#app")