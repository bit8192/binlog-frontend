
const packageServer = process.env.WEBPACK_TARGET === "server"
module.exports = {
    mode: process.env.NODE_ENV,
    entry: packageServer ? "./src/entry-server.ts" : "./src/entry-client.ts",
    optimization: {splitChunks: packageServer ? false : {chunks: 'all', name: 'common'}},
}
