const requireAuth = (req, res, next) => {
    if (!req.session.userId){
        return res.status(400).json({authenticated: false})
    }

    next()
}

export default requireAuth