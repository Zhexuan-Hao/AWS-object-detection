const {createProxyMiddleware: proxy} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy('/tags', { 
            target: 'https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/tags',
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/tags': '' }
        }),
    )
}