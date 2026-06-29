import { getDB } from "../config/db.js"
import { ObjectId } from "mongodb"

const findProducts = async (limit) =>{
    let db = getDB()
    let productsCollection = db.collection("products")

    let query = productsCollection.find()
    console.log('limit inside model',limit)
    if(limit && limit > -1){
        query = query.limit(limit)
    }

    return await query.toArray()
}

const findProductById = async (id) => {
    if(id){
        return await getDB().collection("products").findOne({_id : new ObjectId(id)})
    }
}
const insertProduct = async (data) =>{
    let db = getDB()
    let productsCollection = db.collection("products")

    return await productsCollection.insertOne(data)
}
const updateProductById = async (id, updateData) => {
    let db = getDB()
    let productsCollection = db.collection("products")

    return await productsCollection.updateOne({_id : new ObjectId(id)}, {$set : updateData})
}
const deleteProductById = async(id) => {
    let db = getDB()
    let productsCollection = db.collection("products")

    return await productsCollection.deleteOne({_id : new ObjectId(id)})
    
}
export {findProducts, insertProduct, deleteProductById, updateProductById, findProductById}