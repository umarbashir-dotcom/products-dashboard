const errorHandler = (error, req, res, next) =>{
    if(error.status){
        return res.status(error.status).json({"error" : error.message})
    }else{
        return res.status(500).json({"error" : "Server error"})
    }

}

export default errorHandler