/**
 * Created by litao on 2018/8/9.
 */
//引入工具类
const path = require('path');
const packageJson = require('../../package.json');

module.exports = {
    dev: {
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            "/sys/attachment/*": {
                target: 'http://127.0.0.1:9090'
            },
            "/import/excel/*": {
                target: 'http://127.0.0.1:9090'
            },
            "/export/excel/*": {
                target: 'http://127.0.0.1:9090'
            },
            "/template/download/*": {
                target: 'http://127.0.0.1:9090',
                pathRewrite: {
                    '^/template/download': '/'
                }
            },
            "/bdApiAuth/*": {
                changeOrigin: true,
                target: 'https://openapi.baidu.com',
                pathRewrite: {
                    "/bdApiAuth": ""
                }
            },
            "/oauth2/login/*": {
                target: 'http://127.0.0.1:8080'
            },
            "/__api/*": {
                target: 'http://127.0.0.1:9988',
                pathRewrite: {
                    "/__api": ""
                }
            }
        },
        host: '127.0.0.1',
        port: 9826,
        autoOpenBrowser: true,
        errorOverlay: true,
        notifyOnErrors: false,
        poll: false,

        devtool: '#cheap-source-map',
        cacheBusting: true,

        cssSourceMap: false,
    },

    build: {
        index: path.resolve(__dirname, '../../docker/dist/index.html'),

        assetsRoot: path.resolve(__dirname, '../../docker/dist'),
        assetsSubDirectory: 'static',

        assetsPublicPath: '/',

        productionSourceMap: false,
        devtool: '#source-map',

        productionGzip: true,
        productionGzipExtensions: ['js', 'css'],

        bundleAnalyzerReport: process.env.npm_config_report
    }
};
