const {merge} = require("webpack-merge");
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

module.exports = merge(require("./webpack.base.config"),{
    plugins: [
        new VueSSRClientPlugin()
    ]
})
