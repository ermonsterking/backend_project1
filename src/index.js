import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

// Load environment variables
dotenv.config({ path: "./.env" }); // make sure file is named ".env" not "env"

// Create express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("✅ Server is working fine 🚀");
});

// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`✅ Server is running at PORT : ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed !!!", err);
  });

/*

import express from "express"
const app = express()

( async ()=> {
    try {
         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
         app.on("error",(error) => {
            console.log("ERRR: ",error);
            throw error
         })

         app.listen(process.env.PORT, () => {
            console.log(`App is listening on port {process.env.PORT}`);
         })
    }catch{error}{
        console.error("ERROR:",error)
        throw err
    }
}) ()

*/



