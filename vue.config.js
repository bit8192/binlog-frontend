module.exports = {
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                secure: false,
                ws: false,
            }
        }
    },
    chainWebpack: config =>{
        config.plugin('html')
            .tap(args=>{
                args[0].title = "Bincker的个人博客";
                return args;
            })
    }
}
