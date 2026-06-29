import {findProducts, insertProduct, deleteProductById, updateProductById, findProductById} from "../models/productModel.js"

const getProducts = async (req, res, next) =>{
    const limit = req.query.limit
    if (limit){
        limit = Number(limit)
    }
    console.log('limit inside controller',limit)
    const products = await findProducts(limit)
    console.log(products)
    return res.status(200).json(products)
}

const getProductById = async (req, res, next) => {
    const id = req.params.id
    const product = await findProductById(id)
    return res.status(200).json(product)
}
const addProduct = async (req, res, next) =>{
    let data = req.body
    let errMsg;
    let statusCode;
    try{
        if(data && data !== {}){
            let created = await insertProduct(data)
            if(created.insertedId){
                return res.status(201).json({_id : created.insertedId, ...data})
            }
            errMsg = "DB error"
            statusCode = 500
        } else{
            errMsg = "Request body required"
            statusCode = 400 
        }
        let err = new Error(errMsg)
        err.status = statusCode
        throw err
    } catch(err) {
        console.log(err.message)
        next(err)
    }
}
const updateProduct = async (req, res, next) => {
    let updateData = req.body
    let id = req.params.id

    let result = await updateProductById(id, updateData)
    if(result.matchedCount !== 0)
        return res.status(200).json({_id : id , ...updateData})


}
const deleteProduct = async (req, res, next) =>{
    const id = req.params.id

    let result = await deleteProductById(id)
    if (result.deletedCount !== 0){
        return res.status(200).json({"message" : "Product Deleted Successfully", "success" : true})
    }

    let err = new Error(`Product with id ${id} was not found`)
    err.status = 404
    next(err)
        
}
export { getProducts, addProduct, deleteProduct, updateProduct, getProductById}