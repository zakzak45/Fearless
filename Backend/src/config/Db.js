const mongoose = require('mongoose')
const dotenv  = require('dotenv')

dotenv.config()

const MONGODB_URL = process.env.MONGODB_URL;

const Connect = async ()=>{
    try{
     const conn = await mongoose.connect(MONGODB_URL);
     console.log("connected to database")
    }catch(error){
     console.error(`error ${error}`)
  
    }
}



module.exports = Connect;