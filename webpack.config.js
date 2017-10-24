var webpack = require('webpack');
module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        path: "dist", // string
        publicPath: '', // 输出解析文件的目录，url 相对于 HTML 页面
        filename: 've-touch.min.js'
    },
    plugins: [
        //删除警示代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })

    ],
    watch: false
}