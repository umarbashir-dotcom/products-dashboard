import express from "express"

const router = express.Router()

router.get("/", (req, res, next) =>{
    if(req.session.userId){
        return res.status(200).json({authenticated: true})
    }

    res.status(400).json({authenticated: false})
})

export default router