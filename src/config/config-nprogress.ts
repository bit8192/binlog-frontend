import axios from "axios";
import NProgress from 'nprogress';
import router from "@/router";

export default function configNProgress(): void{
    NProgress.configure({
        showSpinner: true
    });

    //请求数量，当请求数量大于0时打开加载进度条，小于等于0时关闭加载进度条
    let requestNum = 0
    //增加请求数量
    function addRequestNum(){
        requestNum ++
        if(!NProgress.isStarted()) NProgress.start()
    }
    //减少请求数量
    function subtractRequestNum(){
        requestNum --
        if(requestNum <= 0){
            NProgress.done()
        }
    }
    //请求拦截
    axios.interceptors.request.use(request=>{
        addRequestNum()
        return request
    });
    axios.interceptors.response.use(response=>{
        subtractRequestNum()
        return response
    },e => {
        subtractRequestNum()
        return Promise.reject(e)
    });
    //路由拦截
    router.beforeEach((to, from,next)=>{
        if(to.name !== from.name) addRequestNum()
        next()
    })
    router.afterEach(()=>{
        subtractRequestNum()
    })
}