// noinspection NodeCoreCodingAssistance
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

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
    outputDir: path.resolve("../binlog/target/classes/static")
}
