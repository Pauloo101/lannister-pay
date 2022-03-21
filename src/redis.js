const redis = require('redis');
const client = redis.createClient({
    url: 'valid/redis/url'
    })


module.exports = {
    client
}