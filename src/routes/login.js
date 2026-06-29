import express from "express"
const users = [{
    id : "uuID",
    username : "Umar",
    password : "umar123"
    },
    {
    id : "ytu7x",
    username : "Arslan",
    password : "arslan123"
    }]

const router = express.Router()

router.post("/", (req, res, next)=>{
    let user = req.body
    console.log(user)
    if(user &&  Object.keys(user).length !== 0){
        let validUser = users.find(u => u.username === user.username)
        if(validUser && user.password === validUser.password){
            req.session.userId = validUser.id
            return res.redirect("/")  // redirecting to index.html page
        }
        else{
            return res.status(400).json({"message" : "Invalid username or password"})
        }
    } else {
        let error = new Error("Body required")
        error.status = 400
        next(error)
    }
})

export default router