Vue.createApp({
    data() {
        return {
            user:{
                "username": "",
                "password": ""
            }
        }
    },
    methods: {
        login(){
            let url = "https://vue3-course-api.hexschool.io/v2/admin/signin"
            axios({
                method:"post",
                url:url,
                data:this.user
            })
            .then(res=>{
                console.log(res)
                const { token, expired } = res.data;
                document.cookie = `token=${token};expires=${new Date(expired)}; path=/`;
                window.location.href = "../products/products.html" //跳轉到商品頁面
            })
            .catch(error=>{
                alert(error.data.message)
            })
        }
    },
}).mount("#app")