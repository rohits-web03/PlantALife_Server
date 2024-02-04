import connectDB from "./db/index.js";
import { app } from "./app.js";

const port=process.env.PORT || 8000;

connectDB().then(()=>{
    app.on("error",(error)=>{
        console.error("Error for Express: ",error);
        throw error;
    })
    app.listen(port,()=>{
        console.log(`Server running on port ${port}`)
    })
})
.catch(err=>{
    console.log("MongoDB connection failed!!!!",err);
})