import { MongoClient } from "mongodb"

const uri = process.env.MONGO_URI
let db;

const connectDB = async () =>{
    try{
        const client = new MongoClient(uri)
        await client.connect()
        console.log("MongoDB Connected")
        db = client.db("store_db")  // db name
    } catch(error){
        console.log(`Connection Failed: ${error.message}`)
    }
}

const getDB = () =>{
    if (!db) throw new Error("DB not connected.Run connectDB() first")
    
    return db
}

export {connectDB, getDB}