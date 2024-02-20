// to catch the async errors in route handlers..
const asyncError = (passedFunc) => (req, res) => {
    return Promise.resolve(passedFunc(req, res)).catch((error) => {
        console.log(error)
        return res.status(500).json({success:false,message: error.message});
    })
}

module.exports = { asyncError }