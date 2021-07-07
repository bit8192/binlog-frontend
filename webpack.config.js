import { VueLoaderPlugin } from 'vue-loader'

module.exports = {
    // mode: "development",
    mode: "production",
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.ts$/,
                loader: "ts-loader",
                options: { appendTsSuffixTo: [/\.vue$/] }
            },
            {
                test: /\.css$/,
                loader: "css-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
                options: { appendTsSuffixTo: [/\.vue$/] }
            }
        ]
    },
    plugins: [
        VueLoaderPlugin
    ]
}