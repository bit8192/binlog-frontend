const {merge} = require("webpack-merge")
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')
const webpack = require("webpack");

const isDevelopment = process.env.NODE_ENV === "development"
module.exports = merge(require('./webpack.base.config'), {
    target: "node",
    devtool: "source-map",
    output: {
        libraryTarget: 'commonjs2'
    },
    externals: nodeExternals({
        allowlist: /\.css$/
    }),
    plugins: [
        new VueSSRServerPlugin(),
        // new webpack.DefinePlugin({
        //     document: undefined
        // })
    ]
})
