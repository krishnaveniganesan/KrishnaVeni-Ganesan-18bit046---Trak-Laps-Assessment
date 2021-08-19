module.exports = {
    DATABASE_URL : (process.env.DATABASE_URL) + '?ssl=true',
    NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
}