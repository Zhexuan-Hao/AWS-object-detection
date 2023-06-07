const {createProxyMiddleware: proxy} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        proxy('/tags', { 
            target: 'https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/tags',
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/tags': '' }
        }),
        proxy('/files', { 
            target: 'https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/filename/',
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/files': '' }
        }),
        proxy('/delete', { 
            target: 'https://bolnwx1949.execute-api.us-east-1.amazonaws.com/alpha/',
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/delete': '' }
        }),
        proxy('/upload', { 
            target: 'https://p1gjg7c96e.execute-api.us-east-1.amazonaws.com/dev',
            secure: false,
            changeOrigin: true,
            pathRewrite: { '^/upload': '' }
        }),
    )
}