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
    //自动倒入没有提示，IDE会出现警告，索性手敲
    // css: {
    //     loaderOptions: {
    //         sass: {
    //             additionalData: `
    //             @import "src/style/common.scss";
    //             `
    //         }
    //     }
    // }
}