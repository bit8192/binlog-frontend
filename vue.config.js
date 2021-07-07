// noinspection NodeCoreCodingAssistance
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                secure: false,
                ws: false,
            }
        }
    },
    outputDir: path.resolve("../binlog/target/classes/static")
    //自动倒入没有提示，IDE会出现警告，索性手敲
    // css: {
    //     loaderOptions: {
    //         sass: {
    //             additionalData: `
    //             @import "src/style/mixin-common.scss";
    //             `
    //         }
    //     }
    // }
}