// import mongoose from "mongoose";
// const cached = global.mongoose || { conn: null, promise: null }

// export default async function connectDB() {
//     if(cached.conn) return cached.conn;
//     if(!cached.promise){
//         cached.promise = mongoose.connect(process.env.MONGODB_URI)
//         .then((mongoose) => mongoose);
//     }

//     try {
//         cached.conn = await cached.promise;
//     } catch (error) {
//         console.error("MongoDB connection error:", error);
//     }
//     return cached.conn;
// }


import mongoose from "mongoose";

// Global type declaration to store the connection

declare global {
    var mongoose: {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null
    }
}

const MONGODB_URI = process.env.MONGODB_URI

if(!MONGODB_URI){
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local")
}

const cached = global.mongoose || {conn: null, promise: null}

export default async function connectDB(){
    if(cached.conn) return cached.conn;
    if(!cached.promise){
        cached.promise = mongoose.connect(MONGODB_URI!)
        .then((mongoose) => mongoose)
    }

    try {
        cached.conn = await cached.promise
    } catch (error) {
        console.error("MongoDB connection error:", error);
        cached.promise = null; // Reset the promise on failure
        throw error; // Re-throw the error after logging it        
    }

    return cached.conn
}