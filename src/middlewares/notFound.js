const notFound = (req, res, next) =>{
    let error = new Error("Route Not Found")
    error.status = 404
    next(error)
}

export default notFound