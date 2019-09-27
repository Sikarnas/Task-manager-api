function logAll (req, res, next) {
    const info = {}
    info.headers = req.headers
    info.body = req.body
    console.log(info)
    next()
}

module.exports = logAll