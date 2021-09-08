// noinspection NodeCoreCodingAssistance
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const isDevelopment = process.env.NODE_ENV === "development";
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
    },
    outputDir: isDevelopment || process.env.WEBPACK_TARGET !== undefined ? "dist" : path.resolve("../binlog/target/classes/static"),
    configureWebpack: process.env.WEBPACK_TARGET !== undefined ? require(`./webpack.${process.env.WEBPACK_TARGET}.config`) : undefined
}
